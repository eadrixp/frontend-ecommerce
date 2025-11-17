import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiPlus, FiTrash2} from 'react-icons/fi';
import SelectionList from "../../shared/SelectionList";
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
  const navigate = useNavigate();
  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Dirección de envío
      </h2>

      {addresses.length > 0 && (
        <SelectionList
          items={addresses}
          selectedId={selectedAddressId}
          onSelectItem={(itemId, item) => {
            const addressId = getAddressId(item);
            onAddressSelect(addressId);
          }}
          onEditItem={(address) => onOpenAddressModal(address)}
          onDeleteItem={(address) => onOpenDeleteConfirm(address)}
          getItemContent={(address) => ({
            primary: address.calle,
            secondary: `${address.ciudad}, ${address.estado}, ${address.codigo_postal}, ${address.pais}`,
            badge: address.es_principal ? "Principal" : null
          })}
          renderBadge={(badge) => (
            <span style={{ 
              backgroundColor: "#2563eb", 
              color: "red", 
              fontSize: "0.75rem", 
              padding: "0.25rem 0.5rem", 
              borderRadius: "4px",
              marginLeft: "0.5rem"
            }}>
              {badge}
            </span>
          )}
          loading={loading}
          emptyMessage="No tienes direcciones guardadas. Agrega una nueva dirección para continuar."
          formGroupStyle={formGroupStyle}
          labelStyle={labelStyle}
          editIcon={<FiEdit size={16} />}
          deleteIcon={<FiTrash2 size={16} />}
          title="Seleccionar dirección:"
        />
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

      <div style={{ display: "flex",justifyContent: "space-between", marginTop: "2rem" }}>
        <button
          onClick={() => navigate(-1)}
          style={secondaryButtonStyle}
        >
          Volver
        </button>        
        <button
          onClick={onNextStep}
          disabled={!selectedAddressId}
          style={{
            ...primaryButtonStyle,
            justifyContent: "flex-end",
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
