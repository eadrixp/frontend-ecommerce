import React, { useState } from 'react';
import { usePostgresQuery } from '../../hooks/usePostgresQuery';
import './MovimientosInventario.css';

const MovimientosInventario = () => {
  const { data, loading, error, refetch } = usePostgresQuery('movimientos-recientes');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterAlmacen, setFilterAlmacen] = useState('');
  const [filterUsuario, setFilterUsuario] = useState('');
  const [sortBy, setSortBy] = useState('fecha_movimiento');

  // Filter data
  const filteredData = data.filter(item => {
    const tipoMatch = !filterTipo || item.tipo_movimiento === filterTipo;
    const almacenMatch = !filterAlmacen || item.nombre_almacen === filterAlmacen;
    const usuarioMatch = !filterUsuario || item.usuario === filterUsuario;
    return tipoMatch && almacenMatch && usuarioMatch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'fecha_movimiento') {
      return new Date(b.fecha_movimiento) - new Date(a.fecha_movimiento);
    }
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return (aVal || 0) - (bVal || 0);
  });

  // Get unique values for filters
  const tipos = [...new Set(data.map(item => item.tipo_movimiento))];
  const almacenes = [...new Set(data.map(item => item.nombre_almacen))];
  const usuarios = [...new Set(data.map(item => item.usuario))];

  // Calculate statistics
  const stats = {
    totalMovimientos: data.length,
    entradas: data.filter(item => item.tipo_movimiento === 'ENTRADA').length,
    salidas: data.filter(item => item.tipo_movimiento === 'SALIDA').length,
    ajustes: data.filter(item => item.tipo_movimiento === 'AJUSTE').length,
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'ENTRADA':
        return '#2ed573';
      case 'SALIDA':
        return '#ff4757';
      case 'AJUSTE':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'ENTRADA':
        return '📥';
      case 'SALIDA':
        return '📤';
      case 'AJUSTE':
        return '⚙️';
      default:
        return '📋';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="movimientos-inventario loading">
        <p>Cargando movimientos del inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movimientos-inventario error">
        <p>Error al cargar movimientos: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="movimientos-inventario">
      <div className="dashboard-header">
        <h2>📋 Movimientos Recientes del Inventario</h2>
        <button className="btn-refresh" onClick={refetch}>↻ Actualizar</button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMovimientos}</div>
            <div className="stat-label">Total Movimientos</div>
          </div>
        </div>
        <div className="stat-card entrada">
          <div className="stat-icon">📥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.entradas}</div>
            <div className="stat-label">Entradas</div>
          </div>
        </div>
        <div className="stat-card salida">
          <div className="stat-icon">📤</div>
          <div className="stat-info">
            <div className="stat-value">{stats.salidas}</div>
            <div className="stat-label">Salidas</div>
          </div>
        </div>
        <div className="stat-card ajuste">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.ajustes}</div>
            <div className="stat-label">Ajustes</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Tipo de Movimiento</label>
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="">Todos</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
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
          <label>Usuario</label>
          <select value={filterUsuario} onChange={(e) => setFilterUsuario(e.target.value)}>
            <option value="">Todos</option>
            {usuarios.map(usuario => (
              <option key={usuario} value={usuario}>{usuario}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="fecha_movimiento">Fecha (Reciente)</option>
            <option value="cantidad">Cantidad</option>
            <option value="nombre_producto">Producto</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      <div className="timeline-container">
        {sortedData.length > 0 ? (
          <div className="timeline">
            {sortedData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div
                  className="timeline-marker"
                  style={{ backgroundColor: getTipoColor(item.tipo_movimiento) }}
                >
                  <span>{getTipoIcon(item.tipo_movimiento)}</span>
                </div>

                <div className="timeline-content">
                  <div className="content-header">
                    <h3 className="product-name">{item.nombre_producto}</h3>
                    <span
                      className="tipo-badge"
                      style={{ backgroundColor: getTipoColor(item.tipo_movimiento) }}
                    >
                      {item.tipo_movimiento}
                    </span>
                  </div>

                  <div className="content-details">
                    <div className="detail-row">
                      <span className="detail-label">Almacén:</span>
                      <span className="detail-value">{item.nombre_almacen}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cantidad:</span>
                      <span className="detail-value quantity">{item.cantidad} unidades</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Usuario:</span>
                      <span className="detail-value">{item.usuario}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fecha:</span>
                      <span className="detail-value">{formatFecha(item.fecha_movimiento)}</span>
                    </div>
                    {item.motivo && (
                      <div className="detail-row">
                        <span className="detail-label">Motivo:</span>
                        <span className="detail-value">{item.motivo}</span>
                      </div>
                    )}
                    {item.referencia && (
                      <div className="detail-row">
                        <span className="detail-label">Referencia:</span>
                        <span className="detail-value reference">{item.referencia}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No hay movimientos que coincidan con los filtros seleccionados</p>
          </div>
        )}
      </div>

      {sortedData.length > 0 && (
        <div className="table-footer">
          <p>Mostrando {sortedData.length} de {data.length} movimientos</p>
        </div>
      )}
    </div>
  );
};

export default MovimientosInventario;
