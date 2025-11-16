import React from "react";
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import AddressModal from "./AddressModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const Step1Address = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
  loading,
  showAddressModal,
  onOpenAddressModal,
  onCloseAddressModal,
  showDeleteConfirm,
  onOpenDeleteConfirm,
  onCloseDeleteConfirm,
  addressToDelete,
  onDeleteAddress,
  editingAddress,
  addressForm,
  onAddressFormChange,
  onAddressSubmit,
  getAddressId,
  onNextStep,
  formGroupStyle,
  labelStyle,
  buttonStyle,
  secondaryButtonStyle,
  primaryButtonStyle
}) => {
  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Dirección de envío
      </h2>

      {addresses.length > 0 && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Seleccionar dirección:</label>
          {addresses.map(address => {
            const addressId = getAddressId(address);
            const isSelected = selectedAddressId === addressId;
            return (
              <div 
                key={addressId} 
                onClick={() => onAddressSelect(addressId)}
                style={{
                  border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  backgroundColor: isSelected ? "#eff6ff" : "white",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <input
                    type="radio"
                    name="addressSelection"
                    checked={isSelected}
                    onChange={() => onAddressSelect(addressId)}
                    style={{ 
                      marginTop: "0.25rem",
                      cursor: "pointer"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div style={{ flex: 1 }}>
                    <strong>{address.calle}</strong><br/>
                    {address.ciudad}, {address.estado}, {address.codigo_postal}<br/>
                    {address.pais}
                    {address.es_principal && (
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
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddressModal(address);
                    }}
                    style={{
                      background: "none",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#6b7280"
                    }}
                    title="Editar dirección"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDeleteConfirm(address);
                    }}
                    style={{
                      background: "none",
                      border: "1px solid #fca5a5",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#dc2626"
                    }}
                    title="Eliminar dirección"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addresses.length === 0 && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#fef3c7", 
          borderRadius: "8px", 
          marginBottom: "1rem",
          border: "1px solid #f59e0b"
        }}>
          <p style={{ margin: 0, color: "#92400e" }}>
            No tienes direcciones guardadas. Agrega una nueva dirección para continuar.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => onOpenAddressModal()}
        style={{
          ...buttonStyle,
          backgroundColor: "#10b981",
          color: "white",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        <FiPlus size={16} />
        Agregar Nueva Dirección
      </button>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
        <button
          onClick={onNextStep}
          disabled={!selectedAddressId}
          style={{
            ...primaryButtonStyle,
            opacity: !selectedAddressId ? 0.5 : 1,
            cursor: !selectedAddressId ? "not-allowed" : "pointer"
          }}
        >
          Continuar al Pago
        </button>
      </div>

      {/* Modales */}
      {showAddressModal && (
        <AddressModal
          isOpen={showAddressModal}
          editingAddress={editingAddress}
          addressForm={addressForm}
          onFormChange={onAddressFormChange}
          onSubmit={onAddressSubmit}
          onClose={onCloseAddressModal}
          loading={loading}
          formGroupStyle={formGroupStyle}
          labelStyle={labelStyle}
          buttonStyle={buttonStyle}
          secondaryButtonStyle={secondaryButtonStyle}
          primaryButtonStyle={primaryButtonStyle}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          addressToDelete={addressToDelete}
          onConfirm={onDeleteAddress}
          onCancel={onCloseDeleteConfirm}
          loading={loading}
          buttonStyle={buttonStyle}
        />
      )}
    </div>
  );
};

export default Step1Address;
