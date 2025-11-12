import React, { useState, useEffect } from "react";
import { createCliente, updateCliente } from "../../services/clientesService";

const ClienteForm = ({ clienteEdit, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  useEffect(() => {
    if (clienteEdit) {
      setFormData({
        nombre: clienteEdit.nombre || "",
        apellido: clienteEdit.apellido || "",
        telefono: clienteEdit.telefono || "",
      });
    }
  }, [clienteEdit]);

  // ✅ Formatear teléfono automáticamente para Guatemala
  const formatPhoneNumber = (newValue, oldValue = "") => {
    const digits = newValue.replace(/\D/g, ""); // Solo números
    const prevDigits = oldValue.replace(/\D/g, "");

    if (!digits) return ""; // Permitir borrar todo

    const isDeleting = prevDigits.length > digits.length;
    if (isDeleting && digits === "502") return "";

    let full = digits.startsWith("502") ? digits : `502${digits}`;
    full = full.slice(0, 11); // Máximo 502 + 8 dígitos

    const prefix = full.slice(0, 3);
    const local = full.slice(3);

    if (!local) return `+${prefix}`;
    if (local.length <= 4) return `+${prefix} ${local}`;
    return `+${prefix} ${local.slice(0, 4)}-${local.slice(4)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const formatted = formatPhoneNumber(value, formData.telefono);
      setFormData({ ...formData, telefono: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validar formato de teléfono
    const phonePattern = /^\+502\s?\d{4}-\d{4}$/;
    if (!phonePattern.test(formData.telefono)) {
      alert("El teléfono debe tener el formato válido (+502 0000-0000)");
      return;
    }

    try {
      if (clienteEdit) {
        await updateCliente(clienteEdit.id_cliente, formData);
        alert("Cliente actualizado correctamente");
      } else {
        await createCliente(formData);
        alert("Cliente creado correctamente");
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
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
          {clienteEdit ? "Editar Cliente" : "Nuevo Cliente"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="+502 0000-0000"
            value={formData.telefono}
            onChange={handleChange}
            maxLength="15"
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <small style={{ color: "#6b7280" }}>
            Formato: +502 0000-0000 (se aplica automáticamente)
          </small>

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

export default ClienteForm;
