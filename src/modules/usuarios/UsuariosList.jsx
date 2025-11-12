import React, { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario } from "../../services/usuariosService";
import UsuarioForm from "./UsuarioForm";

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas desactivar este usuario?")) {
      await deleteUsuario(id);
      fetchUsuarios();
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <button
        onClick={() => {
          setUsuarioEdit(null);
          setShowForm(true);
        }}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        Nuevo Usuario
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th>ID</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario} style={{ textAlign: "center" }}>
              <td>{u.id_usuario}</td>
              <td>{u.nombre_usuario}</td>
              <td>{u.correo_electronico}</td>
              <td>{u.id_rol === 1 ? "Administrador" : "Cliente"}</td>
              <td>{u.activo ? "Sí" : "No"}</td>
              <td>
                <button
                  onClick={() => {
                    setUsuarioEdit(u);
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(u.id_usuario)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <UsuarioForm
          usuarioEdit={usuarioEdit}
          onClose={() => {
            setShowForm(false);
            fetchUsuarios();
          }}
        />
      )}
    </div>
  );
};

export default UsuariosList;
