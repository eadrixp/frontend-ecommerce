import React from "react";

const ShippingAddress = ({ addresses, selectedAddressId, getAddressId }) => {
  const selectedAddress = addresses.find(addr => getAddressId(addr) === selectedAddressId);

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1.5rem"
    }}>
      <h3 style={{ marginBottom: "1rem" }}>Dirección de Envío</h3>
      {selectedAddress ? (
        <div>
          <p style={{ marginBottom: "0.25rem" }}><strong>{selectedAddress.calle}</strong></p>
          <p style={{ marginBottom: "0.25rem" }}>{selectedAddress.ciudad}, {selectedAddress.estado}</p>
          <p style={{ marginBottom: "0.25rem" }}>{selectedAddress.codigo_postal}, {selectedAddress.pais}</p>
          {selectedAddress.es_principal && (
            <span style={{ 
              backgroundColor: "#2563eb", 
              color: "white", 
              fontSize: "0.75rem", 
              padding: "0.25rem 0.5rem", 
              borderRadius: "4px",
              marginTop: "0.5rem",
              display: "inline-block"
            }}>
              Principal
            </span>
          )}
        </div>
      ) : (
        <div>
          <p style={{ color: "#ef4444" }}>Por favor selecciona una dirección de envío</p>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
