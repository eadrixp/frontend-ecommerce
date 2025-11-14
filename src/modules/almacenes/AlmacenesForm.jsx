import React, { useEffect, useState } from "react";
import { crearAlmacen, actualizarAlmacen } from "../../services/almacenesService";

const AlmacenForm = ({ almacenEdit, onClose }) => {
  const [formData, setFormData] = useState({
    nombre_almacen: "",
    direccion: "",
    telefono: "",
    responsable: "",
    activo: true,
  });

  useEffect(() => {
    if (almacenEdit) {
      setFormData({
        nombre_almacen: almacenEdit.nombre_almacen || "",
        direccion: almacenEdit.direccion || "",
        telefono: almacenEdit.telefono || "",
        responsable: almacenEdit.responsable || "",
        activo: almacenEdit.activo,
      });
    }
  }, [almacenEdit]);

  // Formato de teléfono Guatemala
  const formatPhoneNumber = (newValue, oldValue = "") => {
    const digits = newValue.replace(/\D/g, "");
    const prevDigits = oldValue.replace(/\D/g, "");

    if (!digits) return "";
    const isDeleting = prevDigits.length > digits.length;
    if (isDeleting && digits === "502") return "";

    let full = digits.startsWith("502") ? digits : `502${digits}`;
    full = full.slice(0, 11);

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

    const phonePattern = /^\+502\s?\d{4}-\d{4}$/;
    if (formData.telefono && !phonePattern.test(formData.telefono)) {
      alert("Formato de teléfono inválido (+502 0000-0000)");
      return;
    }

    try {
      if (almacenEdit) {
        await actualizarAlmacen(almacenEdit.id_almacen, formData);
        alert("Almacén actualizado correctamente");
      } else {
        await crearAlmacen(formData);
        alert("Almacén creado correctamente");
      }

      onClose();
    } catch (error) {
      console.error("Error guardando almacén:", error);
      alert("Hubo un error al guardar el almacén");
    }
  };

  return (
    <div style={modalBg}>
      <div style={modalCard}>
        <h3 style={{ marginBottom: "1rem" }}>
          {almacenEdit ? "Editar Almacén" : "Nuevo Almacén"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre_almacen"
            value={formData.nombre_almacen}
            onChange={handleChange}
            placeholder="Nombre del almacén"
            required
            style={input}
          />

          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            style={input}
          />

          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+502 0000-0000"
            style={input}
          />

          <input
            type="text"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            placeholder="Responsable"
            style={input}
          />

          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={(e) =>
                setFormData({ ...formData, activo: e.target.checked })
              }
            />
            Activo
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancelar
            </button>
            <button type="submit" style={saveBtn}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalBg = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalCard = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "12px",
  width: "420px",
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cancelBtn = {
  backgroundColor: "#6b7280",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "none",
  marginRight: "10px",
};

const saveBtn = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "none",
};

export default AlmacenForm;
