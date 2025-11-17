import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

/**
 * Modal de confirmación de orden exitosa
 * Muestra detalles de la orden y redirige después de 3 segundos o al hacer clic
 */
const OrderConfirmationModal = ({ isOpen, order, onClose }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [userClicked, setUserClicked] = useState(false);

  const handleViewDetails = useCallback(() => {
    if (order?.id_orden) {
      navigate(`/ordenes/${order.id_orden}`);
      onClose();
    }
  }, [order?.id_orden, navigate, onClose]);

  useEffect(() => {
    if (!isOpen || !order) return;

    // Iniciar countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!userClicked) {
            handleViewDetails();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, order, userClicked, handleViewDetails]);

  const handleManualClick = () => {
    setUserClicked(true);
    handleViewDetails();
  };

  if (!isOpen || !order) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "3rem",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Icono de éxito */}
        <div style={{ marginBottom: "1.5rem" }}>
          <FiCheckCircle
            size={64}
            style={{
              color: "#10b981",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Título */}
        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "1rem",
          }}
        >
          ¡Orden Creada Exitosamente!
        </h2>

        {/* Número de orden */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "2px solid #10b981",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            Número de orden
          </p>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#10b981",
              fontFamily: "monospace",
            }}
          >
            {order.numero_orden}
          </p>
        </div>

        {/* Detalles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Total */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              Total
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              Q{order.total_orden?.toLocaleString("es-GT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Estado */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              Estado
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#f59e0b",
              }}
            >
              Pendiente
            </p>
          </div>
        </div>

        {/* Información adicional */}
        {order.fecha_orden && (
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "2rem",
            }}
          >
            <p>
              Fecha: {new Date(order.fecha_orden).toLocaleDateString("es-GT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {order.cantidad_productos && (
              <p>Productos: {order.cantidad_productos}</p>
            )}
          </div>
        )}

        {/* Botón de acción */}
        <button
          onClick={handleManualClick}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#2563eb";
          }}
        >
          Ver Detalles
        </button>

        {/* Countdown */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "#9ca3af",
            marginTop: "1rem",
            marginBottom: 0,
          }}
        >
          Redirigiendo en {countdown} segundos...
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmationModal;
