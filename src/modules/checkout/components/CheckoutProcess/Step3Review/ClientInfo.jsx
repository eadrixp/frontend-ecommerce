import React from "react";

const ClientInfo = ({ clientData }) => {
  // Mapear los campos correctamente según la estructura del perfil del cliente
  const nombreCompleto = clientData?.nombre && clientData?.apellido 
    ? `${clientData.nombre} ${clientData.apellido}` 
    : 'No disponible';
  
  const telefono = clientData?.telefono || 'No disponible';
  const correo = clientData?.usuario?.correo_electronico || 'No disponible';

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      backgroundColor: "#f9fafb"
    }}>
      <h3 style={{ marginBottom: "1rem" }}>Información del Cliente</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem"
      }}>
        <div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#6b7280", 
            fontWeight: "600", 
            textTransform: "uppercase",
            marginBottom: "0.25rem",
            letterSpacing: "0.5px"
          }}>
            Nombre Completo
          </p>
          <p style={{ 
            fontSize: "0.875rem", 
            color: "#1f2937",
            fontWeight: "500"
          }}>
            {nombreCompleto}
          </p>
        </div>
        
        <div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#6b7280", 
            fontWeight: "600", 
            textTransform: "uppercase",
            marginBottom: "0.25rem",
            letterSpacing: "0.5px"
          }}>
            Teléfono
          </p>
          <p style={{ 
            fontSize: "0.875rem", 
            color: "#1f2937",
            fontWeight: "500"
          }}>
            {telefono}
          </p>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#6b7280", 
            fontWeight: "600", 
            textTransform: "uppercase",
            marginBottom: "0.25rem",
            letterSpacing: "0.5px"
          }}>
            Correo Electrónico
          </p>
          <p style={{ 
            fontSize: "0.875rem", 
            color: "#1f2937",
            fontWeight: "500",
            wordBreak: "break-all"
          }}>
            {correo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;