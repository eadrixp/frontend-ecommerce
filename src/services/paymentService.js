import apiClient from '../api/apiClient';

/**
 * Obtiene todos los métodos de pago disponibles
 * @returns {Array} Lista de métodos de pago activos
 */
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/metodos-pago/online');
    
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
      } else {
        // Eliminar espacios y validar que sea exactamente 16 dígitos
        const cardDigits = paymentData.numero_tarjeta.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardDigits)) {
          errors.push('Número de tarjeta debe tener 16 dígitos');
        }
      }
      
      if (!paymentData.nombre_titular) {
        errors.push('Nombre del titular es requerido');
      }
      
      if (!paymentData.fecha_expiracion) {
        errors.push('Fecha de expiración es requerida');
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.fecha_expiracion)) {
        errors.push('Formato de fecha inválido (MM/YY)');
      } else {
        // Validar que la fecha no esté expirada
        const [month, year] = paymentData.fecha_expiracion.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          errors.push('La tarjeta ha expirado');
        }
      }
      
      if (!paymentData.cvv) {
        errors.push('CVV es requerido');
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        errors.push('CVV debe tener 3 o 4 dígitos');
      }
      break;

    case 'billetera_digital': // PayPal
      // Buscar en email_billetera (nuevo) o email_paypal (compatibilidad)
      const emailField = paymentData.email_billetera || paymentData.email_paypal;
      if (!emailField) {
        errors.push('Email de PayPal es requerido');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
        errors.push('Email de PayPal inválido');
      }
      break;

    case 'transferencia_bancaria':
      // Buscar en identificador_externo (nuevo) o numero_transaccion (compatibilidad)
      const transactionField = paymentData.identificador_externo || paymentData.numero_transaccion;
      if (!transactionField) {
        errors.push('Número de transacción es requerido');
      }
      break;

    case 'efectivo':
      // Buscar en identificador_externo (nuevo) o entrega (compatibilidad)
      const deliveryField = paymentData.identificador_externo || paymentData.entrega;
      if (!deliveryField) {
        errors.push('Tipo de entrega es requerido');
      }
      break;

    case 'criptomoneda': // Bitcoin
      // Buscar en identificador_externo (nuevo) o wallet_address (compatibilidad)
      const walletField = paymentData.identificador_externo || paymentData.wallet_address;
      if (!walletField) {
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
    console.log('saveClientPaymentMethod - Datos enviados:', JSON.stringify(paymentMethodData, null, 2));
    const response = await apiClient.post('/metodos-pago-cliente', paymentMethodData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(' Error guardando método de pago:', error);
    console.error('Error response data:', error.response?.data);
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

/**
 * Construye el payload correcto para tarjeta de crédito/débito
 * Según especificaciones del backend:
 * - NO enviar número completo ni CVV
 * - Enviar solo últimos 4 dígitos
 * - Convertir fecha de MM/YY a YYYY-MM-DD
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Payload normalizado para el backend
 */
export const buildCreditCardPayload = (formData) => {
  // 1. Extraer últimos 4 dígitos del número de tarjeta
  const numeroLimpio = formData.numero_tarjeta.replace(/\s/g, '');
  const ultimosCuatro = numeroLimpio.slice(-4);
  
  // 2. Convertir fecha de MM/YY a YYYY-MM-DD
  const [mes, anio] = formData.fecha_expiracion.split('/');
  const anioCompleto = `20${anio}`;
  const fechaISO = `${anioCompleto}-${mes}-01`;
  
  // 3. Construir payload sin CVV ni número completo
  return {
    id_metodo_pago: formData.id_metodo_pago,
    alias: formData.alias,
    numero_tarjeta_ultimos_4: ultimosCuatro,
    nombre_titular: formData.nombre_titular,
    fecha_expiracion: fechaISO,
    tipo_tarjeta: formData.tipo_tarjeta || 'unknown',
    banco: formData.banco || '',
    es_predeterminado: formData.es_predeterminado || false
  };
};

/**
 * Construye el payload correcto para billetera digital (PayPal)
 * Según especificaciones del backend:
 * - Renombrar email_paypal → email_billetera
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Payload normalizado para el backend
 */
export const buildDigitalWalletPayload = (formData) => {
  return {
    id_metodo_pago: formData.id_metodo_pago,
    alias: formData.alias,
    email_billetera: formData.email_billetera,
    es_predeterminado: formData.es_predeterminado || false
  };
};

/**
 * Construye el payload correcto para transferencia bancaria
 * Según especificaciones del backend:
 * - numero_transaccion → identificador_externo
 * - banco_origen → banco
 * - titular_cuenta → nombre_titular
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Payload normalizado para el backend
 */
export const buildBankTransferPayload = (formData) => {
  return {
    id_metodo_pago: formData.id_metodo_pago,
    alias: formData.alias,
    identificador_externo: formData.identificador_externo,
    banco: formData.banco || '',
    numero_cuenta: formData.numero_cuenta || '',
    nombre_titular: formData.nombre_titular || '',
    es_predeterminado: formData.es_predeterminado || false
  };
};

/**
 * Construye el payload correcto para criptomoneda (Bitcoin)
 * Según especificaciones del backend:
 * - wallet_address → identificador_externo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Payload normalizado para el backend
 */
export const buildCryptoPayload = (formData) => {
  return {
    id_metodo_pago: formData.id_metodo_pago,
    alias: formData.alias,
    identificador_externo: formData.identificador_externo,
    es_predeterminado: formData.es_predeterminado || false
  };
};

/**
 * Construye el payload correcto para efectivo (contra entrega)
 * Según especificaciones del backend:
 * - entrega → identificador_externo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Payload normalizado para el backend
 */
export const buildCashPayload = (formData) => {
  return {
    id_metodo_pago: formData.id_metodo_pago,
    alias: formData.alias,
    identificador_externo: formData.identificador_externo || 'contra_entrega',
    es_predeterminado: formData.es_predeterminado || false
  };
};

/**
 * Construye el payload correcto basado en el tipo de método de pago
 * @param {Object} formData - Datos del formulario
 * @param {string} paymentMethod - Tipo de método de pago (tipo_metodo de la API)
 * @returns {Object} Payload normalizado para el backend
 */
export const buildPaymentMethodPayload = (formData, paymentMethod) => {
  switch (paymentMethod) {
    case 'tarjeta_credito':
    case 'tarjeta_debito':
      return buildCreditCardPayload(formData);
    
    case 'billetera_digital':
      return buildDigitalWalletPayload(formData);
    
    case 'transferencia_bancaria':
      return buildBankTransferPayload(formData);
    
    case 'criptomoneda':
      return buildCryptoPayload(formData);
    
    case 'efectivo':
      return buildCashPayload(formData);
    
    default:
      return formData;
  }
};