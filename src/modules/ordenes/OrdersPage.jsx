import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { getOrderes } from "../../services/orderService";
import "./OrdersPage.css";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isClienteLoggedIn } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!isClienteLoggedIn) {
      navigate("/");
      return;
    }

    const loadOrdenes = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getOrderes();

        if (response.success && Array.isArray(response.data)) {
          setOrdenes(response.data);
          if (response.data.length === 0) {
            console.log("📦 No hay órdenes disponibles");
          }
        } else {
          setError("No se pudieron cargar las órdenes");
        }
      } catch (err) {
        console.error("Error cargando órdenes:", err);
        setError(err.message || "Error al cargar las órdenes");
      } finally {
        setLoading(false);
      }
    };

    loadOrdenes();
  }, [isClienteLoggedIn, navigate]);

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return "#f59e0b";
      case "procesando":
        return "#3b82f6";
      case "enviado":
        return "#8b5cf6";
      case "entregado":
        return "#10b981";
      case "cancelado":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusBadge = (estado) => {
    const estadoLower = estado?.toLowerCase();
    const textos = {
      pendiente: "Pendiente",
      procesando: "Procesando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return textos[estadoLower] || estado;
  };

  const toggleExpanded = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Cargando tus órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <button
          className="orders-back-btn"
          onClick={() => navigate("/catalogo")}
          title="Volver al catálogo"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1>Mis Órdenes</h1>
        <div style={{ width: "40px" }}></div>
      </div>

      {/* Contenido */}
      <div className="orders-container">
        {error && (
          <div className="orders-error">
            <p>{error}</p>
          </div>
        )}

        {ordenes.length === 0 && !error ? (
          <div className="orders-empty">
            <FiPackage size={64} />
            <h2>No tienes órdenes aún</h2>
            <p>Comienza a comprar y verás tus órdenes aquí</p>
            <button
              className="orders-shop-btn"
              onClick={() => navigate("/catalogo")}
            >
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {ordenes.map((orden) => (
              <div key={orden.id_orden} className="orders-card">
                {/* Card Header */}
                <div
                  className="orders-card-header"
                  onClick={() => toggleExpanded(orden.id_orden)}
                >
                  <div className="orders-card-title">
                    <div className="orders-order-number">
                      Orden #{orden.id_orden}
                    </div>
                    <div className="orders-order-date">
                      {new Date(orden.fecha_orden).toLocaleDateString("es-GT", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="orders-card-summary">
                    <span
                      className="orders-status-badge"
                      style={{
                        backgroundColor: getStatusColor(orden.estado_orden),
                      }}
                    >
                      {getStatusBadge(orden.estado_orden)}
                    </span>
                    <span className="orders-total">
                      Q{parseFloat(orden.total_orden).toLocaleString("es-GT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <div className="orders-expand-icon">
                      {expandedOrderId === orden.id_orden ? (
                        <FiChevronUp size={20} />
                      ) : (
                        <FiChevronDown size={20} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content - Items */}
                {expandedOrderId === orden.id_orden && (
                  <div className="orders-card-content">
                    {/* Notas */}
                    {orden.notas_orden && (
                      <div className="orders-notes">
                        <p className="orders-notes-label">Notas:</p>
                        <p className="orders-notes-text">{orden.notas_orden}</p>
                      </div>
                    )}

                    {/* Items */}
                    <div className="orders-items">
                      <p className="orders-items-label">
                        Items ({orden.items?.length || 0})
                      </p>
                      {orden.items && orden.items.length > 0 ? (
                        <div className="orders-items-list">
                          {orden.items.map((item) => (
                            <div
                              key={item.id_orden_item}
                              className="orders-item-row"
                            >
                              <div className="orders-item-info">
                                <div className="orders-item-id">
                                  Producto ID: {item.id_producto}
                                </div>
                                <div className="orders-item-price">
                                  Q{parseFloat(item.precio_unitario).toLocaleString(
                                    "es-GT",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  × {item.cantidad} = Q
                                  {parseFloat(item.subtotal).toLocaleString("es-GT", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="orders-no-items">Sin items</p>
                      )}
                    </div>

                    {/* Resumen */}
                    <div className="orders-summary">
                      <div className="orders-summary-row">
                        <span>Total:</span>
                        <strong>
                          Q{parseFloat(orden.total_orden).toLocaleString("es-GT", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
