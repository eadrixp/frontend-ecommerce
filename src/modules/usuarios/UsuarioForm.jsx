// UsuarioForm.jsx
import React, { useState, useEffect } from "react";

const UsuarioForm = ({ onClose, onSave, editando }) => {
  const [form, setForm] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    contrasena: "",
    id_rol: "",
    activo: true,
  });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre_usuario: editando.nombre_usuario,
        correo_electronico: editando.correo_electronico,
        contrasena: "",
        id_rol: editando.id_rol,
        activo: editando.activo,
      });
    }
  }, [editando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h3>{editando ? "Editar Usuario" : "Nuevo Usuario"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={form.nombre_usuario}
            onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.correo_electronico}
            onChange={(e) => setForm({ ...form, correo_electronico: e.target.value })}
            required
            style={inputStyle}
          />
          {!editando && (
            <input
              type="password"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
              required
              style={inputStyle}
            />
          )}
          <input
            type="number"
            placeholder="ID Rol"
            value={form.id_rol}
            onChange={(e) => setForm({ ...form, id_rol: e.target.value })}
            required
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            />
            Activo
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={onClose} style={btnCancel}>Cancelar</button>
            <button type="submit" style={btnSave}>{editando ? "Actualizar" : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContent = { backgroundColor: "white", borderRadius: "10px", padding: "20px", width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
const inputStyle = { padding: "8px", border: "1px solid #ccc", borderRadius: "6px" };
const btnCancel = { backgroundColor: "#6c757d", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };
const btnSave = { backgroundColor: "#28a745", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };

export default UsuarioForm;
