import React, { useState } from 'react';
import { usePostgresQuery } from '../../hooks/usePostgresQuery';
import { MdInventory2 } from 'react-icons/md';
import './InventarioDashboard.css';

const InventarioDashboard = () => {
  const { data, loading, error, refetch } = usePostgresQuery('inventario-consolidado');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterAlmacen, setFilterAlmacen] = useState('');
  const [sortBy, setSortBy] = useState('nombre_producto');

  // Filter data based on selected filters
  const filteredData = data.filter(item => {
    const estadoMatch = !filterEstado || item.estado_stock === filterEstado;
    const almacenMatch = !filterAlmacen || item.nombre_almacen === filterAlmacen;
    return estadoMatch && almacenMatch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return (aVal || 0) - (bVal || 0);
  });

  // Get unique values for filters
  const estados = [...new Set(data.map(item => item.estado_stock))];
  const almacenes = [...new Set(data.map(item => item.nombre_almacen))];

  // Calculate summary statistics
  const summary = {
    totalProductos: data.length,
    totalValor: data.reduce((sum, item) => sum + (item.valor_inventario || 0), 0),
    agotados: data.filter(item => item.estado_stock === 'Agotado').length,
    bajoStock: data.filter(item => item.estado_stock === 'Stock Bajo').length,
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Agotado':
        return '#ff4757';
      case 'Stock Bajo':
        return '#ffa502';
      case 'Sobrestock':
        return '#3498db';
      case 'Normal':
        return '#2ed573';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="inventario-dashboard loading">
        <p>Cargando datos del inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventario-dashboard error">
        <p>Error al cargar el inventario: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="inventario-dashboard">
      <div className="dashboard-header">
        <h2><MdInventory2 style={{marginRight: "8px", display: "inline", verticalAlign: "middle"}} />Dashboard de Inventario Consolidado</h2>
        <button className="btn-refresh" onClick={refetch}>↻ Actualizar</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-value">{summary.totalProductos}</div>
          <div className="summary-label">Total Productos</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">${summary.totalValor.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</div>
          <div className="summary-label">Valor Total</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-value">{summary.bajoStock}</div>
          <div className="summary-label">Bajo Stock</div>
        </div>
        <div className="summary-card danger">
          <div className="summary-value">{summary.agotados}</div>
          <div className="summary-label">Agotados</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Estado de Stock</label>
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Almacén</label>
          <select value={filterAlmacen} onChange={(e) => setFilterAlmacen(e.target.value)}>
            <option value="">Todos</option>
            {almacenes.map(almacen => (
              <option key={almacen} value={almacen}>{almacen}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="nombre_producto">Nombre Producto</option>
            <option value="cantidad_actual">Cantidad</option>
            <option value="precio">Precio</option>
            <option value="valor_inventario">Valor Inventario</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Almacén</th>
              <th>Cantidad Actual</th>
              <th>Cantidad Mínima</th>
              <th>Ubicación</th>
              <th>Precio Unitario</th>
              <th>Valor Inventario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className={`estado-${item.estado_stock.toLowerCase().replace(' ', '-')}`}>
                <td className="nombre-producto">{item.nombre_producto}</td>
                <td>{item.nombre_categoria}</td>
                <td>{item.nombre_almacen}</td>
                <td className="cantidad">{item.cantidad_actual}</td>
                <td className="cantidad-minima">{item.cantidad_minima}</td>
                <td className="ubicacion">{item.ubicacion_fisica}</td>
                <td className="precio">${item.precio.toFixed(2)}</td>
                <td className="valor">${item.valor_inventario.toFixed(2)}</td>
                <td>
                  <span
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(item.estado_stock) }}
                  >
                    {item.estado_stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="empty-state">
          <p>No hay productos que coincidan con los filtros seleccionados</p>
        </div>
      )}

      <div className="table-footer">
        <p>Total de registros mostrados: {sortedData.length} de {data.length}</p>
      </div>
    </div>
  );
};

export default InventarioDashboard;
