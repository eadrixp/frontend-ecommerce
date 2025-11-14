import React, { useState } from 'react';
import { usePostgresQuery } from '../../hooks/usePostgresQuery';
import { MdWarning } from 'react-icons/md';
import './ProductosBajoStock.css';

const ProductosBajoStock = () => {
  const { data, loading, error, refetch } = usePostgresQuery('productos-bajo-stock');
  const [filterAlmacen, setFilterAlmacen] = useState('');
  const [sortBy, setSortBy] = useState('cantidad_actual');

  // Filter data
  const filteredData = filterAlmacen
    ? data.filter(item => item.nombre_almacen === filterAlmacen)
    : data;

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return (aVal || 0) - (bVal || 0);
  });

  const almacenes = [...new Set(data.map(item => item.nombre_almacen))];

  // Calculate statistics
  const stats = {
    totalProductos: data.length,
    cantidadFaltante: data.reduce((sum, item) => sum + item.cantidad_faltante, 0),
    almacenesAfectados: almacenes.length,
  };

  const getPrioridad = (cantidadFaltante, cantidadActual) => {
    if (cantidadActual === 0) return 'CRÍTICA';
    if (cantidadFaltante >= 50) return 'ALTA';
    if (cantidadFaltante >= 20) return 'MEDIA';
    return 'BAJA';
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'CRÍTICA':
        return '#ff4757';
      case 'ALTA':
        return '#ffa502';
      case 'MEDIA':
        return '#ffc107';
      case 'BAJA':
        return '#2ed573';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="productos-bajo-stock loading">
        <p>Cargando productos con bajo stock...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-bajo-stock error">
        <p>Error al cargar productos: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="productos-bajo-stock">
      <div className="dashboard-header">
        <h2>⚠️ Productos con Bajo Stock</h2>
        <button className="btn-refresh" onClick={refetch}>↻ Actualizar</button>
      </div>

      {/* Alert Summary */}
      {data.length > 0 && (
        <div className="alert-summary">
          <div className="alert-box critical">
            <MdWarning style={{marginRight: "8px", display: "inline", verticalAlign: "middle"}} />
            <div>
              <div className="alert-title">Atención Requerida</div>
              <div className="alert-value">{data.length} productos</div>
            </div>
          </div>
          <div className="alert-box warning">
            <MdWarning style={{marginRight: "8px", display: "inline", verticalAlign: "middle"}} />
            <div>
              <div className="alert-title">Unidades Faltantes</div>
              <div className="alert-value">{stats.cantidadFaltante}</div>
            </div>
          </div>
          <div className="alert-box info">
            <MdWarning style={{marginRight: "8px", display: "inline", verticalAlign: "middle"}} />
            <div>
              <div className="alert-title">Almacenes Afectados</div>
              <div className="alert-value">{stats.almacenesAfectados}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Almacén</label>
          <select value={filterAlmacen} onChange={(e) => setFilterAlmacen(e.target.value)}>
            <option value="">Todos los almacenes</option>
            {almacenes.map(almacen => (
              <option key={almacen} value={almacen}>{almacen}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="cantidad_actual">Menor cantidad actual</option>
            <option value="cantidad_faltante">Mayor cantidad faltante</option>
            <option value="nombre_producto">Nombre de producto</option>
          </select>
        </div>
      </div>

      {/* Cards View */}
      <div className="products-cards">
        {sortedData.length > 0 ? (
          sortedData.map((item, index) => {
            const prioridad = getPrioridad(item.cantidad_faltante, item.cantidad_actual);
            const porcentajeFaltante = (item.cantidad_faltante / item.cantidad_minima * 100).toFixed(0);

            return (
              <div
                key={index}
                className={`product-card prioridad-${prioridad.toLowerCase()}`}
              >
                <div className="card-header">
                  <span
                    className="prioridad-badge"
                    style={{ backgroundColor: getPrioridadColor(prioridad) }}
                  >
                    {prioridad}
                  </span>
                  <span className="almacen-badge">{item.nombre_almacen}</span>
                </div>

                <div className="card-content">
                  <h3 className="product-name">{item.nombre_producto}</h3>

                  <div className="stock-info">
                    <div className="info-row">
                      <span className="label">Stock Actual:</span>
                      <span className="value">{item.cantidad_actual} unidades</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Stock Mínimo:</span>
                      <span className="value">{item.cantidad_minima} unidades</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Cantidad Faltante:</span>
                      <span className="value critical">{item.cantidad_faltante} unidades</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min((item.cantidad_actual / item.cantidad_minima) * 100, 100)}%`,
                          backgroundColor: getPrioridadColor(prioridad),
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {porcentajeFaltante}% por debajo del mínimo
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-order">📋 Crear Orden de Compra</button>
                  <button className="btn-details">🔍 Detalles</button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <p>¡Excelente! Todos los productos tienen stock adecuado</p>
          </div>
        )}
      </div>

      {sortedData.length > 0 && (
        <div className="table-footer">
          <p>Total de productos con bajo stock: {sortedData.length}</p>
        </div>
      )}
    </div>
  );
};

export default ProductosBajoStock;
