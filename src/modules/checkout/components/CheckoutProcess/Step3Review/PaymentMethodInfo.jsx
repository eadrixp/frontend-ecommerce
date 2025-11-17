import React from "react";

const PaymentMethodInfo = ({ selectedPaymentMethod, paymentData }) => {
  return (
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
  );
};

export default PaymentMethodInfo;
