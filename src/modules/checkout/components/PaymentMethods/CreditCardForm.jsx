import React from 'react';
import { 
  formatCardNumber, 
  formatExpirationDate, 
  formatCVV,
  detectCardType 
} from '../../../../utils/cardUtils';
import CardPreview from './CardPreview/CardPreview';

const CreditCardForm = ({ 
  paymentData, 
  onPaymentDataChange, 
  errors = {},
  isSaved = false
}) => {
  // Formatea el número de tarjeta a formato XXXX XXXX XXXX XXXX
  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    const cardType = detectCardType(formatted);
    
    onPaymentDataChange({
      ...paymentData,
      numero_tarjeta: formatted,
      tipo_tarjeta: cardType
    });
  };

  // Formatea la fecha de expiración a MM/YY
  const handleExpirationDateChange = (value) => {
    const formatted = formatExpirationDate(value);
    onPaymentDataChange({
      ...paymentData,
      fecha_expiracion: formatted
    });
  };

  // Valida y formatea el CVV (solo dígitos, 3-4 caracteres)
  const handleCVVChange = (value) => {
    const formatted = formatCVV(value);
    onPaymentDataChange({
      ...paymentData,
      cvv: formatted
    });
  };

  const handleChange = (field, value) => {
    onPaymentDataChange({
      ...paymentData,
      [field]: value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Vista previa de la tarjeta */}
      {!isSaved && (
        <CardPreview paymentData={paymentData} />
      )}

      <div className="form-group">
        <label>Número de tarjeta *</label>
        <input
          type="text"
          value={paymentData.numero_tarjeta || ''}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          placeholder="1234 5678 9012 3456"
          disabled={isSaved}
          className={errors.numero_tarjeta ? 'error' : ''}
          maxLength={19}
          inputMode="numeric"
        />
        {errors.numero_tarjeta && (
          <div className="form-error">{errors.numero_tarjeta}</div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Fecha de expiración (MM/YY) *</label>
          <input
            type="text"
            value={paymentData.fecha_expiracion || ''}
            onChange={(e) => handleExpirationDateChange(e.target.value)}
            placeholder="MM/YY"
            disabled={isSaved}
            className={errors.fecha_expiracion ? 'error' : ''}
            maxLength={5}
            inputMode="numeric"
          />
          {errors.fecha_expiracion && (
            <div className="form-error">{errors.fecha_expiracion}</div>
          )}
        </div>
        <div className="form-group">
          <label>CVV *</label>
          <input
            type="text"
            value={paymentData.cvv || ''}
            onChange={(e) => handleCVVChange(e.target.value)}
            placeholder="123"
            maxLength={4}
            className={errors.cvv ? 'error' : ''}
            inputMode="numeric"
          />
          {errors.cvv && (
            <div className="form-error">{errors.cvv}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Nombre del titular *</label>
        <input
          type="text"
          value={paymentData.nombre_titular || ''}
          onChange={(e) => handleChange('nombre_titular', e.target.value)}
          placeholder="Como aparece en la tarjeta"
          disabled={isSaved}
          className={errors.nombre_titular ? 'error' : ''}
        />
        {errors.nombre_titular && (
          <div className="form-error">{errors.nombre_titular}</div>
        )}
      </div>

      {!isSaved && (
        <div className="form-checkbox">
          <input
            type="checkbox"
            id="save-payment"
            checked={paymentData.save_method || false}
            onChange={(e) => handleChange('save_method', e.target.checked)}
          />
          <label htmlFor="save-payment">
            Guardar este método de pago para futuras compras
          </label>
        </div>
      )}
    </div>
  );
};

export default CreditCardForm;
