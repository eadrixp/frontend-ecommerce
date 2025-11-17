import React from "react";
import { FiX } from 'react-icons/fi';

const AddressModal = ({
  isOpen,
  editingAddress,
  addressForm,
  onFormChange,
  onSubmit,
  onClose,
  loading,
  formGroupStyle,
  labelStyle,
  primaryButtonStyle,
  secondaryButtonStyle
}) => {
  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    boxSizing: "border-box"
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "2rem",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          color: "#6b7280"
        }}>
          <FiX />
        </button>
        
        <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
          {editingAddress ? "Editar Dirección" : "Agregar Nueva Dirección"}
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Calle y número:</label>
            <input
              type="text"
              placeholder="14 calle 9-33 zona 1"
              value={addressForm.calle}
              onChange={(e) => onFormChange('calle', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Ciudad:</label>
              <input
                type="text"
                placeholder="Quetzaltenango"
                value={addressForm.ciudad}
                onChange={(e) => onFormChange('ciudad', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Estado:</label>
              <input
                type="text"
                placeholder="San Juan Ostuncalco"
                value={addressForm.estado}
                onChange={(e) => onFormChange('estado', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Código Postal:</label>
              <input
                type="text"
                placeholder="03100"
                value={addressForm.codigo_postal}
                onChange={(e) => onFormChange('codigo_postal', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>País:</label>
              <input
                type="text"
                placeholder="Guatemala"
                value={addressForm.pais}
                onChange={(e) => onFormChange('pais', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={{
              ...labelStyle,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={addressForm.es_principal}
                onChange={(e) => onFormChange('es_principal', e.target.checked)}
                style={{ margin: 0 }}
              />
              Establecer como dirección principal
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...secondaryButtonStyle,
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                ...primaryButtonStyle,
                opacity: (loading || !addressForm.calle || !addressForm.ciudad || !addressForm.estado || !addressForm.codigo_postal || !addressForm.pais) ? 0.6 : 1
              }}
            >
              {loading ? "Guardando..." : "Guardar Dirección"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
