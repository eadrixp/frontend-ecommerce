import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const AlmacenesTable = ({ almacenes, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = almacenes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(almacenes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ background: "white", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflowX: "auto" }}>
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
          {currentItems.length > 0 ? (
            currentItems.map((a) => (
              <tr key={a.id_almacen} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={td}>{a.nombre_almacen}</td>
                <td style={td}>{a.direccion || "—"}</td>
                <td style={td}>{a.telefono || "—"}</td>
                <td style={td}>{a.responsable || "—"}</td>
                <td style={td}>{a.activo ? "Sí" : "No"}</td>
                <td style={{ ...td, textAlign: "center" }}>
                  <button onClick={() => onEdit(a)} style={btnEdit}>
                    <FiEdit size={18} />
                  </button>
                  <button onClick={() => onDelete(a.id_almacen)} style={btnDelete}>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem", color: "#6b7280" }}>
                No hay almacenes registrados.
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
const th = { padding: "10px", fontWeight: "bold", borderBottom: "2px solid #e5e7eb" };
const td = { padding: "10px" };
const btnEdit = { backgroundColor: "#7a61ebff", border: "none", color: "white", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", marginRight: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" };
const btnDelete = { backgroundColor: "#dc2626", border: "none", color: "white", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };
const paginationButtonStyle = { border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" };

export default AlmacenesTable;
