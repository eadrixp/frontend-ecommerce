import React, { useEffect, useState } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../services/categoriasService";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);

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
        await updateCategoria(editando.id_categoria, {
          nombre_categoria: nombre,
          descripcion,
        });
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

  if (loading) return <p>Cargando categorías...</p>;

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>Categorías</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditando(null);
            setNombre("");
            setDescripcion("");
          }}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
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
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                No hay categorías registradas.
              </td>
            </tr>
          ) : (
            categorias.map((cat) => (
              <tr
                key={cat.id_categoria}
                style={{ borderBottom: "1px solid #eee" }}
              >
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
                    style={{
                      backgroundColor: "#2563eb", 
                      border: "none",
                      color: "white",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      marginRight: "6px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id_categoria)}
                    style={{
                      backgroundColor: "#dc3545",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🪟 Modal */}
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
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 estilos
const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "#333",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  color: "#555",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
  width: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginTop: "4px",
};

export default CategoriasPage;
