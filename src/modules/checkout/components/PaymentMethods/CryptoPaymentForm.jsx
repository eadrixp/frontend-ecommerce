import React from 'react';

const CryptoPaymentForm = ({ 
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
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-md)',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Se te mostrará una dirección Bitcoin para enviar el pago. La transacción se confirmará en la blockchain.
        </p>
      </div>

      <div className="form-group">
        <label>Dirección de Bitcoin (Wallet) *</label>
        <input
          type="text"
          value={paymentData.wallet_address || ''}
          onChange={(e) => handleChange('wallet_address', e.target.value)}
          placeholder="Ingresa tu dirección de Bitcoin (1A1z7agoat...)"
          className={errors.wallet_address ? 'error' : ''}
        />
        {errors.wallet_address && (
          <div className="form-error">{errors.wallet_address}</div>
        )}
      </div>

      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: 'rgba(255, 165, 2, 0.08)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '4px solid var(--warning-color)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          <strong>⚠️ Importante:</strong> Verifica que la dirección sea correcta antes de enviar. Las transacciones en blockchain son irreversibles.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-md)' }}>
          <strong>Confirmación:</strong> Tu pago se confirmará después de 1-3 confirmaciones en la red Bitcoin (aproximadamente 10-30 minutos).
        </p>
      </div>
    </div>
  );
};

export default CryptoPaymentForm;
