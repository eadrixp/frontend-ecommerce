import React from "react";

const Step3Review = ({
  cartItems,
  subtotal,
  shipping,
  total,
  addresses,
  selectedAddressId,
  selectedPaymentMethod,
  paymentData,
  orderNotes,
  onOrderNotesChange,
  onPrevStep,
  onCreateOrder,
  loading,
  formGroupStyle,
  labelStyle,
  inputStyle,
  secondaryButtonStyle,
  primaryButtonStyle,
  getAddressId
}) => {
  return (
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
            <span>{item.nombre_producto} x {item.cantidad}</span>
            <span>Q{(item.precio * item.cantidad).toLocaleString('es-GT', { maximumFractionDigits: 2 })}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <span>Subtotal:</span>
          <span>Q{subtotal.toLocaleString('es-GT', { maximumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Envío:</span>
          <span>{shipping === 0 ? 'Gratis' : `Q${shipping.toLocaleString('es-GT', { maximumFractionDigits: 2 })}`}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          <span>Total:</span>
          <span>Q{total.toLocaleString('es-GT', { maximumFractionDigits: 2 })}</span>
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
          onChange={(e) => onOrderNotesChange(e.target.value)}
          style={{
            ...inputStyle,
            height: "100px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button
          onClick={onPrevStep}
          style={secondaryButtonStyle}
        >
          Volver
        </button>
        <button
          onClick={onCreateOrder}
          disabled={loading}
          style={{
            ...primaryButtonStyle,
            opacity: loading ? 0.5 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Procesando..." : `Finalizar Compra (Q${total.toLocaleString('es-GT', { maximumFractionDigits: 2 })})`}
        </button>
      </div>
    </div>
  );
};

export default Step3Review;
