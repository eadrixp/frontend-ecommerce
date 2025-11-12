import React, { useEffect, useState } from "react";
import { createUsuario, updateUsuario } from "../../services/usuariosService";

const UsuarioForm = ({ usuarioEdit, onClose }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    contrasena: "",
    id_rol: 2,
    activo: true,
  });

  useEffect(() => {
    if (usuarioEdit) {
      setFormData({
        nombre_usuario: usuarioEdit.nombre_usuario || "",
        correo_electronico: usuarioEdit.correo_electronico || "",
        contrasena: "",
        id_rol: usuarioEdit.id_rol || 2,
        activo: usuarioEdit.activo ?? true,
      });
    }
  }, [usuarioEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuarioEdit) {
        await updateUsuario(usuarioEdit.id_usuario, formData);
        alert("Usuario actualizado correctamente");
      } else {
        await createUsuario(formData);
        alert("Usuario creado correctamente");
      }
      onClose();
    } catch (error) {
  console.error("Error al guardar el cliente:", error.response?.data || error.message);
  alert("Error al guardar cliente");
}

  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>
          {usuarioEdit ? "Editar Usuario" : "Nuevo Usuario"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre de usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="email"
            name="correo_electronico"
            placeholder="Correo electrónico"
            value={formData.correo_electronico}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          {!usuarioEdit && (
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          )}
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value={1}>Administrador</option>
            <option value={2}>Cliente</option>
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "#6b7280",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;
