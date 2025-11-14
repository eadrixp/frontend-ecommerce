import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TableProveedores = ({ proveedores, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = proveedores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proveedores.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Contacto</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>NIT</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((p) => (
              <tr key={p.id_proveedor} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{p.nombre_proveedor}</td>
                <td style={tdStyle}>{p.contacto}</td>
                <td style={tdStyle}>{p.telefono}</td>
                <td style={tdStyle}>{p.email}</td>
                <td style={tdStyle}>{p.nit}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button onClick={() => onEdit(p)} style={editButtonStyle}>
                    <FiEdit size={18} />
                  </button>
                  <button onClick={() => onDelete(p.id_proveedor)} style={deleteButtonStyle}>
                    <FiTrash2 size={18} />
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem" }}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={paginationButtonStyle}>
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              style={{
                ...paginationButtonStyle,
                fontWeight: currentPage === i + 1 ? "bold" : "normal",
                backgroundColor: currentPage === i + 1 ? "#7a61ebff" : "#f0f0f0",
                color: currentPage === i + 1 ? "#fff" : "#333",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={paginationButtonStyle}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

// Estilos
const thStyle = { padding: "0.5rem", borderBottom: "1px solid #ddd", color: "#333", fontWeight: "bold" };
const tdStyle = { padding: "0.5rem", borderBottom: "1px solid #eee", color: "#555" };
const editButtonStyle = {
  backgroundColor: "#7a61ebff",
  border: "none",
  color: "white",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
  marginRight: "6px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
const deleteButtonStyle = {
  backgroundColor: "#f44336",
  border: "none",
  color: "white",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
const paginationButtonStyle = { border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" };

export default TableProveedores;
