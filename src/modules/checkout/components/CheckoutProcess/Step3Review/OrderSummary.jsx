import React from "react";

const OrderSummary = ({ cartItems, subtotal, shipping, total }) => {
  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1.5rem"
    }}>
      <h3 style={{ marginBottom: "1rem" }}>Resumen del Pedido</h3>
      {cartItems.map(item => (
        <div key={item.id} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid #f3f4f6",
          marginBottom: "0.5rem"
        }}>
          <span>{item.nombre_producto} x {item.cantidad}</span>
          <span>Q{(item.precio * item.cantidad).toLocaleString('es-GT', { maximumFractionDigits: 2 })}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <span>Subtotal:</span>
        <span>Q{subtotal.toLocaleString('es-GT', { maximumFractionDigits: 2 })}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Envío:</span>
        <span>{shipping === 0 ? 'Gratis' : `Q${shipping.toLocaleString('es-GT', { maximumFractionDigits: 2 })}`}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem", marginTop: "0.5rem" }}>
        <span>Total:</span>
        <span>Q{total.toLocaleString('es-GT', { maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
