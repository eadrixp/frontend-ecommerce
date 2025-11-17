import React from 'react';
import SelectionList from '../shared/SelectionList';

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
        padding: '1rem', 
        textAlign: 'center',
        color: '#6b7280'
      }}>
        Cargando métodos de pago...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#ffe0e0',
        border: '1px solid #dc2626',
        borderRadius: '8px',
        color: '#dc2626',
        fontSize: '0.875rem'
      }}>
        {error}
      </div>
    );
  }

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.75rem",
    fontWeight: "500",
    color: "#374151",
    fontSize: "0.875rem"
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Métodos guardados */}
      {clientPaymentMethods.length > 0 && (
        <div>
          <h4 style={{
            marginBottom: '1rem',
            color: '#1f2937',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Métodos guardados
          </h4>
          <SelectionList
            items={clientPaymentMethods}
            selectedId={selectedPaymentMethod?.savedMethodData?.id_metodo_pago_cliente}
            onSelectItem={(id, item) => {
              onSelectSavedMethod(item);
            }}
            getItemContent={(savedMethod) => ({
              primary: savedMethod.alias,
              secondary: `${savedMethod.metodoPago.nombre_metodo} ****${savedMethod.numero_tarjeta_ultimos_4}`,
              badge: savedMethod.verificado ? { status: 'verified' } : { status: 'unverified' }
            })}
            renderBadge={(badge) => (
              badge.status === 'verified' ? (
                <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '500', marginLeft: '0.5rem' }}>
                  ✓ Verificado
                </span>
              ) : (
                <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: '500', marginLeft: '0.5rem' }}>
                  ⚠ No verificado
                </span>
              )
            )}
            formGroupStyle={formGroupStyle}
            labelStyle={labelStyle}
            emptyMessage="No tienes métodos de pago guardados."
          />
        </div>
      )}

      {/* Métodos disponibles */}
      <div>
        <h4 style={{
          marginBottom: '1rem',
          color: '#1f2937',
          fontSize: '0.875rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {clientPaymentMethods.length > 0 ? 'Nuevo método de pago' : 'Métodos de pago disponibles'}
        </h4>
        <SelectionList
          items={paymentMethods}
          selectedId={selectedPaymentMethod?.id_metodo_pago}
          onSelectItem={(id, item) => {
            onSelectMethod(item);
          }}
          getItemContent={(method) => ({
            primary: method.nombre_metodo,
            secondary: method.tipo_metodo.replace(/_/g, ' '),
            icon: method.icono_url
          })}
          renderBadge={() => null}
          formGroupStyle={formGroupStyle}
          labelStyle={labelStyle}
          emptyMessage={clientPaymentMethods.length > 0 ? "No hay nuevos métodos disponibles." : "No hay métodos de pago disponibles."}
        />
      </div>
    </div>
  );
};

export default PaymentMethodsList;
