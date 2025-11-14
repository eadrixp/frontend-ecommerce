import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ProductoTable = ({ productos, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Puedes cambiar la cantidad por página

  // Calcular productos que se mostrarán en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);

  // Total de páginas
  const totalPages = Math.ceil(productos.length / itemsPerPage);

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
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Precio</th>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Stock</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id_producto} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{p.id_producto}</td>
              <td style={{ padding: "0.5rem" }}>{p.nombre_producto}</td>
              <td style={{ padding: "0.5rem" }}>Q{p.precio}</td>
              <td style={{ padding: "0.5rem" }}>{p.stock}</td>
              <td style={{ padding: "0.5rem", textAlign: "center" }}>
                <button
                  onClick={() => onEdit(p)}
                  title="Editar producto"
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
                  onClick={() => onDelete(p.id_producto)}
                  title="Eliminar producto"
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

export default ProductoTable;
