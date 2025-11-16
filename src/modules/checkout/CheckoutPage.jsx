import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createAddress, getAddresses, updateAddress, deleteAddress } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import { validatePaymentData } from "../../services/paymentService";
import PaymentForm from "./components/PaymentForm";
import './Checkout.css';
import { 
  FiAlertTriangle,
  FiX,
  FiEdit,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isClienteLoggedIn } = useAuth();
  
  // Cart data from navigation state - memoized to prevent unnecessary re-renders
  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state?.cartItems]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

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
  const [orderNotes, setOrderNotes] = useState("");  // Helper function
  const getAddressId = (address) => {
    return address?.id || address?.id_direccion || address?.direccion_id;
  };



  const loadAddresses = useCallback(async () => {
    try {
      const addressResponse = await getAddresses();
      const addressList = addressResponse?.data?.direcciones || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);
      
      if (Array.isArray(addressList) && addressList.length > 0) {
        const mainAddress = addressList.find(addr => addr.es_principal);
        if (mainAddress) {
          setSelectedAddressId(getAddressId(mainAddress));
        }
      }
    } catch (error) {
      console.error("Error cargando direcciones:", error);
      setAddresses([]);
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
  }, [isClienteLoggedIn, cartItems, navigate, loadAddresses]);

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
      
      // Validar datos según el método de pago seleccionado (todos excepto efectivo)
      if (selectedPaymentMethod.tipo_metodo !== 'efectivo') {
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
      const orderData = {
        direccion_id: selectedAddressId,
        metodo_pago: selectedPaymentMethod?.tipo_metodo,
        productos: cartItems.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        })),
        notas: orderNotes,
        datos_pago: paymentData
      };

      const order = await createOrder(orderData);
      navigate('/orden-confirmada', { state: { order } });
      
    } catch (error) {
      console.error('Error creando orden:', error);
      setError(error.message);
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
                    onClick={() => setSelectedAddressId(addressId)}
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
                        onChange={() => setSelectedAddressId(addressId)}
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
                          openDeleteConfirm(address);
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

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
              <button
                onClick={handleNextStep}
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
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              Información de pago
            </h2>

            <PaymentForm
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              paymentData={paymentData}
              onPaymentDataChange={setPaymentData}
              errors={paymentErrors}
              setErrors={setPaymentErrors}
            />

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
              <h3 style={{ marginBottom: "1rem" }}>Resumen del Pedido</h3>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #f3f4f6",
                  marginBottom: "0.5rem"
                }}>
                  <span>{item.nombre} x {item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Envío:</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem", marginTop: "0.5rem" }}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
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
              {selectedPaymentMethod ? (
                <div>
                  <p style={{ marginBottom: "0.5rem" }}>
                    <strong>{selectedPaymentMethod.nombre_metodo}</strong>
                  </p>
                  {selectedPaymentMethod.tipo_metodo === 'tarjeta_credito' || selectedPaymentMethod.tipo_metodo === 'tarjeta_debito' ? (
                    <div>
                      <p>**** **** **** {paymentData.numero_tarjeta.slice(-4)}</p>
                      <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        {paymentData.nombre_titular}
                      </p>
                    </div>
                  ) : selectedPaymentMethod.tipo_metodo === 'billetera_digital' ? (
                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      {paymentData.email_paypal}
                    </p>
                  ) : selectedPaymentMethod.tipo_metodo === 'transferencia_bancaria' ? (
                    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      <p>Transferencia bancaria</p>
                      <p>Transacción: {paymentData.numero_transaccion}</p>
                    </div>
                  ) : selectedPaymentMethod.tipo_metodo === 'efectivo' ? (
                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      Pago contra entrega
                    </p>
                  ) : selectedPaymentMethod.tipo_metodo === 'criptomoneda' ? (
                    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      <p>Bitcoin</p>
                      <p>Wallet: {paymentData.wallet_address.substring(0, 8)}...{paymentData.wallet_address.slice(-8)}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                  No se ha seleccionado método de pago
                </p>
              )}
            </div>

            {/* Order Notes */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Notas del pedido (opcional):</label>
              <textarea
                placeholder="Instrucciones especiales para la entrega..."
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
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Procesando..." : `Finalizar Compra ($${total.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Address Modal */}
      {showAddressModal && (
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
          onClick={(e) => e.target === e.currentTarget && closeAddressModal()}
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
            <button onClick={closeAddressModal} style={{
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

            <form onSubmit={(e) => { e.preventDefault(); handleAddressSubmit(); }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Calle y número:</label>
                <input
                  type="text"
                  placeholder="Av. Insurgentes Sur 123"
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
                    placeholder="Ciudad de México"
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
                    placeholder="CDMX"
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
                    placeholder="03100"
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
                    placeholder="México"
                    value={addressForm.pais}
                    onChange={(e) => setAddressForm({...addressForm, pais: e.target.value})}
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
                    onChange={(e) => setAddressForm({...addressForm, es_principal: e.target.checked})}
                    style={{ margin: 0 }}
                  />
                  Establecer como dirección principal
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
                <button
                  type="button"
                  onClick={closeAddressModal}
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
                  {loading ? "Guardando..." : editingAddress ? "Actualizar Dirección" : "Guardar Dirección"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
          onClick={(e) => e.target === e.currentTarget && closeDeleteConfirm()}
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
                  onClick={closeDeleteConfirm}
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
                  onClick={handleDeleteAddress}
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
      )}
    </div>
  );
};

export default CheckoutPage;