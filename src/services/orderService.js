import apiClient from '../api/apiClient';

/**
 * Agrega un producto al carrito
 * @param {Object} cartItem - Item del carrito {id_producto, cantidad}
 * @returns {Object} Item del carrito creado
 */
export const addToCart = async (cartItem) => {
  try {
    console.log(' Agregando al carrito:', cartItem);
    const response = await apiClient.post('/carrito', cartItem);
    return response.data;
  } catch (error) {
    console.error('Error agregando al carrito:', error);
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
 * Obtiene el carrito del cliente logueado
 * @returns {Object} Datos del carrito con productosCarrito array
 */
export const getCart = async () => {
  try {
    const response = await apiClient.get('/carrito');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
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
 * Actualiza la cantidad de un item en el carrito
 * @param {number} cartItemId - ID del item en el carrito (id_carrito_producto)
 * @param {number} cantidad - Nueva cantidad
 * @returns {Object} Item actualizado
 */
export const updateCartItem = async (cartItemId, cantidad) => {
  try {
    console.log('📊 [API] updateCartItem - ID Carrito Producto:', cartItemId, 'Cantidad:', cantidad);
    console.log('📊 [API] Enviando PATCH a: /carrito-productos/' + cartItemId + '/cantidad');
    console.log('📊 [API] Payload:', { cantidad });
    
    const response = await apiClient.patch(`/carrito-productos/${cartItemId}/cantidad`, { cantidad });
    
    console.log('✅ [API] Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API] Error actualizando item del carrito:', error);
    console.error('❌ [API] Error status:', error.response?.status);
    console.error('❌ [API] Error data:', error.response?.data);
    console.error('❌ [API] Error message:', error.message);
    
    if (error.response) {
      const serverMessage = error.response.data?.message;
      const msg = serverMessage || `Error del servidor: ${error.response.status}`;
      console.error('❌ [API] Mensaje del servidor:', msg);
      throw new Error(msg);
    } else if (error.request) {
      console.error('❌ [API] No se recibió respuesta del servidor');
      throw new Error('No se recibió respuesta del servidor');
    }
    throw new Error(error.message || 'Error desconocido en la solicitud');
  }
};

/**
 * Vacía el carrito completo
 * @returns {Object} Respuesta del servidor
 */
export const clearCart = async () => {
  try {
    console.log('🗑️ Vaciando carrito...');
    const response = await apiClient.delete('/carrito/clear');
    return response.data;
  } catch (error) {
    console.error('Error vaciando carrito:', error);
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
 * Obtiene el resumen del carrito
 * @param {number} cartId - ID del carrito
 * @returns {Object} Resumen del carrito
 */
export const getCartSummary = async (cartId) => {
  try {
    const response = await apiClient.get(`/carrito-productos/${cartId}/resumen`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo resumen del carrito:', error);
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
 * Elimina un item del carrito
 * @param {number} productoId - ID del producto a eliminar (id_producto)
 * @returns {Object} Respuesta del servidor
 */
export const removeFromCart = async (productoId) => {
  try {
    console.log('🗑️ [API] Eliminando producto del carrito - ID:', productoId);
    console.log('🗑️ [API] Enviando DELETE a: /carrito/' + productoId);
    
    const response = await apiClient.delete(`/carrito/${productoId}`);
    
    console.log('✅ [API] Respuesta de eliminación:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API] Error eliminando del carrito:', error);
    console.error('❌ [API] Error status:', error.response?.status);
    console.error('❌ [API] Error data:', error.response?.data);
    
    if (error.response) {
      const serverMessage = error.response.data?.message;
      const msg = serverMessage || `Error del servidor: ${error.response.status}`;
      console.error('❌ [API] Mensaje del servidor:', msg);
      throw new Error(msg);
    } else if (error.request) {
      console.error('❌ [API] No se recibió respuesta del servidor');
      throw new Error('No se recibió respuesta del servidor');
    }
    throw new Error(error.message || 'Error desconocido en la solicitud');
  }
};

/**
 * Crea una nueva orden
 * @param {Object} orderData - Datos de la orden {id_direccion_envio, notas_orden}
 * @returns {Object} Orden creada
 */
export const createOrder = async (orderData) => {
  try {
    console.log('📦 Creando orden:', orderData);
    const response = await apiClient.post('/ordenes', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creando orden:', error);
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
 * Procesa un pago para una orden
 * @param {number} orderId - ID de la orden
 * @param {Object} paymentData - Datos del pago
 * @returns {Object} Pago procesado
 */
export const processPayment = async (orderId, paymentData) => {
  try {
    console.log('💳 Procesando pago para orden:', orderId, paymentData);
    const response = await apiClient.post(`/ordenes/${orderId}/pagos`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error procesando pago:', error);
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
 * Obtiene las órdenes del cliente logueado
 * @returns {Array} Lista de órdenes
 */
export const getOrders = async () => {
  try {
    const response = await apiClient.get('/ordenes');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
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
 * Obtiene los detalles de una orden específica
 * @param {number} orderId - ID de la orden
 * @returns {Object} Detalles de la orden
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/ordenes/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo detalles de la orden:', error);
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