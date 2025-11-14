import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { 
  detectCardType, 
  formatCardNumber, 
  formatExpirationDate 
} from '../../../services/paymentService';

const PaymentForm = ({ 
  paymentMethods,
  selectedPaymentMethod, 
  onPaymentMethodChange,
  paymentData, 
  onPaymentDataChange,
  formGroupStyle, 
  labelStyle, 
  inputStyle 
}) => {
  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      onPaymentDataChange({
        ...paymentData, 
        numero_tarjeta: formatted,
        tipo_tarjeta: detectCardType(formatted)
      });
    }
  };

  const handleExpirationChange = (value) => {
    const formatted = formatExpirationDate(value);
    if (formatted.length <= 5) {
      onPaymentDataChange({...paymentData, fecha_expiracion: formatted});
    }
  };

  const renderPaymentFields = () => {
    if (!selectedPaymentMethod || !selectedPaymentMethod.nombre) {
      return null;
    }

    switch (selectedPaymentMethod.nombre) {
      case 'tarjeta_credito':
      case 'tarjeta_debito':
        return (
          <div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Nombre del Titular:</label>
              <input
                type="text"
                placeholder="JUAN PÉREZ"
                value={paymentData.nombre_titular || ''}
                onChange={(e) => onPaymentDataChange({...paymentData, nombre_titular: e.target.value.toUpperCase()})}
                style={inputStyle}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Número de Tarjeta:</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.numero_tarjeta || ''}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Fecha de Expiración:</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.fecha_expiracion || ''}
                  onChange={(e) => handleExpirationChange(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>CVV:</label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 4) {
                      onPaymentDataChange({...paymentData, cvv: value});
                    }
                  }}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {paymentData.numero_tarjeta && paymentData.tipo_tarjeta && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginTop: "0.5rem", 
                fontSize: "0.875rem",
                color: "#059669"
              }}>
                <FiCreditCard style={{ marginRight: "0.5rem" }} />
                Tipo detectado: {paymentData.tipo_tarjeta.toUpperCase()}
              </div>
            )}
          </div>
        );

      case 'paypal':
        return (
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email de PayPal:</label>
            <input
              type="email"
              placeholder="usuario@example.com"
              value={paymentData.email_paypal || ''}
              onChange={(e) => onPaymentDataChange({...paymentData, email_paypal: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
        );

      case 'transferencia':
        return (
          <div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Banco de Origen:</label>
              <input
                type="text"
                placeholder="Banco de Guatemala"
                value={paymentData.banco_origen || ''}
                onChange={(e) => onPaymentDataChange({...paymentData, banco_origen: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Número de Cuenta:</label>
              <input
                type="text"
                placeholder="1234567890"
                value={paymentData.numero_cuenta || ''}
                onChange={(e) => onPaymentDataChange({...paymentData, numero_cuenta: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Titular de la Cuenta:</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={paymentData.titular_cuenta || ''}
                onChange={(e) => onPaymentDataChange({...paymentData, titular_cuenta: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
          </div>
        );

      case 'efectivo':
        return (
          <div style={formGroupStyle}>
            <p style={{ 
              color: "#6b7280", 
              fontSize: "0.9rem",
              margin: 0,
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px"
            }}>
              ✅ Pago contra entrega seleccionado. El monto exacto debe ser pagado al momento de recibir el pedido.
            </p>
          </div>
        );

      default:
        return (
          <div style={formGroupStyle}>
            <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
              Método de pago no soportado: {selectedPaymentMethod.nombre}
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Debug Info */}
      {console.log('PaymentForm render - paymentMethods:', paymentMethods)}
      {console.log('PaymentForm render - selectedPaymentMethod:', selectedPaymentMethod)}
      
      {/* Payment Method Selection */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Método de pago:</label>
        <select
          value={selectedPaymentMethod?.id || ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const method = paymentMethods.find(pm => pm.id === selectedId);
            console.log('PaymentForm - Selected method:', method);
            onPaymentMethodChange(method || null);
          }}
          style={inputStyle}
        >
          <option value="">Selecciona un método de pago</option>
          {Array.isArray(paymentMethods) ? paymentMethods.map(method => (
            <option key={method.id} value={method.id}>
              {method.descripcion || method.nombre}
            </option>
          )) : (
            <option disabled>Cargando métodos de pago...</option>
          )}
        </select>
      </div>

      {/* Payment Form Fields */}
      {renderPaymentFields()}
    </div>
  );
};

export default PaymentForm;