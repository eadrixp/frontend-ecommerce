import React from "react";
import OrderSummary from "./OrderSummary";
import ShippingAddress from "./ShippingAddress";
import PaymentMethodInfo from "./PaymentMethodInfo";
import ClientInfo from "./ClientInfo";
import OrderNotes from "./OrderNotes";

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
  getAddressId,
  clientData
}) => {
  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Revisar Orden
      </h2>

      <ClientInfo clientData={clientData} />
      <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} />
      <ShippingAddress addresses={addresses} selectedAddressId={selectedAddressId} getAddressId={getAddressId} />
      <PaymentMethodInfo selectedPaymentMethod={selectedPaymentMethod} paymentData={paymentData} />
      <OrderNotes 
        orderNotes={orderNotes} 
        onOrderNotesChange={onOrderNotesChange} 
        formGroupStyle={formGroupStyle}
        labelStyle={labelStyle}
        inputStyle={inputStyle}
      />

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
