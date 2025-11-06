import React from "react";

const ShoppingCart = ({ cart, onClose, onRemove, onUpdateQuantity }) => {
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

  const handleCheckout = () => {
    // TODO: Implementar proceso de checkout
    alert("Funcionalidad de checkout en desarrollo");
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
            🛒 Carrito de Compras
          </h2>
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
                        src={item.imagen_url}
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
                backgroundColor: "#059669",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#047857";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#059669";
              }}
            >
              💳 Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;