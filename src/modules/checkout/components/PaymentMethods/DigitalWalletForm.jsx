import React from 'react';

const DigitalWalletForm = ({ 
  paymentData, 
  onPaymentDataChange, 
  errors = {} 
}) => {
  const handleChange = (field, value) => {
    onPaymentDataChange({
      ...paymentData,
      [field]: value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: 'rgba(52, 152, 219, 0.08)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-md)',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Serás redirigido a PayPal para completar el pago de forma segura. Tu cuenta de PayPal debe estar verificada.
        </p>
      </div>

      <div className="form-group">
        <label>Email de PayPal *</label>
        <input
          type="email"
          value={paymentData.email_paypal || ''}
          onChange={(e) => handleChange('email_paypal', e.target.value)}
          placeholder="tu@email.com"
          className={errors.email_paypal ? 'error' : ''}
        />
        {errors.email_paypal && (
          <div className="form-error">{errors.email_paypal}</div>
        )}
      </div>
    </div>
  );
};

export default DigitalWalletForm;
