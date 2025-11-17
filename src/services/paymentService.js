import apiClient from '../api/apiClient';

/**
 * Obtiene todos los métodos de pago disponibles
 * @returns {Array} Lista de métodos de pago activos
 */
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/metodos-pago/online');
    console.log(' Métodos de pago obtenidos:', response.data);
    
    // Filtrar solo los métodos activos y disponibles online
    const activePaymentMethods = response.data.data.filter(method => 
      method.activo === true && method.disponible_online === true
    );
    
    // Ordenar por orden_visualizacion
    const sortedMethods = activePaymentMethods.sort((a, b) => a.orden_visualizacion - b.orden_visualizacion);
    
    return {
      success: true,
      data: sortedMethods
    };
  } catch (error) {
    console.error(' Error obteniendo métodos de pago:', error);
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
 * Obtiene un método de pago específico por ID
 * @param {number} paymentMethodId - ID del método de pago
 * @returns {Object} Método de pago específico
 */
export const getPaymentMethodById = async (paymentMethodId) => {
  try {
    const response = await apiClient.get(`/metodos-pago/${paymentMethodId}`);
    console.log(' Método de pago obtenido:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error obteniendo método de pago:', error);
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

    case 'billetera_digital': // PayPal
      if (!paymentData.email_paypal) {
        errors.push('Email de PayPal es requerido');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email_paypal)) {
        errors.push('Email de PayPal inválido');
      }
      break;

    case 'transferencia_bancaria':
      if (!paymentData.numero_transaccion) {
        errors.push('Número de transacción es requerido');
      }
      break;

    case 'efectivo':
      if (!paymentData.entrega) {
        errors.push('Tipo de entrega es requerido');
      }
      break;

    case 'criptomoneda': // Bitcoin
      if (!paymentData.wallet_address) {
        errors.push('Dirección de wallet es requerida');
      }
      break;

    // Mantener compatibilidad con nombres anteriores
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

    default:
      errors.push('Método de pago no válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obtiene los métodos de pago guardados del cliente
 * @returns {Array} Lista de métodos de pago del cliente
 */
export const getClientPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/metodos-pago-cliente');
    console.log(' Métodos de pago del cliente obtenidos:', response.data);
    
    // La respuesta puede ser un objeto o un array
    let clientMethods = response.data.data;
    
    // Si es un solo método, convertir a array
    if (!Array.isArray(clientMethods)) {
      clientMethods = clientMethods ? [clientMethods] : [];
    }
    
    return {
      success: true,
      data: clientMethods
    };
  } catch (error) {
    console.error(' Error obteniendo métodos de pago del cliente:', error);
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
 * Obtiene un método de pago específico del cliente por ID
 * @param {number} clientPaymentMethodId - ID del método de pago del cliente
 * @returns {Object} Método de pago del cliente
 */
export const getClientPaymentMethodById = async (clientPaymentMethodId) => {
  try {
    const response = await apiClient.get(`/metodos-pago-cliente/${clientPaymentMethodId}`);
    console.log(' Método de pago del cliente obtenido:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error obteniendo método de pago del cliente:', error);
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
 * Obtiene el método de pago predeterminado del cliente
 * @returns {Object} Método de pago predeterminado del cliente
 */
export const getDefaultClientPaymentMethod = async () => {
  try {
    const response = await apiClient.get('/metodos-pago-cliente/predeterminado');
    console.log(' Método de pago predeterminado obtenido:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error obteniendo método de pago predeterminado:', error);
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
 * Guarda un método de pago para el cliente
 * @param {Object} paymentMethodData - Datos del método de pago a guardar
 * @returns {Object} Método de pago guardado
 */
export const saveClientPaymentMethod = async (paymentMethodData) => {
  try {
    const response = await apiClient.post('/metodos-pago-cliente', paymentMethodData);
    console.log(' Método de pago guardado exitosamente:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error guardando método de pago:', error);
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
 * Actualiza un método de pago del cliente
 * @param {number} clientPaymentMethodId - ID del método de pago del cliente
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} Método de pago actualizado
 */
export const updateClientPaymentMethod = async (clientPaymentMethodId, updateData) => {
  try {
    const response = await apiClient.put(`/metodos-pago-cliente/${clientPaymentMethodId}`, updateData);
    console.log(' Método de pago actualizado exitosamente:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error actualizando método de pago:', error);
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
 * Marca un método de pago como predeterminado
 * @param {number} clientPaymentMethodId - ID del método de pago del cliente
 * @returns {Object} Resultado de la operación
 */
export const setDefaultClientPaymentMethod = async (clientPaymentMethodId) => {
  try {
    const response = await apiClient.patch(`/metodos-pago-cliente/${clientPaymentMethodId}/predeterminado`);
    console.log(' Método de pago marcado como predeterminado:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error marcando como predeterminado:', error);
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
 * Elimina un método de pago del cliente
 * @param {number} clientPaymentMethodId - ID del método de pago del cliente
 * @returns {Object} Resultado de la eliminación
 */
export const deleteClientPaymentMethod = async (clientPaymentMethodId) => {
  try {
    const response = await apiClient.delete(`/metodos-pago-cliente/${clientPaymentMethodId}`);
    console.log(' Método de pago eliminado exitosamente:', response.data);
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error eliminando método de pago:', error);
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