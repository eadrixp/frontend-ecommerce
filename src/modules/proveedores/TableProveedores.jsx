import React from "react";

const TableProveedores = ({ proveedores, onEdit, onDelete }) => {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Nombre</th>
            <th style={{ padding: "0.5rem" }}>Contacto</th>
            <th style={{ padding: "0.5rem" }}>Teléfono</th>
            <th style={{ padding: "0.5rem" }}>Email</th>
            <th style={{ padding: "0.5rem" }}>NIT</th>
            <th style={{ padding: "0.5rem" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map((p) => (
              <tr key={p.id_proveedor} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.5rem" }}>{p.nombre_proveedor}</td>
                <td style={{ padding: "0.5rem" }}>{p.contacto}</td>
                <td style={{ padding: "0.5rem" }}>{p.telefono}</td>
                <td style={{ padding: "0.5rem" }}>{p.email}</td>
                <td style={{ padding: "0.5rem" }}>{p.nit}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button
                    onClick={() => onEdit(p)}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.25rem 0.5rem",
                      marginRight: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(p.id_proveedor)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.25rem 0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem", color: "#6b7280" }}>
                No hay proveedores registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableProveedores;
