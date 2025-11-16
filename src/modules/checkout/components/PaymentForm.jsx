import React, { useState, useEffect } from 'react';
import { getPaymentMethods, getClientPaymentMethods } from '../../../services/paymentService';
import PaymentMethodsList from './PaymentMethods/PaymentMethodsList';
import PaymentMethodForm from './PaymentMethods/PaymentMethodForm';

const PaymentForm = ({ 
  selectedPaymentMethod, 
  onPaymentMethodChange, 
  paymentData, 
  onPaymentDataChange, 
  errors, 
  setErrors 
}) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [clientPaymentMethods, setClientPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [methodsResult, clientMethodsResult] = await Promise.all([
        getPaymentMethods(),
        getClientPaymentMethods()
      ]);

      if (methodsResult.success) {
        setPaymentMethods(methodsResult.data || []);
      }

      if (clientMethodsResult.success) {
        setClientPaymentMethods(clientMethodsResult.data || []);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los métodos de pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    onPaymentMethodChange(method);
    onPaymentDataChange({});
    setErrors({});
  };

  const handleSavedMethodSelect = (savedMethod) => {
    onPaymentMethodChange({ 
      ...savedMethod.metodoPago, 
      isSaved: true, 
      savedMethodData: savedMethod 
    });
    
    if (savedMethod.metodoPago.tipo_metodo === 'tarjeta_credito' || 
        savedMethod.metodoPago.tipo_metodo === 'tarjeta_debito') {
      onPaymentDataChange({
        numero_tarjeta: `****-****-****-${savedMethod.numero_tarjeta_ultimos_4}`,
        nombre_titular: savedMethod.nombre_titular || '',
        fecha_expiracion: savedMethod.fecha_expiracion || '',
        cvv: '',
        tipo_tarjeta: savedMethod.tipo_tarjeta || '',
        banco: savedMethod.banco || ''
      });
    }
    
    setErrors({});
  };

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

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--spacing-xl)'
    }}>
      {/* Columna izquierda - Lista de métodos de pago (siempre visible) */}
      <div>
        {error && (
          <div style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: '#ffe0e0',
            border: '1px solid var(--danger-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger-color)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            {error}
          </div>
        )}
        <PaymentMethodsList
          paymentMethods={paymentMethods}
          clientPaymentMethods={clientPaymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectMethod={handlePaymentMethodSelect}
          onSelectSavedMethod={handleSavedMethodSelect}
          loading={loading}
          error={error}
        />
      </div>

      {/* Columna derecha - Formulario del método de pago seleccionado */}
      <div>
        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            marginBottom: 'var(--spacing-xl)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            {selectedPaymentMethod?.nombre_metodo || 'Detalles del pago'}
          </h3>
          <PaymentMethodForm
            selectedPaymentMethod={selectedPaymentMethod}
            paymentData={paymentData}
            onPaymentDataChange={onPaymentDataChange}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
