import apiClient from '../api/apiClient';

/**
 * Obtiene todos los métodos de pago disponibles
 * @returns {Array} Lista de métodos de pago activos
 */
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/metodos-pago');
    console.log('✅ Métodos de pago obtenidos:', response.data);
    
    // Filtrar solo los métodos activos
    const activePaymentMethods = response.data.data.filter(method => method.activo === true);
    
    return {
      success: true,
      data: activePaymentMethods
    };
  } catch (error) {
    console.error('❌ Error obteniendo métodos de pago:', error);
    if (error.response) {
      const serverMessage = error.response.data?.message;
      const msg = serverMessage || `Error del servidor: ${error.response.status}`;
      throw new Error(msg);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    }
    throw new Error(error.message || 'Error desconocido en la solicitud');
  }
};

/**
 * Valida los datos de pago según el método seleccionado
 * @param {string} paymentMethod - Tipo de método de pago
 * @param {Object} paymentData - Datos del método de pago
 * @returns {Object} Resultado de la validación
 */
export const validatePaymentData = (paymentMethod, paymentData) => {
  const errors = [];

  switch (paymentMethod) {
    case 'tarjeta_credito':
    case 'tarjeta_debito':
      if (!paymentData.numero_tarjeta) {
        errors.push('Número de tarjeta es requerido');
      } else if (!/^\d{15,16}$/.test(paymentData.numero_tarjeta.replace(/\s/g, ''))) {
        errors.push('Número de tarjeta inválido');
      }
      
      if (!paymentData.nombre_titular) {
        errors.push('Nombre del titular es requerido');
      }
      
      if (!paymentData.fecha_expiracion) {
        errors.push('Fecha de expiración es requerida');
      } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentData.fecha_expiracion)) {
        errors.push('Formato de fecha inválido (MM/AA)');
      }
      
      if (!paymentData.cvv) {
        errors.push('CVV es requerido');
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        errors.push('CVV inválido');
      }
      
      if (!paymentData.tipo_tarjeta) {
        errors.push('Tipo de tarjeta es requerido');
      }
      break;

    case 'paypal':
      if (!paymentData.email_paypal) {
        errors.push('Email de PayPal es requerido');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email_paypal)) {
        errors.push('Email de PayPal inválido');
      }
      break;

    case 'transferencia':
      if (!paymentData.banco_origen) {
        errors.push('Banco de origen es requerido');
      }
      if (!paymentData.numero_cuenta) {
        errors.push('Número de cuenta es requerido');
      }
      if (!paymentData.titular_cuenta) {
        errors.push('Titular de la cuenta es requerido');
      }
      break;

    case 'efectivo':
      if (!paymentData.entrega) {
        errors.push('Tipo de entrega es requerido');
      }
      break;

    default:
      errors.push('Método de pago no válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Determina el tipo de tarjeta basado en el número
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} Tipo de tarjeta (visa, mastercard, amex)
 */
export const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) {
    return 'visa';
  } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
    return 'mastercard';
  } else if (/^3[47]/.test(number)) {
    return 'amex';
  }
  
  return 'unknown';
};

/**
 * Formatea el número de tarjeta con espacios
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} Número formateado
 */
export const formatCardNumber = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  return number.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Formatea la fecha de expiración
 * @param {string} date - Fecha en formato MMAA
 * @returns {string} Fecha formateada MM/AA
 */
export const formatExpirationDate = (date) => {
  const cleanDate = date.replace(/\D/g, '');
  if (cleanDate.length >= 2) {
    return cleanDate.substring(0, 2) + '/' + cleanDate.substring(2, 4);
  }
  return cleanDate;
};