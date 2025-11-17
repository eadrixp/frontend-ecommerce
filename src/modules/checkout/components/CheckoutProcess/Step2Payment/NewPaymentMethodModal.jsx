import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { 
  getPaymentMethods,
  saveClientPaymentMethod,
  validatePaymentData
} from '../../../../../services/paymentService';
import PaymentMethodForm from '../../PaymentMethods/PaymentMethodForm';

/**
 * Modal para crear un nuevo método de pago
 * Muestra la lista de métodos disponibles y el formulario para cada uno
 */
const NewPaymentMethodModal = ({
  isOpen,
  onClose,
  onPaymentMethodSelect,
  paymentData,
  onPaymentDataChange,
  errors,
  setErrors
}) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [alias, setAlias] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPaymentMethods();
    }
  }, [isOpen]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getPaymentMethods();
      
      if (result.success) {
        setPaymentMethods(result.data || []);
      } else {
        setError('Error al cargar los métodos de pago');
      }
    } catch (err) {
      console.error('Error cargando métodos:', err);
      setError('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    onPaymentDataChange({});
    setErrors({});
    setAlias('');
    setIsDefault(false);
  };

  const handleSavePaymentMethod = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Validar alias
      if (!alias.trim()) {
        setError('El alias del método es requerido');
        setSaving(false);
        return;
      }

      // Validar datos del método de pago
      const validation = validatePaymentData(selectedMethod.tipo_metodo, paymentData);
      if (!validation.isValid) {
        const errorMessages = validation.errors.join(', ');
        setError(`Datos inválidos: ${errorMessages}`);
        setSaving(false);
        return;
      }

      // Construir el payload del método de pago con campos originales
      // El backend normaliza automáticamente los nombres de campos
      // Solo incluir campos relevantes para el tipo de método
      const basePayload = {
        id_metodo_pago: selectedMethod.id_metodo_pago,
        alias: alias.trim(),
        es_predeterminado: isDefault,
      };

      let payload = { ...basePayload };

      // Agregar campos específicos según el tipo de método
      switch (selectedMethod.tipo_metodo) {
        case 'tarjeta_credito':
        case 'tarjeta_debito':
          // Convertir fecha de MM/YY a DD-MM-YYYY (primer día del mes)
          let fechaFormato = paymentData.fecha_expiracion || '';
          if (fechaFormato && fechaFormato.includes('/')) {
            const [mes, anio] = fechaFormato.split('/');
            fechaFormato = `01-${mes}-20${anio}`;
          }

          // Extraer solo los últimos 4 dígitos de la tarjeta
          const numeroTarjeta = (paymentData.numero_tarjeta || '').replace(/\s/g, '');
          const ultimosCuatro = numeroTarjeta.slice(-4);

          payload = {
            ...payload,
            numero_tarjeta: ultimosCuatro,
            nombre_titular: paymentData.nombre_titular || '',
            fecha_expiracion: fechaFormato,
            tipo_tarjeta: paymentData.tipo_tarjeta || '',
          };

          // Solo agregar banco si tiene valor
          if (paymentData.banco && paymentData.banco.trim()) {
            payload.banco = paymentData.banco;
          }
          break;

        case 'billetera_digital':
          payload = {
            ...payload,
            email_paypal: paymentData.email_paypal || '',
          };
          break;

        case 'transferencia_bancaria':
          payload = {
            ...payload,
            numero_transaccion: paymentData.numero_transaccion || '',
            banco_origen: paymentData.banco_origen || '',
            numero_cuenta: paymentData.numero_cuenta || '',
            titular_cuenta: paymentData.titular_cuenta || '',
          };
          break;

        case 'criptomoneda':
          payload = {
            ...payload,
            wallet_address: paymentData.wallet_address || '',
          };
          break;

        case 'efectivo':
          payload = {
            ...payload,
            entrega: paymentData.entrega || 'contra_entrega',
          };
          break;

        default:
          // Si es un tipo desconocido, solo enviar base
          payload = basePayload;
      }

      console.log('Payload enviado al backend:', JSON.stringify(payload, null, 2));
      console.log('Tipo de método:', selectedMethod.tipo_metodo);

      // Guardar el método de pago
      const response = await saveClientPaymentMethod(payload);

      if (response.success) {
        // El método se guardó exitosamente, seleccionarlo
        const savedMethodWithType = {
          ...response.data,
          metodoPago: selectedMethod,
          isSaved: true
        };
        
        onPaymentMethodSelect(savedMethodWithType);
        handleClose();
      } else {
        setError('Error al guardar el método de pago');
      }
    } catch (err) {
      console.error('Error guardando método de pago:', err);
      setError(err.message || 'Error al guardar el método de pago');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setAlias('');
    setIsDefault(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
            }}
          >
            Agregar Nuevo Método de Pago
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FiX size={24} color="#6b7280" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#6b7280',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                marginRight: '1rem',
              }}
            >
              ⏳
            </div>
            Cargando métodos de pago...
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            {/* Métodos disponibles */}
            <div>
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Métodos Disponibles
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {paymentMethods && paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <button
                      key={method.id_metodo_pago}
                      onClick={() => handleMethodSelect(method)}
                      style={{
                        padding: '1rem',
                        border:
                          selectedMethod?.id_metodo_pago === method.id_metodo_pago
                            ? '2px solid #2563eb'
                            : '1px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor:
                          selectedMethod?.id_metodo_pago === method.id_metodo_pago
                            ? '#f0f9ff'
                            : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMethod?.id_metodo_pago !== method.id_metodo_pago) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.borderColor = '#bfdbfe';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMethod?.id_metodo_pago !== method.id_metodo_pago) {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {method.nombre_metodo}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                        }}
                      >
                        {method.tipo_metodo.replace(/_/g, ' ')}
                      </div>
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    No hay métodos disponibles
                  </div>
                )}
              </div>
            </div>

            {/* Formulario */}
            <div>
              {selectedMethod ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                  }}
                >
                  {/* Campos del método de pago */}
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Detalles del Pago
                    </h3>
                    <PaymentMethodForm
                      selectedPaymentMethod={selectedMethod}
                      paymentData={paymentData}
                      onPaymentDataChange={onPaymentDataChange}
                      errors={errors}
                    />
                  </div>

                  {/* Alias y opciones */}
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div className="form-group">
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '0.875rem',
                        }}
                      >
                        Nombre del método (alias) *
                      </label>
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="Ej: Mi Visa Principal"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '1rem',
                      }}
                    >
                      <input
                        type="checkbox"
                        id="default-method"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        style={{
                          cursor: 'pointer',
                        }}
                      />
                      <label
                        htmlFor="default-method"
                        style={{
                          cursor: 'pointer',
                          color: '#4b5563',
                          fontSize: '0.875rem',
                        }}
                      >
                        Usar como método predeterminado
                      </label>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      onClick={handleClose}
                      disabled={saving}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#1f2937',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSavePaymentMethod}
                      disabled={saving || !selectedMethod || !alias.trim()}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: saving || !selectedMethod || !alias.trim() ? 'not-allowed' : 'pointer',
                        opacity: saving || !selectedMethod || !alias.trim() ? 0.6 : 1,
                      }}
                    >
                      {saving ? 'Guardando...' : 'Guardar Método'}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '2rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px dashed #d1d5db',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  Selecciona un método de pago para ver el formulario
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NewPaymentMethodModal;
