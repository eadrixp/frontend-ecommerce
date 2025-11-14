import React from 'react';

const AddressModal = ({
  isOpen,
  onClose,
  newAddress,
  onNewAddressChange,
  onSaveAddress,
  loading,
  formGroupStyle,
  labelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
          Agregar Nueva Dirección
        </h3>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Nombre de la dirección:</label>
          <input
            type="text"
            placeholder="Casa, Oficina, etc."
            value={newAddress.nombre}
            onChange={(e) => onNewAddressChange({ ...newAddress, nombre: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Calle y número:</label>
          <input
            type="text"
            placeholder="Av. Insurgentes Sur 123"
            value={newAddress.calle}
            onChange={(e) => onNewAddressChange({ ...newAddress, calle: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Colonia:</label>
            <input
              type="text"
              placeholder="Del Valle"
              value={newAddress.colonia}
              onChange={(e) => onNewAddressChange({ ...newAddress, colonia: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Código Postal:</label>
            <input
              type="text"
              placeholder="03100"
              value={newAddress.codigo_postal}
              onChange={(e) => onNewAddressChange({ ...newAddress, codigo_postal: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Ciudad:</label>
            <input
              type="text"
              placeholder="Ciudad de México"
              value={newAddress.ciudad}
              onChange={(e) => onNewAddressChange({ ...newAddress, ciudad: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Estado:</label>
            <input
              type="text"
              placeholder="CDMX"
              value={newAddress.estado}
              onChange={(e) => onNewAddressChange({ ...newAddress, estado: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>País:</label>
          <input
            type="text"
            placeholder="México"
            value={newAddress.pais}
            onChange={(e) => onNewAddressChange({ ...newAddress, pais: e.target.value })}
            style={inputStyle}
          />
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
              checked={newAddress.es_principal}
              onChange={(e) => onNewAddressChange({ ...newAddress, es_principal: e.target.checked })}
              style={{ margin: 0 }}
            />
            Establecer como dirección principal
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
          <button
            onClick={onClose}
            style={secondaryButtonStyle}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onSaveAddress}
            style={{
              ...primaryButtonStyle,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;