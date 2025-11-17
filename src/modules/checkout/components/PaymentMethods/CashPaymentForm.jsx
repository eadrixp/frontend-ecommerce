import React from 'react';

const CashPaymentForm = ({ 
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
        backgroundColor: 'rgba(46, 213, 115, 0.08)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '4px solid var(--success-color)'
      }}>
        <h4 style={{
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-md)',
          fontWeight: 'var(--font-weight-semibold)'
        }}>
          Pago Contra Entrega
        </h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Pagarás en el momento que recibas tu pedido. El transportista aceptará efectivo o transferencia.
        </p>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <h5 style={{
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 'var(--font-weight-semibold)'
          }}>
            Detalles de entrega
          </h5>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
            <li>Envío: Normal (3-5 días hábiles)</li>
            <li>Costo de envío: Incluido en el total</li>
            <li>El transportista te contactará para confirmar</li>
            <li>Documento de identidad requerido al recibir</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '4px solid var(--warning-color)'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <strong>Nota:</strong> Asegúrate de estar disponible en la fecha de entrega. Si no puedes recibir, el transportista hará un segundo intento.
          </p>
        </div>
      </div>

      <div className="form-group">
        <label>Tipo de entrega *</label>
        <select
          value={paymentData.entrega || ''}
          onChange={(e) => handleChange('entrega', e.target.value)}
          className={errors.entrega ? 'error' : ''}
        >
          <option value="">Selecciona tipo de entrega</option>
          <option value="contra_entrega">Contra Entrega</option>
        </select>
        {errors.entrega && (
          <div className="form-error">{errors.entrega}</div>
        )}
      </div>
    </div>
  );
};

export default CashPaymentForm;
