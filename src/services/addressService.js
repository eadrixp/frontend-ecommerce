import apiClient from '../api/apiClient';

/**
 * Crea una nueva dirección para el cliente logueado
 * @param {Object} addressData - Datos de la dirección
 * @returns {Object} Dirección creada
 */
export const createAddress = async (addressData) => {
  try {
    console.log('📍 Creando dirección:', addressData);
    
    // Verificar token antes de hacer la petición
    const { getToken } = await import('../utils/storage');
    const token = getToken();
    console.log('🔑 Token actual:', token ? 'Token presente' : 'No token found');
    console.log('🔑 Token length:', token ? token.length : 0);
    console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'N/A');
    
    const response = await apiClient.post('/direcciones', addressData);
    console.log('✅ Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error completo creando dirección:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    if (error.response) {
      const serverMessage = error.response.data?.message;
      const msg = serverMessage || `Error del servidor: ${error.response.status}`;
      throw new Error(msg);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    }
    throw new Error(error.message || 'Error desconocido en la solicitud');
  }
};

/**
 * Obtiene todas las direcciones del cliente logueado
 * @returns {Array} Lista de direcciones
 */
export const getAddresses = async () => {
  try {
    const response = await apiClient.get('/direcciones');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo direcciones:', error);
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
 * Actualiza una dirección existente
 * @param {number} id - ID de la dirección
 * @param {Object} addressData - Datos actualizados
 * @returns {Object} Dirección actualizada
 */
export const updateAddress = async (id, addressData) => {
  try {
    const response = await apiClient.put(`/direcciones/${id}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando dirección:', error);
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
 * Elimina una dirección
 * @param {number} id - ID de la dirección
 * @returns {Object} Respuesta del servidor
 */
export const deleteAddress = async (id) => {
  try {
    const response = await apiClient.delete(`/direcciones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando dirección:', error);
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