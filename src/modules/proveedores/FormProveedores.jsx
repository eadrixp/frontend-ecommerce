import React, { useState, useEffect } from "react";
import {
  createProveedor,
  updateProveedor,
} from "../../services/proveedoresService";

const FormProveedores = ({ proveedorEdit, onClose }) => {
  const [formData, setFormData] = useState({
    nombre_proveedor: "",
    contacto: "",
    email: "",
    telefono: "",
    direccion: "",
    nit: "",
  });

  useEffect(() => {
    if (proveedorEdit) {
      setFormData({
        nombre_proveedor: proveedorEdit.nombre_proveedor || "",
        contacto: proveedorEdit.contacto || "",
        email: proveedorEdit.email || "",
        telefono: proveedorEdit.telefono || "",
        direccion: proveedorEdit.direccion || "",
        nit: proveedorEdit.nit || "",
      });
    }
  }, [proveedorEdit]);

  // ✅ Formatear teléfono automáticamente (+502 XXXX-XXXX)
  const formatPhoneNumber = (newValue, oldValue = "") => {
    const digits = newValue.replace(/\D/g, "");
    const prevDigits = oldValue.replace(/\D/g, "");

    if (!digits) return "";
    const isDeleting = prevDigits.length > digits.length;
    if (isDeleting && digits === "502") return "";

    let full = digits.startsWith("502") ? digits : `502${digits}`;
    full = full.slice(0, 11); // 502 + 8 dígitos

    const prefix = full.slice(0, 3);
    const local = full.slice(3);

    if (!local) return `+${prefix}`;
    if (local.length <= 4) return `+${prefix} ${local}`;
    return `+${prefix} ${local.slice(0, 4)}-${local.slice(4)}`;
  };

  // ✅ Formatear NIT automáticamente (XXXXXX-X)
  const formatNIT = (newValue) => {
    const digits = newValue.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6, 7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const formatted = formatPhoneNumber(value, formData.telefono);
      setFormData({ ...formData, telefono: formatted });
    } else if (name === "nit") {
      const formatted = formatNIT(value);
      setFormData({ ...formData, nit: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validaciones
    const phonePattern = /^\+502\s?\d{4}-\d{4}$/;
    const nitPattern = /^\d{6}-\d{1}$/;

    if (!phonePattern.test(formData.telefono)) {
      alert("El teléfono debe tener el formato válido (+502 0000-0000)");
      return;
    }

    if (!nitPattern.test(formData.nit)) {
      alert("El NIT debe tener el formato válido (XXXXXX-X)");
      return;
    }

    try {
      if (proveedorEdit) {
        await updateProveedor(proveedorEdit.id_proveedor, formData);
        alert("Proveedor actualizado correctamente");
      } else {
        await createProveedor(formData);
        alert("Proveedor creado correctamente");
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);
      alert("Error al guardar proveedor");
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
          {proveedorEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre_proveedor"
            placeholder="Nombre del proveedor"
            value={formData.nombre_proveedor}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="contacto"
            placeholder="Nombre del contacto"
            value={formData.contacto}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="tel"
            name="telefono"
            placeholder="+502 0000-0000"
            value={formData.telefono}
            onChange={handleChange}
            maxLength="15"
            required
            style={inputStyle}
          />
         

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="nit"
            placeholder="NIT (XXXXXX-X)"
            value={formData.nit}
            onChange={handleChange}
            maxLength="8"
            required
            style={inputStyle}
          />
         

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

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

export default FormProveedores;
