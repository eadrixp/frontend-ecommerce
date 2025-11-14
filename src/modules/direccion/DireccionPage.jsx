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
  const [error, setError] = useState(null);

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
    setError(null);
    try {
      const data = await getDirecciones();
      setDirecciones(data.direcciones || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar direcciones");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
      console.error(err);
      setError(err.message || "Error al guardar dirección");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta dirección?")) return;
    setError(null);
    try {
      await deleteDireccion(id);
      await cargarDirecciones();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar dirección");
    }
  };

  if (loading) return <p>Cargando direcciones...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Direcciones</h2>
        <button
          onClick={() => {
            setEditando(null);
            setShowModal(true);
          }}
          style={btnPrimary}
        >
          + Nueva Dirección
        </button>
      </div>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px" }}>
        <thead>
          <tr style={{ background: "#f1f1f1", textAlign: "left" }}>
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
                    style={btnEdit}
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(d.id_direccion)} style={btnDelete}>
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
            <h3>{editando ? "Editar Dirección" : "Nueva Dirección"}</h3>
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
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancel}>
                  Cancelar
                </button>
                <button type="submit" style={btnSave}>
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
const thStyle = { padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };

const inputStyle = { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContent = { background: "white", borderRadius: "10px", padding: "20px", width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };

const btnPrimary = { backgroundColor: "#7a61eb", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: "bold" };
const btnEdit = { backgroundColor: "#7a61eb", color: "white", border: "none", borderRadius: "6px", padding: "5px 10px", marginRight: "6px", cursor: "pointer" };
const btnDelete = { backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" };
const btnCancel = { backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" };
const btnSave = { backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" };

export default DireccionPage;
