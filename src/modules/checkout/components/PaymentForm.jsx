import React, { useState, useEffect } from 'react';
import { getPaymentMethods, getClientPaymentMethods, saveClientPaymentMethod, validatePaymentData } from '../../../services/paymentService';
import './PaymentForm.css';

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
  const [saveMethod, setSaveMethod] = useState(false);

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
    onPaymentMethodChange({ ...savedMethod.metodoPago, isSaved: true, savedMethodData: savedMethod });
    
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

  const handleInputChange = (field, value) => {
    onPaymentDataChange(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderPaymentFields = () => {
    if (!selectedPaymentMethod) return null;

    const isCardPayment = selectedPaymentMethod.tipo_metodo === 'tarjeta_credito' || 
                         selectedPaymentMethod.tipo_metodo === 'tarjeta_debito';
    const isTransfer = selectedPaymentMethod.tipo_metodo === 'transferencia_bancaria';
    const isSaved = selectedPaymentMethod.isSaved;

    if (isCardPayment) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '20px' }}>
          <h4 style={{ marginBottom: '20px' }}>Información de la tarjeta</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Número de tarjeta *</label>
            <input
              type="text"
              value={paymentData.numero_tarjeta || ''}
              onChange={(e) => handleInputChange('numero_tarjeta', e.target.value)}
              placeholder="1234 5678 9012 3456"
              disabled={isSaved}
              style={{ 
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.numero_tarjeta ? '#ff4444' : '#ddd'}`,
                borderRadius: '4px',
                backgroundColor: isSaved ? '#f5f5f5' : '#fff'
              }}
            />
            {errors.numero_tarjeta && (
              <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.numero_tarjeta}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Fecha de expiración *</label>
              <input
                type="month"
                value={paymentData.fecha_expiracion || ''}
                onChange={(e) => handleInputChange('fecha_expiracion', e.target.value)}
                disabled={isSaved}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.fecha_expiracion ? '#ff4444' : '#ddd'}`,
                  borderRadius: '4px',
                  backgroundColor: isSaved ? '#f5f5f5' : '#fff'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>CVV *</label>
              <input
                type="text"
                value={paymentData.cvv || ''}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                style={{ 
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.cvv ? '#ff4444' : '#ddd'}`,
                  borderRadius: '4px'
                }}
                maxLength={4}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Nombre del titular *</label>
            <input
              type="text"
              value={paymentData.nombre_titular || ''}
              onChange={(e) => handleInputChange('nombre_titular', e.target.value)}
              placeholder="Como aparece en la tarjeta"
              disabled={isSaved}
              style={{ 
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.nombre_titular ? '#ff4444' : '#ddd'}`,
                borderRadius: '4px',
                backgroundColor: isSaved ? '#f5f5f5' : '#fff'
              }}
            />
          </div>

          {!isSaved && (
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={saveMethod}
                  onChange={(e) => setSaveMethod(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Guardar este método de pago para futuras compras
              </label>
            </div>
          )}
        </div>
      );
    }

    if (isTransfer) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '20px' }}>
          <h4>Información de la transferencia</h4>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Realiza tu transferencia y proporciona el número de transacción.
          </p>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Número de transacción *</label>
            <input
              type="text"
              value={paymentData.numero_transaccion || ''}
              onChange={(e) => handleInputChange('numero_transaccion', e.target.value)}
              placeholder="Número de transacción"
              style={{ 
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.numero_transaccion ? '#ff4444' : '#ddd'}`,
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando métodos de pago...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#ff4444', textAlign: 'center' }}>
        {error}
        <button onClick={loadData} style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="payment-form" style={{ maxWidth: '600px' }}>
      {/* Métodos de pago guardados */}
      {clientPaymentMethods.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Métodos guardados</h3>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            {clientPaymentMethods.map((savedMethod, index) => {
              const isSelected = selectedPaymentMethod && selectedPaymentMethod.isSaved && 
                               selectedPaymentMethod.savedMethodData?.id_metodo_pago_cliente === savedMethod.id_metodo_pago_cliente;
              
              return (
                <div 
                  key={savedMethod.id_metodo_pago_cliente}
                  onClick={() => handleSavedMethodSelect(savedMethod)}
                  style={{
                    padding: '15px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                    borderBottom: index < clientPaymentMethods.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="radio" 
                      checked={isSelected}
                      onChange={() => handleSavedMethodSelect(savedMethod)}
                      style={{ marginRight: '10px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{savedMethod.alias}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {savedMethod.metodoPago.nombre_metodo} ****{savedMethod.numero_tarjeta_ultimos_4}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    {savedMethod.verificado ? (
                      <span style={{ color: '#28a745' }}>✓ Verificado</span>
                    ) : (
                      <span style={{ color: '#ffc107' }}>⚠ No verificado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Métodos de pago disponibles */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>
          {clientPaymentMethods.length > 0 ? 'Nuevo método de pago' : 'Métodos de pago'}
        </h3>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          {paymentMethods.map((method, index) => {
            const isSelected = selectedPaymentMethod && !selectedPaymentMethod.isSaved && 
                             selectedPaymentMethod.id === method.id;
            
            return (
              <div 
                key={method.id} 
                onClick={() => handlePaymentMethodSelect(method)}
                style={{
                  padding: '15px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                  borderBottom: index < paymentMethods.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <input 
                  type="radio" 
                  checked={isSelected}
                  onChange={() => handlePaymentMethodSelect(method)}
                  style={{ marginRight: '10px' }}
                />
                <img 
                  src={method.icono_url} 
                  alt={method.nombre_metodo}
                  style={{ width: '24px', height: '24px', marginRight: '10px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>{method.nombre_metodo}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {method.tipo_metodo.replace('_', ' ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderPaymentFields()}
    </div>
  );
};

export default PaymentForm;