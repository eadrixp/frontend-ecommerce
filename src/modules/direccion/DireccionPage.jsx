import React, { useEffect, useState } from "react";
import {
  getDirecciones,
  createDireccion,
  updateDireccion,
  deleteDireccion,
} from "../../services/direccionService";

const DireccionPage = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    calle: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: "",
    es_principal: false,
  });

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const cargarDirecciones = async () => {
    setLoading(true);
    try {
      const data = await getDirecciones();
      setDirecciones(data || []);
    } catch (err) {
      console.error("Error al cargar direcciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await updateDireccion(editando.id_direccion, form);
      } else {
        await createDireccion(form);
      }
      setShowModal(false);
      setEditando(null);
      setForm({
        calle: "",
        ciudad: "",
        estado: "",
        codigo_postal: "",
        pais: "",
        es_principal: false,
      });
      await cargarDirecciones();
    } catch (err) {
      console.error("Error al guardar dirección:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta dirección?")) return;
    try {
      await deleteDireccion(id);
      await cargarDirecciones();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  if (loading) return <p>Cargando direcciones...</p>;

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
        <h2 style={{ margin: 0, color: "#333" }}>Direcciones</h2>
        <button
          onClick={() => {
            setEditando(null);
            setShowModal(true);
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
          + Nueva Dirección
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
            <th style={thStyle}>Calle</th>
            <th style={thStyle}>Ciudad</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Código Postal</th>
            <th style={thStyle}>País</th>
            <th style={thStyle}>Principal</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                No hay direcciones registradas.
              </td>
            </tr>
          ) : (
            direcciones.map((d) => (
              <tr key={d.id_direccion} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{d.id_direccion}</td>
                <td style={tdStyle}>{d.calle}</td>
                <td style={tdStyle}>{d.ciudad}</td>
                <td style={tdStyle}>{d.estado}</td>
                <td style={tdStyle}>{d.codigo_postal}</td>
                <td style={tdStyle}>{d.pais}</td>
                <td style={tdStyle}>{d.es_principal ? "Sí" : "No"}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => {
                      setEditando(d);
                      setForm(d);
                      setShowModal(true);
                    }}
                    style={{
                      backgroundColor: "#17a2b8",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "white",
                      marginRight: "6px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(d.id_direccion)}
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

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "10px" }}>
              {editando ? "Editar Dirección" : "Nueva Dirección"}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Calle"
                value={form.calle}
                onChange={(e) => setForm({ ...form, calle: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Estado"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Código Postal"
                value={form.codigo_postal}
                onChange={(e) => setForm({ ...form, codigo_postal: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="País"
                value={form.pais}
                onChange={(e) => setForm({ ...form, pais: e.target.value })}
                required
                style={inputStyle}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={form.es_principal}
                  onChange={(e) => setForm({ ...form, es_principal: e.target.checked })}
                />
                Dirección principal
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
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
                    padding: "6px 12px",
                    borderRadius: "6px",
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

// Estilos
const thStyle = { padding: "10px", borderBottom: "1px solid #ddd", color: "#333", fontWeight: "bold" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #eee", color: "#555" };

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "6px",
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

export default DireccionPage;
