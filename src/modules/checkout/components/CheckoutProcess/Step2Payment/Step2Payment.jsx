import React from "react";
import PaymentForm from "../../PaymentForm";

const Step2Payment = ({
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentData,
  onPaymentDataChange,
  errors,
  setErrors,
  onPrevStep,
  onNextStep,
  secondaryButtonStyle,
  primaryButtonStyle
}) => {
  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Información de pago
      </h2>

      <PaymentForm
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        paymentData={paymentData}
        onPaymentDataChange={onPaymentDataChange}
        errors={errors}
        setErrors={setErrors}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button
          onClick={onPrevStep}
          style={secondaryButtonStyle}
        >
          Volver
        </button>
        <button
          onClick={onNextStep}
          style={primaryButtonStyle}
        >
          Revisar Orden
        </button>
      </div>
    </div>
  );
};

export default Step2Payment;
