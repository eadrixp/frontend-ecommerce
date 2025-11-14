import React, { useState } from 'react';
import { usePostgresQuery } from '../../hooks/usePostgresQuery';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './PipelineVentas.css';

const PipelineVentas = () => {
  const { data, loading, error, refetch } = usePostgresQuery('pipeline-ventas');
  const [viewType, setViewType] = useState('bar');

  // Define colors for pipeline stages
  const colores = {
    'PROSPECTO': '#95a5a6',
    'CUALIFICADO': '#3498db',
    'PROPUESTA': '#f39c12',
    'NEGOCIACIÓN': '#e74c3c',
    'CERRADO': '#2ecc71',
  };

  // Calculate statistics
  const stats = {
    totalOportunidades: data.reduce((sum, item) => sum + item.cantidad_oportunidades, 0),
    valorTotal: data.reduce((sum, item) => sum + item.valor_total, 0),
    probabilidadPromedio: data.length > 0
      ? (data.reduce((sum, item) => sum + (item.probabilidad_promedio * item.cantidad_oportunidades), 0) /
        data.reduce((sum, item) => sum + item.cantidad_oportunidades, 0)).toFixed(2)
      : 0,
    vencidasTotal: data.reduce((sum, item) => sum + item.vencidas, 0),
  };

  // Prepare chart data
  const chartData = data.map(item => ({
    nombre: item.etapa,
    cantidad: item.cantidad_oportunidades,
    valor: item.valor_total,
    probabilidad: parseFloat(item.probabilidad_promedio).toFixed(2),
    vencidas: item.vencidas,
  }));

  // Calculate percentages
  const dataConPorcentaje = chartData.map(item => ({
    ...item,
    porcentaje: stats.totalOportunidades > 0
      ? ((item.cantidad / stats.totalOportunidades) * 100).toFixed(1)
      : 0,
  }));

  const getColorForStage = (stage) => {
    return colores[stage] || '#95a5a6';
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.nombre}</p>
          <p className="tooltip-data">Cantidad: {data.cantidad} oportunidades</p>
          <p className="tooltip-data">Valor: {formatCurrency(data.valor)}</p>
          <p className="tooltip-data">Probabilidad: {data.probabilidad}%</p>
          {data.vencidas > 0 && (
            <p className="tooltip-warning">⚠️ {data.vencidas} vencidas</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="pipeline-ventas loading">
        <p>Cargando pipeline de ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pipeline-ventas error">
        <p>Error al cargar pipeline: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="pipeline-ventas">
      <div className="dashboard-header">
        <h2>📈 Pipeline de Ventas</h2>
        <div className="header-controls">
          <div className="view-selector">
            <button
              className={`view-btn ${viewType === 'bar' ? 'active' : ''}`}
              onClick={() => setViewType('bar')}
            >
              📊 Barras
            </button>
            <button
              className={`view-btn ${viewType === 'pie' ? 'active' : ''}`}
              onClick={() => setViewType('pie')}
            >
              🥧 Pastel
            </button>
          </div>
          <button className="btn-refresh" onClick={refetch}>↻ Actualizar</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{stats.totalOportunidades}</div>
            <div className="metric-label">Total Oportunidades</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(stats.valorTotal)}</div>
            <div className="metric-label">Valor Total en Pipeline</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{stats.probabilidadPromedio}%</div>
            <div className="metric-label">Probabilidad Promedio</div>
          </div>
        </div>
        <div className="metric-card danger">
          <div className="metric-icon">⏰</div>
          <div className="metric-content">
            <div className="metric-value">{stats.vencidasTotal}</div>
            <div className="metric-label">Oportunidades Vencidas</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>{viewType === 'bar' ? '📊 Oportunidades por Etapa' : '🥧 Distribución de Oportunidades'}</h3>
        </div>

        {data.length > 0 ? (
          <div className="chart-wrapper">
            {viewType === 'bar' ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="nombre" />
                  <YAxis yAxisId="left" label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Valor ($)', angle: 90, position: 'insideRight' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cantidad" fill="#3498db" name="Cantidad de Oportunidades" />
                  <Bar yAxisId="right" dataKey="valor" fill="#2ecc71" name="Valor Total" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, porcentaje }) => `${nombre} (${porcentaje}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorForStage(entry.nombre)} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          <div className="empty-chart">No hay datos disponibles</div>
        )}
      </div>

      {/* Detailed Table */}
      <div className="details-container">
        <div className="details-header">
          <h3>📋 Detalles por Etapa</h3>
        </div>

        <table className="pipeline-table">
          <thead>
            <tr>
              <th>Etapa</th>
              <th>Cantidad</th>
              <th>Porcentaje</th>
              <th>Valor Total</th>
              <th>Valor Promedio</th>
              <th>Probabilidad</th>
              <th>Vencidas</th>
            </tr>
          </thead>
          <tbody>
            {dataConPorcentaje.map((item, index) => (
              <tr key={index} className={`etapa-${item.nombre.toLowerCase()}`}>
                <td className="etapa-name">
                  <span
                    className="etapa-color"
                    style={{ backgroundColor: getColorForStage(item.nombre) }}
                  ></span>
                  {item.nombre}
                </td>
                <td className="numero">{item.cantidad}</td>
                <td className="numero">
                  <div className="progress-small">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${item.porcentaje}%`,
                        backgroundColor: getColorForStage(item.nombre),
                      }}
                    ></div>
                  </div>
                  {item.porcentaje}%
                </td>
                <td className="numero valor">{formatCurrency(item.valor)}</td>
                <td className="numero">
                  {formatCurrency(item.cantidad > 0 ? item.valor / item.cantidad : 0)}
                </td>
                <td className="numero probabilidad">{item.probabilidad}%</td>
                <td className={`numero ${item.vencidas > 0 ? 'warning' : ''}`}>
                  {item.vencidas > 0 ? `⚠️ ${item.vencidas}` : '✓'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="flow-container">
        <div className="flow-header">
          <h3>🔄 Flujo del Pipeline</h3>
        </div>
        <div className="pipeline-flow">
          {dataConPorcentaje.map((item, index) => (
            <div key={index} className="pipeline-stage">
              <div
                className="stage-box"
                style={{ backgroundColor: getColorForStage(item.nombre) }}
              >
                <div className="stage-name">{item.nombre}</div>
                <div className="stage-count">{item.cantidad}</div>
                <div className="stage-percent">{item.porcentaje}%</div>
              </div>
              {index < dataConPorcentaje.length - 1 && (
                <div className="stage-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineVentas;
