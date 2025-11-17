import React from "react";
import { FiTrash2 } from 'react-icons/fi';

const DeleteConfirmModal = ({
  isOpen,
  addressToDelete,
  onConfirm,
  onCancel,
  loading,
  buttonStyle
}) => {
  if (!isOpen) return null;

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
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "2rem",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        position: "relative"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            color: "#dc2626"
          }}>
            <FiTrash2 size={24} />
          </div>
          
          <h3 style={{ 
            fontSize: "1.25rem", 
            fontWeight: "bold", 
            marginBottom: "1rem",
            color: "#1f2937"
          }}>
            Eliminar Dirección
          </h3>
          
          <p style={{ 
            color: "#6b7280", 
            marginBottom: "0.5rem",
            fontSize: "0.875rem"
          }}>
            ¿Estás seguro de que deseas eliminar esta dirección?
          </p>
          
          {addressToDelete && (
            <div style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1rem",
              margin: "1rem 0",
              textAlign: "left"
            }}>
              <strong>{addressToDelete.calle}</strong><br/>
              {addressToDelete.ciudad}, {addressToDelete.estado}, {addressToDelete.codigo_postal}<br/>
              {addressToDelete.pais}
              {addressToDelete.es_principal && (
                <span style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  marginLeft: "0.5rem"
                }}>
                  Principal
                </span>
              )}
            </div>
          )}
          
          <p style={{ 
            color: "#dc2626", 
            fontSize: "0.875rem",
            fontWeight: "500",
            marginBottom: "1.5rem"
          }}>
            Esta acción no se puede deshacer.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={onCancel}
              style={{
                ...buttonStyle,
                backgroundColor: "#f3f4f6",
                color: "#374151"
              }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              style={{
                ...buttonStyle,
                backgroundColor: "#dc2626",
                color: "white",
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
