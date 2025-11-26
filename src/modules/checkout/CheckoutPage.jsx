import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createAddress, getAddresses, updateAddress, deleteAddress } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import { validatePaymentData } from "../../services/paymentService";
import { getClienteProfile } from "../../services/clienteAuthService";
import { Step1Address, Step2Payment, Step3Review } from "./components/CheckoutProcess";
import OrderConfirmationModal from "./components/CheckoutProcess/OrderConfirmationModal/OrderConfirmationModal";
import './Checkout.css';
import './components/CheckoutProcess/CheckoutProcess.css';
import { FiAlertTriangle } from 'react-icons/fi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isClienteLoggedIn} = useAuth();
  
  // Cart data from navigation state - memoized to prevent unnecessary re-renders
  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state?.cartItems]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [clientProfile, setClientProfile] = useState(null);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    calle: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: "",
    es_principal: false
  });

  // Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentData, setPaymentData] = useState({
    numero_tarjeta: "",
    nombre_titular: "",
    cvv: "",
    fecha_expiracion: "",
    tipo_tarjeta: "",
    banco: "",
    email_paypal: "",
    banco_origen: "",
    numero_cuenta: "",
    titular_cuenta: "",
    numero_transaccion: "",
    wallet_address: "",
    entrega: "contra_entrega"
  });
  
  // Payment errors
  const [paymentErrors, setPaymentErrors] = useState({});

  // Order data
  const [orderNotes, setOrderNotes] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Helper function
  const getAddressId = (address) => {
    return address?.id || address?.id_direccion || address?.direccion_id;
  };

  /**
   * Obtiene el ID del método de pago verificado del cliente
   * Busca en selectedPaymentMethod el id_metodo_pago_cliente
   */
  const getPaymentMethodId = useCallback(() => {
    if (!selectedPaymentMethod) return null;
    
    // Si es un método de pago guardado, tiene savedMethodData con id_metodo_pago_cliente
    if (selectedPaymentMethod.savedMethodData?.id_metodo_pago_cliente) {
      return selectedPaymentMethod.savedMethodData.id_metodo_pago_cliente;
    }
    
    // Si es un método guardado, puede tener el ID directamente
    if (selectedPaymentMethod.id_metodo_pago_cliente) {
      return selectedPaymentMethod.id_metodo_pago_cliente;
    }
    
    // Si es un método nuevo sin ID, necesita ser verificado primero
    return null;
  }, [selectedPaymentMethod]);



  const loadAddresses = useCallback(async () => {
    try {
      const addressResponse = await getAddresses();
      const addressList = addressResponse?.data?.direcciones || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);
      
      if (Array.isArray(addressList) && addressList.length > 0) {
        const mainAddress = addressList.find(addr => addr.es_principal);
        if (mainAddress) {
          const mainId = getAddressId(mainAddress);
          setSelectedAddressId(mainId);
        }
      }
    } catch (error) {
      console.error("Error cargando direcciones:", error);
      setAddresses([]);
    }
  }, []);

  const loadClientProfile = useCallback(async () => {
    try {
      const profileData = await getClienteProfile();
      setClientProfile(profileData);
    } catch (error) {
      console.error("Error cargando perfil del cliente:", error);
      // No es crítico si falla, continuamos con los datos disponibles
    }
  }, []);

  useEffect(() => {
    if (!isClienteLoggedIn()) {
      navigate("/catalogo");
      return;
    }
    
    if (!cartItems.length) {
      navigate("/catalogo");
      return;
    }
    
    loadAddresses();
    loadClientProfile();
  }, [isClienteLoggedIn, cartItems, navigate, loadAddresses, loadClientProfile]);

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        calle: address.calle || "",
        ciudad: address.ciudad || "",
        estado: address.estado || "",
        codigo_postal: address.codigo_postal || "",
        pais: address.pais || "",
        es_principal: address.es_principal || false
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        calle: "",
        ciudad: "",
        estado: "",
        codigo_postal: "",
        pais: "",
        es_principal: false
      });
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm({
      calle: "",
      ciudad: "",
      estado: "",
      codigo_postal: "",
      pais: "",
      es_principal: false
    });
  };

  const openDeleteConfirm = (address) => {
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    setLoading(true);
    setError("");
    
    try {
      const addressId = getAddressId(addressToDelete);
      await deleteAddress(addressId);
      
      const currentAddresses = Array.isArray(addresses) ? addresses : [];
      const updatedAddresses = currentAddresses.filter(addr => 
        getAddressId(addr) !== addressId
      );
      setAddresses(updatedAddresses);
      
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
        if (updatedAddresses.length > 0) {
          const firstAddressId = getAddressId(updatedAddresses[0]);
          setSelectedAddressId(firstAddressId);
        }
      }
      
      closeDeleteConfirm();
      
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async () => {
    setError("");
    setLoading(true);
    
    try {
      const addressId = getAddressId(editingAddress);
      
      let result;
      if (editingAddress && addressId) {
        result = await updateAddress(addressId, addressForm);
        const currentAddresses = Array.isArray(addresses) ? addresses : [];
        const updatedAddresses = currentAddresses.map(addr => 
          getAddressId(addr) === addressId ? result.data : addr
        );
        setAddresses(updatedAddresses);
      } else {
        result = await createAddress(addressForm);
        const currentAddresses = Array.isArray(addresses) ? addresses : [];
        setAddresses([...currentAddresses, result.data]);
        setSelectedAddressId(getAddressId(result.data));
      }
      
      closeAddressModal();
    } catch (error) {
      console.error('Error en handleAddressSubmit:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressFormChange = (field, value) => {
    setAddressForm({...addressForm, [field]: value});
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedAddressId) {
      setError("Por favor selecciona una dirección de envío");
      return;
    }
    
    if (step === 2) {
      if (!selectedPaymentMethod) {
        setError("Por favor selecciona un método de pago");
        return;
      }
      
      // Validar datos según el método de pago seleccionado
      // Solo validar si es un método NUEVO (no guardado)
      const isNewMethod = !selectedPaymentMethod.isSaved;
      if (isNewMethod && selectedPaymentMethod.tipo_metodo !== 'efectivo') {
        const validation = validatePaymentData(selectedPaymentMethod.tipo_metodo, paymentData);
        if (!validation.isValid) {
          setError(validation.errors.join(", "));
          return;
        }
      }
    }
    
    setError("");
    setStep(step + 1);
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Validaciones previas
      if (!selectedAddressId) {
        setError("Por favor selecciona una dirección de envío");
        setLoading(false);
        return;
      }

      if (!selectedPaymentMethod) {
        setError("Por favor selecciona un método de pago");
        setLoading(false);
        return;
      }

      // Obtener ID del método de pago verificado
      const paymentMethodId = getPaymentMethodId();
      if (!paymentMethodId) {
        setError("El método de pago debe estar verificado antes de crear la orden");
        setLoading(false);
        return;
      }

      // Construir orderData según lo esperado por el backend
      // POST /api/ordenes espera:
      // {
      //   id_metodo_pago_cliente: number,
      //   id_direccion_envio: number,
      //   notas_orden?: string
      // }
      const orderData = {
        id_metodo_pago_cliente: paymentMethodId,
        id_direccion_envio: selectedAddressId,
        notas_orden: orderNotes || undefined
      };

      console.log("📦 Creando orden con datos:", orderData);

      // Llamar al servicio para crear la orden
      const response = await createOrder(orderData);
      
      // Validar respuesta
      if (!response || !response.success || !response.data) {
        throw new Error(response?.message || "Error al crear la orden");
      }

      const orden = response.data;
      
      // Guardar orden y mostrar modal
      setCreatedOrder(orden);
      setShowConfirmationModal(true);
      
    } catch (error) {
      console.error("❌ Error creando orden:", error);
      
      // Manejo de errores específicos del backend
      const errorMessage = error.response?.data?.message || error.message;
      const errorCode = error.response?.data?.code;

      if (errorCode === "METODO_NO_VERIFICADO") {
        setError("El método de pago debe estar verificado. Por favor intenta de nuevo.");
      } else if (errorCode === "CARRITO_VACIO") {
        setError("Tu carrito está vacío. Agrega productos antes de crear la orden.");
      } else if (errorCode === "STOCK_INSUFICIENTE") {
        setError("Stock insuficiente para uno o más productos. Revisa tu carrito.");
      } else if (errorCode === "ACCESO_DENEGADO") {
        setError("No tienes permiso para usar esta dirección o método de pago.");
      } else {
        setError(errorMessage || "Error al crear la orden. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  // Styles
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#f8fafc"
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem"
  };

  const stepIndicatorStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3rem",
    position: "relative"
  };

  const stepStyle = (stepNumber, isActive, isCompleted) => ({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: isCompleted ? "#10b981" : isActive ? "#2563eb" : "#e5e7eb",
    color: isCompleted || isActive ? "white" : "#6b7280",
    zIndex: 1
  });

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f3f4f6",
    color: "#374151"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
          Finalizar Compra
        </h1>

        {/* Step Indicator */}
        <div style={stepIndicatorStyle}>
          <div style={stepStyle(1, step === 1, step > 1)}>1</div>
          <div style={stepStyle(2, step === 2, step > 2)}>2</div>
          <div style={stepStyle(3, step === 3, step > 3)}>3</div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center"
          }}>
            <FiAlertTriangle style={{ color: "#dc2626", marginRight: "0.5rem" }} />
            <span style={{ color: "#dc2626" }}>{error}</span>
          </div>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <Step1Address
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={(id) => {
              setSelectedAddressId(id);
            }}
            loading={loading}
            error={error}
            showAddressModal={showAddressModal}
            onOpenAddressModal={openAddressModal}
            onCloseAddressModal={closeAddressModal}
            showDeleteConfirm={showDeleteConfirm}
            onOpenDeleteConfirm={openDeleteConfirm}
            onCloseDeleteConfirm={closeDeleteConfirm}
            addressToDelete={addressToDelete}
            onDeleteAddress={handleDeleteAddress}
            editingAddress={editingAddress}
            addressForm={addressForm}
            onAddressFormChange={handleAddressFormChange}
            onAddressSubmit={handleAddressSubmit}
            getAddressId={getAddressId}
            onNextStep={handleNextStep}
            formGroupStyle={formGroupStyle}
            labelStyle={labelStyle}
            buttonStyle={buttonStyle}
            secondaryButtonStyle={secondaryButtonStyle}
            primaryButtonStyle={primaryButtonStyle}
          />
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <Step2Payment
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={(method) => {
              setSelectedPaymentMethod(method);
            }}
            paymentData={paymentData}
            onPaymentDataChange={setPaymentData}
            errors={paymentErrors}
            setErrors={setPaymentErrors}
            onPrevStep={() => setStep(1)}
            onNextStep={handleNextStep}
            secondaryButtonStyle={secondaryButtonStyle}
            primaryButtonStyle={primaryButtonStyle}
          />
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <Step3Review
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            selectedPaymentMethod={selectedPaymentMethod}
            paymentData={paymentData}
            orderNotes={orderNotes}
            onOrderNotesChange={setOrderNotes}
            onPrevStep={() => setStep(2)}
            onCreateOrder={handleCreateOrder}
            loading={loading}
            formGroupStyle={formGroupStyle}
            labelStyle={labelStyle}
            inputStyle={inputStyle}
            secondaryButtonStyle={secondaryButtonStyle}
            primaryButtonStyle={primaryButtonStyle}
            getAddressId={getAddressId}
            clientData={clientProfile}
          />
        )}
      </div>

      {/* Modal de confirmación de orden */}
      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        order={createdOrder}
        onClose={() => setShowConfirmationModal(false)}
      />
    </div>
  );
};

export default CheckoutPage;