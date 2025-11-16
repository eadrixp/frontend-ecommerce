import React from 'react';

const PaymentMethodsList = ({ 
  paymentMethods = [],
  clientPaymentMethods = [],
  selectedPaymentMethod,
  onSelectMethod,
  onSelectSavedMethod,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div style={{ 
        padding: 'var(--spacing-xl)', 
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div className="loading-spinner" style={{ display: 'inline-block', marginRight: 'var(--spacing-md)' }}></div>
        Cargando métodos de pago...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: '#ffe0e0',
        border: '1px solid var(--danger-color)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--danger-color)',
        fontSize: 'var(--font-size-sm)'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
      {/* Métodos guardados */}
      {clientPaymentMethods.length > 0 && (
        <div>
          <h4 style={{
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Métodos guardados
          </h4>
          <div className="selection-list">
            {clientPaymentMethods.map((savedMethod) => {
              const isSelected = selectedPaymentMethod?.savedMethodData?.id_metodo_pago_cliente === savedMethod.id_metodo_pago_cliente;

              return (
                <div
                  key={savedMethod.id_metodo_pago_cliente}
                  className={`selection-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectSavedMethod(savedMethod)}
                >
                  <input
                    type="radio"
                    name="saved-payment-methods"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="selection-content">
                    <div className="selection-title">{savedMethod.alias}</div>
                    <div className="selection-description">
                      {savedMethod.metodoPago.nombre_metodo} ****{savedMethod.numero_tarjeta_ultimos_4}
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    {savedMethod.verificado ? (
                      <span style={{ color: 'var(--success-color)' }}>✓ Verificado</span>
                    ) : (
                      <span style={{ color: 'var(--warning-color)' }}>⚠ No verificado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Métodos disponibles */}
      <div>
        <h4 style={{
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {clientPaymentMethods.length > 0 ? 'Nuevo método de pago' : 'Métodos de pago disponibles'}
        </h4>
        <div className="selection-list">
          {paymentMethods.map((method) => {
            const isSelected = selectedPaymentMethod?.id === method.id && !selectedPaymentMethod?.isSaved;

            return (
              <div
                key={method.id}
                className={`selection-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectMethod(method)}
              >
                <input
                  type="radio"
                  name="available-payment-methods"
                  checked={isSelected}
                  onChange={() => {}}
                  style={{ cursor: 'pointer' }}
                />
                {method.icono_url && (
                  <img
                    src={method.icono_url}
                    alt={method.nombre_metodo}
                    style={{ width: '32px', height: '32px', marginRight: 'var(--spacing-md)' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="selection-content">
                  <div className="selection-title">{method.nombre_metodo}</div>
                  <div className="selection-description">
                    {method.tipo_metodo.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsList;
