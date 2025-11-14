// UsuarioTable.jsx
import React from "react";

const UsuarioTable = ({ usuarios, onEdit, onDelete }) => {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f1f1", textAlign: "left" }}>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Email</th>
            <th style={th}>Rol</th>
            <th style={th}>Activo</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No hay usuarios.
              </td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id_usuario} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{u.id_usuario}</td>
                <td style={td}>{u.nombre_usuario}</td>
                <td style={td}>{u.correo_electronico}</td>
                <td style={td}>{u.rol?.nombre_rol || "—"}</td>
                <td style={td}>{u.activo ? "Sí" : "No"}</td>
                <td style={td}>
                  <button onClick={() => onEdit(u)} style={btnEdit}>Editar</button>
                  <button onClick={() => onDelete(u.id_usuario)} style={btnDelete}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const th = { padding: "10px", fontWeight: "bold", borderBottom: "2px solid #e5e7eb" };
const td = { padding: "10px" };
const btnEdit = { backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", marginRight: "6px", cursor: "pointer" };
const btnDelete = { backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" };

export default UsuarioTable;
