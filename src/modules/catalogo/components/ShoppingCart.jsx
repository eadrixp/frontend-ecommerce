import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/imageUtils";
import useAuth from "../../../hooks/useAuth";
import ClienteAuthModal from "./ClienteAuthModal";

const ShoppingCart = ({ cart, onClose, onRemove, onUpdateQuantity }) => {
  const { isClienteLoggedIn, hasValidToken } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const modalStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
  };

  const headerStyle = {
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const bodyStyle = {
    padding: "1rem",
    overflowY: "auto",
    flex: 1
  };

  const footerStyle = {
    padding: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb"
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Helper function para determinar si el usuario está logueado
  const userIsLoggedIn = () => {
    const clienteLoggedIn = isClienteLoggedIn();
    const hasToken = hasValidToken();
    const result = clienteLoggedIn || hasToken;
    
    console.log("🔐 userIsLoggedIn - Cliente:", clienteLoggedIn, "Token:", hasToken, "Result:", result);
    return result;
  };

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleCheckout = () => {
    console.log("🛒 Iniciando proceso de checkout...");
    
    if (!userIsLoggedIn()) {
      alert("Por favor inicia sesión para proceder con la compra");
      return;
    }
    
    // Si está logueado, ir a la página de checkout con los datos del carrito
    navigate("/checkout", {
      state: {
        cartItems: cart,
        totalAmount: total
      }
    });
    onClose(); // Cerrar el modal del carrito
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              🛒 Carrito de Compras
            </h2>
            {/* Estado de autenticación */}
            <div style={{ marginTop: "0.5rem" }}>
              {userIsLoggedIn() ? (
                <span style={{ 
                  color: "#10b981", 
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}>
                  ✅ Sesión iniciada
                </span>
              ) : (
                <button
                  onClick={handleLogin}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  👤 Iniciar Sesión
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6b7280"
            }}
          >
            ❌
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
              <p style={{ fontSize: "1.2rem" }}>Tu carrito está vacío</p>
              <p>Agrega algunos productos para comenzar</p>
            </div>
          ) : (
            <div>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem",
                    borderBottom: "1px solid #f3f4f6",
                    gap: "1rem"
                  }}
                >
                  {/* Imagen del producto */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {item.imagen_url ? (
                      <img
                        src={getImageUrl(item.imagen_url)}
                        alt={item.nombre_producto}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "0 0 0.25rem 0"
                    }}>
                      {item.nombre_producto}
                    </h4>
                    <p style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#059669",
                      margin: 0
                    }}>
                      {formatPrice(item.precio)}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      ➖
                    </button>
                    <span style={{
                      minWidth: "30px",
                      textAlign: "center",
                      fontWeight: "600"
                    }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      ➕
                    </button>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      padding: "0.5rem"
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={footerStyle}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem"
            }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "#111827" }}>
                Total:
              </span>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                {formatPrice(total)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                backgroundColor: userIsLoggedIn() ? "#059669" : "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
                opacity: userIsLoggedIn() ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                if (userIsLoggedIn()) {
                  e.currentTarget.style.backgroundColor = "#047857";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = userIsLoggedIn() ? "#059669" : "#6b7280";
              }}
            >
              {userIsLoggedIn() ? "💳 Proceder al Pago" : "🔒 Inicia sesión para comprar"}
            </button>
          </div>
        )}
      </div>

      {/* Modal de autenticación */}
      <ClienteAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnPath="/catalogo"
      />
    </div>
  );
};

export default ShoppingCart;