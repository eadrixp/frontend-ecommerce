import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TableClientes = ({ clientes, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cambiar según necesidad

  // Calcular clientes que se mostrarán en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = clientes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(clientes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

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
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Apellido</th>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Teléfono</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((c) => (
            <tr key={c.id_cliente} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{c.id_cliente}</td>
              <td style={{ padding: "0.5rem" }}>{c.nombre}</td>
              <td style={{ padding: "0.5rem" }}>{c.apellido}</td>
              <td style={{ padding: "0.5rem" }}>{c.telefono}</td>
              <td style={{ padding: "0.5rem", textAlign: "center" }}>
                <button
                  onClick={() => onEdit(c)}
                  title="Editar cliente"
                  style={{
                    backgroundColor: "#7a61ebff",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    marginRight: "6px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => onDelete(c.id_cliente)}
                  title="Eliminar cliente"
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={paginationButtonStyle}
          >
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
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={paginationButtonStyle}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

// Estilo botones de paginación
const paginationButtonStyle = {
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default TableClientes;
