// UsuarioList.jsx
import React, { useEffect, useState } from "react";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../../services/usuariosService";
import UsuarioTable from "./UsuarioTable";
import UsuarioForm from "./UsuarioForm";

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleGuardar = async (usuarioData) => {
    try {
      if (editando) {
        await updateUsuario(editando.id_usuario, usuarioData);
      } else {
        await createUsuario(usuarioData);
      }
      setShowForm(false);
      setEditando(null);
      await cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  const handleEditar = (usuario) => {
    setEditando(usuario);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUsuario(id);
      await cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <button
          onClick={() => { setEditando(null); setShowForm(true); }}
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
          + Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <UsuarioTable usuarios={usuarios} onEdit={handleEditar} onDelete={handleEliminar} />
      )}

      {showForm && (
        <UsuarioForm
          onClose={() => { setShowForm(false); setEditando(null); }}
          onSave={handleGuardar}
          editando={editando}
        />
      )}
    </div>
  );
};

export default UsuarioList;
