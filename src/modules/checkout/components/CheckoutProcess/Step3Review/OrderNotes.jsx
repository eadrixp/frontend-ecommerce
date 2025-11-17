import React from "react";

const OrderNotes = ({ orderNotes, onOrderNotesChange, formGroupStyle, labelStyle, inputStyle }) => {
  return (
    <div style={formGroupStyle}>
      <label style={labelStyle}>Notas del pedido (opcional):</label>
      <textarea
        placeholder="Instrucciones especiales para la entrega..."
        value={orderNotes}
        onChange={(e) => onOrderNotesChange(e.target.value)}
        style={{
          ...inputStyle,
          height: "100px",
          resize: "vertical"
        }}
      />
    </div>
  );
};

export default OrderNotes;
