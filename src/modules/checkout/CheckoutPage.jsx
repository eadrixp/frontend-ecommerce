import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createAddress, getAddresses, updateAddress } from "../../services/addressService";
import { createOrder, processPayment } from "../../services/orderService";
import { 
  FiCheck, 
  FiAlertTriangle,
  FiX,
  FiEdit,
  FiPlus
} from 'react-icons/fi';

// Address Modal Component - Moved outside to prevent re-creation on each render
const AddressModal = ({ 
  showAddressModal, 
  closeAddressModal, 
  editingAddress, 
  addressForm, 
  setAddressForm, 
  handleAddressSubmit,
  loading,
  formGroupStyle,
  labelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle
}) => {
  if (!showAddressModal) return null;

  // Modal styles
  const modalOverlayStyle = {
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
  };

  const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    position: "relative"
  };

  const modalHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem"
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && closeAddressModal()}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
            {editingAddress ? "Editar Dirección" : "Nueva Dirección"}
          </h2>
          <button onClick={closeAddressModal} style={closeButtonStyle}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Dirección:</label>
            <input
              type="text"
              placeholder="Ej: Avenida Siempre Viva 742"
              value={addressForm.calle}
              onChange={(e) => setAddressForm({...addressForm, calle: e.target.value})}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Ciudad:</label>
              <input
                type="text"
                placeholder="Guatemala"
                value={addressForm.ciudad}
                onChange={(e) => setAddressForm({...addressForm, ciudad: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Estado:</label>
              <input
                type="text"
                placeholder="Guatemala"
                value={addressForm.estado}
                onChange={(e) => setAddressForm({...addressForm, estado: e.target.value})}
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
                placeholder="01001"
                value={addressForm.codigo_postal}
                onChange={(e) => setAddressForm({...addressForm, codigo_postal: e.target.value})}
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
                onChange={(e) => setAddressForm({...addressForm, pais: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <input
              type="checkbox"
              checked={addressForm.es_principal}
              onChange={(e) => setAddressForm({...addressForm, es_principal: e.target.checked})}
            />
            Establecer como dirección principal
          </label>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={closeAddressModal}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddressSubmit}
              disabled={loading || !addressForm.calle || !addressForm.ciudad || !addressForm.estado || !addressForm.codigo_postal || !addressForm.pais}
              style={{
                ...primaryButtonStyle,
                opacity: (loading || !addressForm.calle || !addressForm.ciudad || !addressForm.estado || !addressForm.codigo_postal || !addressForm.pais) ? 0.6 : 1
              }}
            >
              {loading ? "Guardando..." : editingAddress ? "Actualizar Dirección" : "Guardar Dirección"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { user, isClienteLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Cart data passed from ShoppingCart - memoized to avoid re-renders
  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state?.cartItems]);
  const totalAmount = useMemo(() => location.state?.totalAmount || 0, [location.state?.totalAmount]);

  const [step, setStep] = useState(1); // 1: Dirección, 2: Pago, 3: Confirmación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Address form data
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    calle: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: "",
    es_principal: false
  });
  
  // Payment form data
  const [paymentData, setPaymentData] = useState({
    metodo_pago: "tarjeta_credito",
    numeroTarjeta: "",
    nombreTarjeta: "",
    cvv: "",
    fechaExpiracion: ""
  });
  
  // Order data
  const [orderNotes, setOrderNotes] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  // Redirect if not logged in or no cart items
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
  }, [isClienteLoggedIn, cartItems, navigate]);

  // Helper function to get address ID from different possible field names
  const getAddressId = (address) => {
    return address?.id || address?.id_direccion || address?.direccion_id;
  };

  const loadAddresses = async () => {
    try {
      const addressList = await getAddresses();
      console.log('🏠 Raw address response:', addressList);
      console.log('🏠 Address data:', addressList.data);
      console.log('🏠 First address structure:', addressList.data?.[0] ? JSON.stringify(addressList.data[0], null, 2) : 'No addresses');
      
      setAddresses(addressList.data || []);
      // Only auto-select if there's a main address, don't auto-select first address
      if (addressList.data?.length > 0) {
        const mainAddress = addressList.data.find(addr => addr.es_principal);
        if (mainAddress) {
          const mainAddressId = getAddressId(mainAddress);
          setSelectedAddressId(mainAddressId);
        }
        // Don't auto-select first address if no main address exists
      }
    } catch (error) {
      console.warn("Error cargando direcciones:", error);
      setAddresses([]);
    }
  };

  const openAddressModal = (address = null) => {
    console.log('🏠 Opening address modal with:', address);
    console.log('🏠 Address ID:', address?.id);
    console.log('🏠 Address object full structure:', JSON.stringify(address, null, 2));
    console.log('🏠 Address object keys:', address ? Object.keys(address) : 'No address');
    
    if (address) {
      // Editing existing address
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
      // Creating new address
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

  const handleAddressSubmit = async () => {
    setError("");
    setLoading(true);
    
    try {
      console.log('📍 Iniciando operación de dirección...');
      console.log('📍 Usuario actual:', user);
      console.log('📍 Is cliente logged in:', isClienteLoggedIn());
      console.log('📍 Datos de dirección:', addressForm);
      console.log('📍 editingAddress:', editingAddress);
      console.log('📍 editingAddress.id:', editingAddress?.id);
      console.log('📍 editingAddress full object:', JSON.stringify(editingAddress, null, 2));
      
      // Check for different possible ID field names
      const addressId = getAddressId(editingAddress);
      console.log('📍 Detected address ID:', addressId);
      
      // Verificar token antes de crear/actualizar la dirección
      const { getToken } = await import('../../utils/storage');
      const currentToken = getToken();
      console.log('🔑 Token actual en checkout:', currentToken ? 'Presente' : 'Ausente');
      
      let result;
      if (editingAddress && addressId) {
        // Update existing address
        console.log('📍 Attempting to update address with ID:', addressId);
        result = await updateAddress(addressId, addressForm);
        console.log('✅ Dirección actualizada exitosamente:', result);
        
        // Update the address in the list
        const updatedAddresses = addresses.map(addr => 
          getAddressId(addr) === addressId ? result.data : addr
        );
        setAddresses(updatedAddresses);
      } else if (editingAddress && !addressId) {
        // Address ID not found, log error and treat as new address
        console.error('❌ No se encontró ID de dirección válido. Tratando como nueva dirección.');
        setError('Error: No se puede editar dirección sin ID válido');
        return;
      } else {
        // Create new address
        result = await createAddress(addressForm);
        console.log('✅ Dirección creada exitosamente:', result);
        
        // Add new address to the list
        setAddresses([...addresses, result.data]);
        setSelectedAddressId(getAddressId(result.data));
      }
      
      closeAddressModal();
    } catch (error) {
      console.error('❌ Error en handleAddressSubmit:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedAddressId) {
      setError("Por favor selecciona una dirección de envío");
      return;
    }
    
    if (step === 2) {
      if (!paymentData.numeroTarjeta || !paymentData.nombreTarjeta || 
          !paymentData.cvv || !paymentData.fechaExpiracion) {
        setError("Por favor completa todos los datos de la tarjeta");
        return;
      }
    }
    
    setError("");
    setStep(step + 1);
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setError("");
    
    try {
      // 1. Create order
      const orderData = {
        id_direccion_envio: selectedAddressId,
        notas_orden: orderNotes || "Pedido desde la tienda online"
      };
      
      const order = await createOrder(orderData);
      setCreatedOrder(order.data);
      
      // 2. Process payment
      const paymentInfo = {
        metodo_pago: paymentData.metodo_pago,
        monto: totalAmount,
        estado_pago: "completado",
        transaccion_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      await processPayment(order.data.id, paymentInfo);
      
      setStep(4); // Success step
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "2rem 1rem"
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
  };

  const stepIndicatorStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
    gap: "1rem"
  };

  const stepStyle = (stepNum, isActive, isCompleted) => ({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: isCompleted ? "#10b981" : isActive ? "#2563eb" : "#e5e7eb",
    color: isCompleted || isActive ? "white" : "#6b7280"
  });

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#374151"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6b7280",
    color: "white"
  };

  const formatPrice = (precio) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(precio);
  };

  if (step === 4) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
              <FiCheck size={64} color="#10b981" />
            </div>
            <h1 style={{ color: "#10b981", marginBottom: "1rem" }}>
              ¡Orden Completada!
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              Tu orden #{createdOrder?.id} ha sido procesada exitosamente
            </p>
            <div style={{ 
              backgroundColor: "#f0fdf4", 
              padding: "1rem", 
              borderRadius: "8px",
              border: "1px solid #bbf7d0",
              marginBottom: "2rem"
            }}>
              <p><strong>Total pagado:</strong> {formatPrice(totalAmount)}</p>
              <p><strong>Método de pago:</strong> Tarjeta de crédito</p>
              <p><strong>Estado:</strong> Confirmado</p>
            </div>
            <button 
              onClick={() => navigate("/catalogo")}
              style={primaryButtonStyle}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
            Finalizar Compra
          </h1>
          <p style={{ color: "#6b7280" }}>
            Total: {formatPrice(totalAmount)} • {cartItems.length} artículo{cartItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Step Indicator */}
        <div style={stepIndicatorStyle}>
          <div style={stepStyle(1, step === 1, step > 1)}>1</div>
          <div style={stepStyle(2, step === 2, step > 2)}>2</div>
          <div style={stepStyle(3, step === 3, step > 3)}>3</div>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "1px solid #fecaca"
          }}>
            <FiAlertTriangle size={16} style={{ marginRight: "0.5rem" }} />
            {error}
          </div>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              Dirección de Envío
            </h2>

            {addresses.length > 0 && (
              <div style={formGroupStyle}>
                <label style={labelStyle}>Seleccionar dirección:</label>
                {addresses.map(address => {
                  // Handle different possible ID field names
                  const addressId = getAddressId(address);
                  const isSelected = selectedAddressId === addressId;
                  return (
                  <div 
                    key={addressId} 
                    onClick={() => {
                      setSelectedAddressId(addressId);
                    }}
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
                        onChange={() => {
                          setSelectedAddressId(addressId);
                        }}
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddressModal(address);
                      }}
                      style={{
                        background: "none",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "1rem"
                      }}
                      title="Editar dirección"
                    >
                      <FiEdit size={16} />
                    </button>
                  </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => openAddressModal()}
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

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
              <button
                onClick={() => navigate("/catalogo")}
                style={secondaryButtonStyle}
              >
                Volver al Catálogo
              </button>
              <button
                onClick={handleNextStep}
                disabled={!selectedAddressId}
                style={{
                  ...primaryButtonStyle,
                  opacity: !selectedAddressId ? 0.6 : 1
                }}
              >
                Continuar al Pago
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              Información de pago
            </h2>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Método de pago:</label>
              <select
                value={paymentData.metodo_pago}
                onChange={(e) => setPaymentData({...paymentData, metodo_pago: e.target.value})}
                style={inputStyle}
              >
                <option value="tarjeta_credito">Tarjeta de crédito</option>
                <option value="tarjeta_debito">Tarjeta de débito</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {paymentData.metodo_pago.includes('tarjeta') && (
              <>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Nombre en la Tarjeta:</label>
                  <input
                    type="text"
                    placeholder="JUAN PÉREZ"
                    value={paymentData.nombreTarjeta}
                    onChange={(e) => setPaymentData({...paymentData, nombreTarjeta: e.target.value.toUpperCase()})}
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Número de Tarjeta:</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.numeroTarjeta}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
                      const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                      if (value.length <= 16) {
                        setPaymentData({...paymentData, numeroTarjeta: formatted});
                      }
                    }}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Fecha de Expiración:</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={paymentData.fechaExpiracion}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        let formatted = value;
                        if (value.length >= 2) {
                          formatted = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        if (formatted.length <= 5) {
                          setPaymentData({...paymentData, fechaExpiracion: formatted});
                        }
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>CVV:</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 4) {
                          setPaymentData({...paymentData, cvv: value});
                        }
                      }}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
              <button
                onClick={() => setStep(1)}
                style={secondaryButtonStyle}
              >
                Volver
              </button>
              <button
                onClick={handleNextStep}
                style={primaryButtonStyle}
              >
                Revisar Orden
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              Revisar Orden
            </h2>

            {/* Order Summary */}
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem"
            }}>
              <h3 style={{ marginBottom: "1rem" }}>Resumen de la Orden</h3>
              
              {cartItems.length > 0 ? (
                cartItems.map(item => {
                  // Use 'cantidad' (Spanish) as primary, 'quantity' as fallback
                  const quantity = Number(item.cantidad || item.quantity) || 1;
                  const unitPrice = Number(item.precio) || 0;
                  const totalPrice = quantity * unitPrice;
                  
                  return (
                    <div key={item.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #f3f4f6"
                    }}>
                      <div>
                        <strong>{item.nombre_producto}</strong>
                        <br/>
                        <span style={{ color: "#6b7280" }}>
                          Cantidad: {quantity} | Precio unitario: {formatPrice(unitPrice)}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div>{formatPrice(totalPrice)}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "1rem", textAlign: "center", color: "#6b7280" }}>
                  <p>No hay artículos en el carrito</p>
                  <p style={{ fontSize: "0.8rem" }}>
                    CartItems length: {cartItems.length}
                  </p>
                </div>
              )}
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1rem",
                fontSize: "1.25rem",
                fontWeight: "bold"
              }}>
                <span>Total:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem"
            }}>
              <h3 style={{ marginBottom: "1rem" }}>Dirección de Envío</h3>
              {(() => {
                const selectedAddress = addresses.find(addr => getAddressId(addr) === selectedAddressId);
                return selectedAddress ? (
                  <div>
                    <p><strong>{selectedAddress.calle}</strong></p>
                    <p>{selectedAddress.ciudad}, {selectedAddress.estado}, {selectedAddress.codigo_postal}</p>
                    <p>{selectedAddress.pais}</p>
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
                );
              })()}
            </div>

            {/* Payment Method */}
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem"
            }}>
              <h3 style={{ marginBottom: "1rem" }}>Método de Pago</h3>
              <p style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
                <strong>{paymentData.metodo_pago.replace('_', ' ')}</strong>
              </p>
              {paymentData.numeroTarjeta && (
                <div>
                  <p>**** **** **** {paymentData.numeroTarjeta.slice(-4)}</p>
                  <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                    {paymentData.nombreTarjeta}
                  </p>
                </div>
              )}
              {!paymentData.numeroTarjeta && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                  No se ha ingresado información de tarjeta
                </p>
              )}
            </div>

            {/* Order Notes */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Notas del Pedido (Opcional):</label>
              <textarea
                placeholder="Ej: Por favor entregar antes de las 5pm"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                style={{
                  ...inputStyle,
                  height: "100px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
              <button
                onClick={() => setStep(2)}
                style={secondaryButtonStyle}
              >
                Volver
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                style={{
                  ...primaryButtonStyle,
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? "Procesando..." : `Confirmar Orden - ${formatPrice(totalAmount)}`}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Address Modal */}
      <AddressModal 
        showAddressModal={showAddressModal}
        closeAddressModal={closeAddressModal}
        editingAddress={editingAddress}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        handleAddressSubmit={handleAddressSubmit}
        loading={loading}
        formGroupStyle={formGroupStyle}
        labelStyle={labelStyle}
        inputStyle={inputStyle}
        primaryButtonStyle={primaryButtonStyle}
        secondaryButtonStyle={secondaryButtonStyle}
      />
    </div>
  );
};

export default CheckoutPage;