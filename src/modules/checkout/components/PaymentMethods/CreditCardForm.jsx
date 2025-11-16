import React from 'react';

const CreditCardForm = ({ 
  paymentData, 
  onPaymentDataChange, 
  errors = {},
  isSaved = false
}) => {
  const handleChange = (field, value) => {
    onPaymentDataChange({
      ...paymentData,
      [field]: value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div className="form-group">
        <label>Número de tarjeta *</label>
        <input
          type="text"
          value={paymentData.numero_tarjeta || ''}
          onChange={(e) => handleChange('numero_tarjeta', e.target.value)}
          placeholder="1234 5678 9012 3456"
          disabled={isSaved}
          className={errors.numero_tarjeta ? 'error' : ''}
        />
        {errors.numero_tarjeta && (
          <div className="form-error">{errors.numero_tarjeta}</div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Fecha de expiración *</label>
          <input
            type="month"
            value={paymentData.fecha_expiracion || ''}
            onChange={(e) => handleChange('fecha_expiracion', e.target.value)}
            disabled={isSaved}
            className={errors.fecha_expiracion ? 'error' : ''}
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
            onChange={(e) => handleChange('cvv', e.target.value)}
            placeholder="123"
            maxLength={4}
            className={errors.cvv ? 'error' : ''}
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
