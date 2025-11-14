import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { 
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../../services/categoriasService";
import PageHeader from "../../components/layout/Header";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await updateCategoria(editando.id_categoria, { nombre_categoria: nombre, descripcion });
      } else {
        await createCategoria({ nombre_categoria: nombre, descripcion });
      }
      setNombre("");
      setDescripcion("");
      setEditando(null);
      setShowModal(false);
      await cargarCategorias();
    } catch (err) {
      console.error("Error al guardar categoría:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await deleteCategoria(id);
      await cargarCategorias();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categorias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categorias.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Cargando categorías...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <PageHeader
        title="Gestión de Categorías"
        onAdd={() => {
          setShowModal(!showModal);
          setEditando(null);
          setNombre("");
          setDescripcion("");
        }}
        showForm={showModal}
        addButtonLabel="+ Nueva Categoría"
      />

      {/* Tabla */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1", textAlign: "left" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Activo</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              currentItems.map((cat) => (
                <tr key={cat.id_categoria} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{cat.id_categoria}</td>
                  <td style={tdStyle}>{cat.nombre_categoria}</td>
                  <td style={tdStyle}>{cat.descripcion || "—"}</td>
                  <td style={tdStyle}>{cat.activo ? "Sí" : "No"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => {
                        setEditando(cat);
                        setNombre(cat.nombre_categoria);
                        setDescripcion(cat.descripcion);
                        setShowModal(true);
                      }}
                      style={editButtonStyle}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id_categoria)}
                      style={deleteButtonStyle}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
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

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "15px" }}>
              {editando ? "Editar Categoría" : "Nueva Categoría"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelButtonStyle}>Cancelar</button>
                <button type="submit" style={saveButtonStyle}>{editando ? "Actualizar" : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos
const thStyle = { padding: "10px", borderBottom: "1px solid #ddd", color: "#333", fontWeight: "bold" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #eee", color: "#555" };
const editButtonStyle = { backgroundColor: "#7a61ebff", border: "none", color: "white", borderRadius: "5px", padding: "5px 10px", cursor: "pointer", marginRight: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" };
const deleteButtonStyle = { backgroundColor: "#f44336", border: "none", borderRadius: "5px", padding: "5px 10px", cursor: "pointer", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center" };
const paginationButtonStyle = { border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContent = { backgroundColor: "white", borderRadius: "10px", padding: "20px", width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
const inputStyle = { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px", marginTop: "4px" };
const cancelButtonStyle = { backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "6px", padding: "8px 14px", cursor: "pointer" };
const saveButtonStyle = { backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", padding: "8px 14px", cursor: "pointer" };

export default CategoriasPage;
