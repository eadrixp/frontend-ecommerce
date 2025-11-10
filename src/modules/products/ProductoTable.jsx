import React from "react";

const ProductoTable = ({ productos, onEdit, onDelete }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>ID</th>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Precio</th>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Stock</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{p.id_producto}</td>
              <td style={{ padding: "0.5rem" }}>{p.nombre_producto}</td>
              <td style={{ padding: "0.5rem" }}>Q{p.precio}</td>
              <td style={{ padding: "0.5rem" }}>{p.stock}</td>
              <td style={{ padding: "0.5rem", textAlign: "center" }}>
                <button
                  onClick={() => onEdit(p)}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    marginRight: "6px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                Editar
                </button>
                <button
                  onClick={() => onDelete(p.id_producto)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoTable;
