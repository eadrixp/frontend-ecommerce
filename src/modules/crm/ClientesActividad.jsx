import React, { useState } from 'react';
import { usePostgresQuery } from '../../hooks/usePostgresQuery';
import { FiUsers } from 'react-icons/fi';
import { MdAttachMoney, MdCardGiftcard, MdStar } from 'react-icons/md';
import './ClientesActividad.css';

const ClientesActividad = () => {
  const { data, loading, error, refetch } = usePostgresQuery('clientes-actividad');
  const [sortBy, setSortBy] = useState('valor_total_compras');
  const [filterSegmento, setFilterSegmento] = useState('todos');

  // Categorize clients by their value
  const categorizarCliente = (cliente) => {
    if (cliente.valor_total_compras > 10000) return 'VIP';
    if (cliente.valor_total_compras > 5000) return 'Premium';
    if (cliente.valor_total_compras > 1000) return 'Regular';
    return 'Nuevo';
  };

  // Filter data based on segment
  const filteredData = filterSegmento === 'todos'
    ? data
    : data.filter(cliente => categorizarCliente(cliente) === filterSegmento);

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'valor_total_compras') {
      return b.valor_total_compras - a.valor_total_compras;
    }
    if (sortBy === 'total_ordenes') {
      return b.total_ordenes - a.total_ordenes;
    }
    if (sortBy === 'ultima_compra') {
      return new Date(b.ultima_compra || 0) - new Date(a.ultima_compra || 0);
    }
    return a.nombre_completo.localeCompare(b.nombre_completo);
  });

  // Calculate statistics
  const stats = {
    totalClientes: data.length,
    ventasTotales: data.reduce((sum, c) => sum + c.valor_total_compras, 0),
    ordenesTotales: data.reduce((sum, c) => sum + c.total_ordenes, 0),
    ventaPromedio: data.length > 0 ? data.reduce((sum, c) => sum + c.valor_total_compras, 0) / data.length : 0,
    clientesVIP: data.filter(c => categorizarCliente(c) === 'VIP').length,
  };

  const getSegmentoColor = (segmento) => {
    switch (segmento) {
      case 'VIP':
        return '#ffc107';
      case 'Premium':
        return '#9b59b6';
      case 'Regular':
        return '#3498db';
      case 'Nuevo':
        return '#2ed573';
      default:
        return '#95a5a6';
    }
  };

  const getSegmentoIcon = (segmento) => {
    switch (segmento) {
      case 'VIP':
        return '👑';
      case 'Premium':
        return '⭐';
      case 'Regular':
        return '👤';
      case 'Nuevo':
        return '✨';
      default:
        return '📌';
    }
  };

  const diasDesdeUltimaCompra = (fecha) => {
    if (!fecha) return null;
    const dias = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `${dias} días`;
    if (dias < 30) return `${Math.floor(dias / 7)} semanas`;
    return `${Math.floor(dias / 30)} meses`;
  };

  if (loading) {
    return (
      <div className="clientes-actividad loading">
        <p>Cargando actividad de clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clientes-actividad error">
        <p>Error al cargar clientes: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="clientes-actividad">
      <div className="dashboard-header">
        <h2><FiUsers style={{marginRight: "8px", display: "inline", verticalAlign: "middle"}} />Actividad de Clientes (CRM)</h2>
        <button className="btn-refresh" onClick={refetch}>↻ Actualizar</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon"><FiUsers size={24} /></div>
          <div className="card-content">
            <div className="card-value">{stats.totalClientes}</div>
            <div className="card-label">Total de Clientes</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon"><MdAttachMoney size={24} /></div>
          <div className="card-content">
            <div className="card-value">${stats.ventasTotales.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</div>
            <div className="card-label">Ventas Totales</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon"><MdCardGiftcard size={24} /></div>
          <div className="card-content">
            <div className="card-value">{stats.ordenesTotales}</div>
            <div className="card-label">Órdenes Totales</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon"><MdStar size={24} /></div>
          <div className="card-content">
            <div className="card-value">{stats.clientesVIP}</div>
            <div className="card-label">Clientes VIP</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Segmento de Cliente</label>
          <select value={filterSegmento} onChange={(e) => setFilterSegmento(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
            <option value="Regular">Regular</option>
            <option value="Nuevo">Nuevo</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="valor_total_compras">Mayor Valor de Compra</option>
            <option value="total_ordenes">Mayor Cantidad de Órdenes</option>
            <option value="ultima_compra">Última Compra Reciente</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre Cliente</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Segmento</th>
              <th>Total Órdenes</th>
              <th>Valor Total</th>
              <th>Última Compra</th>
              <th>Interacciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((cliente, index) => {
              const segmento = categorizarCliente(cliente);
              const diasDesde = diasDesdeUltimaCompra(cliente.ultima_compra);

              return (
                <tr key={index} className={`segmento-${segmento.toLowerCase()}`}>
                  <td className="nombre-cliente">
                    <span className="segmento-icon">{getSegmentoIcon(segmento)}</span>
                    {cliente.nombre_completo}
                  </td>
                  <td className="email">{cliente.correo_electronico}</td>
                  <td className="telefono">{cliente.telefono}</td>
                  <td>
                    <span
                      className="segmento-badge"
                      style={{ backgroundColor: getSegmentoColor(segmento) }}
                    >
                      {segmento}
                    </span>
                  </td>
                  <td className="numero">{cliente.total_ordenes}</td>
                  <td className="numero valor">${cliente.valor_total_compras.toFixed(2)}</td>
                  <td className="fecha">
                    {cliente.ultima_compra ? (
                      <>
                        <span className="fecha-texto">{diasDesde}</span>
                        <br />
                        <span className="fecha-completa">
                          {new Date(cliente.ultima_compra).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </>
                    ) : (
                      <span className="sin-compra">Sin compras</span>
                    )}
                  </td>
                  <td className="numero">{cliente.total_interacciones}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="empty-state">
          <p>No hay clientes en este segmento</p>
        </div>
      )}

      <div className="table-footer">
        <p>Total de clientes mostrados: {sortedData.length} de {data.length}</p>
      </div>
    </div>
  );
};

export default ClientesActividad;
