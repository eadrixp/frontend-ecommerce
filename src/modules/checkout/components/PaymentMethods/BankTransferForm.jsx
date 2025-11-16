import React from 'react';

const BankTransferForm = ({ 
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
          Por favor realiza la transferencia bancaria a la siguiente cuenta:
        </p>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
          <div>Banco: [Nombre del Banco]</div>
          <div>Cuenta: 1234567890</div>
          <div>Titular: [Nombre de la empresa]</div>
          <div>Referencia: Tu número de orden aparecerá aquí</div>
        </div>
      </div>

      <div className="form-group">
        <label>Número de transacción *</label>
        <input
          type="text"
          value={paymentData.numero_transaccion || ''}
          onChange={(e) => handleChange('numero_transaccion', e.target.value)}
          placeholder="Ingresa el número de transacción de tu banco"
          className={errors.numero_transaccion ? 'error' : ''}
        />
        {errors.numero_transaccion && (
          <div className="form-error">{errors.numero_transaccion}</div>
        )}
      </div>
    </div>
  );
};

export default BankTransferForm;
