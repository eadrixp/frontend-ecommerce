import React from "react";

const ProductCard = ({ producto, onAddToCart }) => {
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  };

  const imageStyle = {
    width: "100%",
    height: "220px",
    backgroundColor: "#f8fafc",
    border: "2px dashed #e2e8f0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    fontSize: "3rem",
    overflow: "hidden"
  };

  const priceStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#059669",
    marginBottom: "1rem"
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "auto"
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)";
        e.currentTarget.style.borderColor = "#f1f5f9";
      }}
    >
      {/* Badge de producto nuevo */}
      {producto.stock > 0 && producto.stock <= 5 && (
        <div style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          backgroundColor: "#f59e0b",
          color: "white",
          fontSize: "0.75rem",
          padding: "0.25rem 0.5rem",
          borderRadius: "12px",
          fontWeight: "600",
          zIndex: 1
        }}>
          ¡Últimos!
        </div>
      )}

      {/* Imagen del producto */}
      <div style={imageStyle}>
        {producto.imagen_url ? (
          <img
            src={`http://localhost:3000${producto.imagen_url}`}
            alt={producto.nombre_producto}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "6px"
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center; color: #64748b;"><span style="font-size: 2.5rem;">🖼️</span><span style="font-size: 0.75rem; margin-top: 0.5rem;">Imagen no disponible</span></div>';
            }}
          />
        ) : (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            color: "#64748b" 
          }}>
            <span style={{ fontSize: "2.5rem" }}>�️</span>
            <span style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "0.5rem",
          lineHeight: "1.4"
        }}>
          {producto.nombre_producto}
        </h3>

        <p style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          marginBottom: "1rem",
          lineHeight: "1.5"
        }}>
          {producto.descripcion || "Sin descripción disponible"}
        </p>

        {/* Categoría */}
        {producto.categoria && (
          <span style={{
            backgroundColor: "#dbeafe",
            color: "#1d4ed8",
            padding: "0.25rem 0.5rem",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: "500",
            display: "inline-block",
            marginBottom: "1rem"
          }}>
            {producto.categoria}
          </span>
        )}

        {/* Stock disponible */}
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: producto.stock > 0 ? "#10b981" : "#ef4444"
          }}></span>
          <span style={{
            color: producto.stock > 0 ? "#059669" : "#dc2626",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            {producto.stock > 0 ? `${producto.stock} disponible` : "Agotado"}
          </span>
        </div>

        {/* Precio */}
        <div style={priceStyle}>
          {formatPrice(producto.precio)}
        </div>
      </div>

      {/* Botón de agregar al carrito */}
      <button
        style={{
          ...buttonStyle,
          backgroundColor: producto.stock > 0 ? "#2563eb" : "#9ca3af",
          cursor: producto.stock > 0 ? "pointer" : "not-allowed"
        }}
        onClick={() => producto.stock > 0 && onAddToCart(producto)}
        disabled={producto.stock === 0}
        onMouseEnter={(e) => {
          if (producto.stock > 0) {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }
        }}
        onMouseLeave={(e) => {
          if (producto.stock > 0) {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }
        }}
      >
        {producto.stock > 0 ? "🛒 Agregar al carrito" : "Sin stock"}
      </button>
    </div>
  );
};

export default ProductCard;