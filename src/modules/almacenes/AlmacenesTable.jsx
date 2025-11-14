import React from "react";

const AlmacenesTable = ({ almacenes, onEdit, onDelete }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
            <th style={th}>Nombre</th>
            <th style={th}>Dirección</th>
            <th style={th}>Teléfono</th>
            <th style={th}>Responsable</th>
            <th style={th}>Activo</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {almacenes.map((a) => (
            <tr key={a.id_almacen} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={td}>{a.nombre_almacen}</td>
              <td style={td}>{a.direccion || "—"}</td>
              <td style={td}>{a.telefono || "—"}</td>
              <td style={td}>{a.responsable || "—"}</td>
              <td style={td}>{a.activo ? "Sí" : "No"}</td>

              <td style={td}>
                <button
                  onClick={() => onEdit(a)}
                  style={btnEdit}
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(a.id_almacen)}
                  style={btnDelete}
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

const th = {
  padding: "10px",
  fontWeight: "bold",
  borderBottom: "2px solid #e5e7eb",
};

const td = {
  padding: "10px",
};

const btnEdit = {
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "4px 8px",
  marginRight: "6px",
  cursor: "pointer",
};

const btnDelete = {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "4px 8px",
  cursor: "pointer",
};

export default AlmacenesTable;
