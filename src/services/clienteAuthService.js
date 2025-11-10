import { apiClient } from '../api/apiClient';

/**
 * Registra un nuevo cliente
 * @param {string} nombre_usuario - Nombre del usuario
 * @param {string} correo_electronico - Email del cliente
 * @param {string} contrasena - Contraseña del cliente
 * @returns {Object} Datos del usuario registrado
 */
export const registerCliente = async (nombre_usuario, correo_electronico, contrasena) => {
  try {
    const userData = {
      nombre_usuario,
      correo_electronico,
      contrasena,
      nombre_rol: "cliente" // Siempre será cliente
    };
    
    console.log('📤 Enviando datos de registro:', userData);
    const response = await apiClient.post('/auth/register', userData);
    
    // Extraer datos de la respuesta del backend
    const { data } = response.data;
    
    // Retornar estructura que espera useAuth
    return {
      token: data.token,
      user: data, // Incluye todo el objeto user con permisos
      ...data // Mantener compatibilidad
    };
  } catch (error) {
    console.error('Error en registro de cliente:', error);
    // Mejor manejo de errores: priorizar mensaje del servidor, incluir status/data si está disponible
    if (error.response) {
      const serverMessage = error.response.data?.message;
      const msg = serverMessage || `Error del servidor: ${error.response.status}`;
      throw new Error(msg);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    }
    // Errores de configuración o inesperados
    throw new Error(error.message || 'Error desconocido en la solicitud');
  }
};

/**
 * Login de cliente
 * @param {string} correo_electronico - Email del cliente
 * @param {string} contrasena - Contraseña del cliente
 * @returns {Object} Datos del usuario logueado
 */
export const loginCliente = async (correo_electronico, contrasena) => {
  try {
    const response = await apiClient.post('/auth/login', {
      correo_electronico,
      contrasena
    });
    
    console.log('📥 Respuesta del servidor (login):', response.data);
    
    // Extraer datos de la respuesta del backend
    const { data } = response.data;
    
    // Retornar estructura que espera useAuth
    return {
      token: data.token,
      user: data, // Incluye todo el objeto user con permisos
      ...data // Mantener compatibilidad
    };
  } catch (error) {
    console.error('Error en login de cliente:', error);
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
 * Crea el perfil de cliente para un usuario ya autenticado
 * @param {Object} clienteData - Datos del cliente (id_usuario, nombre, apellido, telefono)
 * @returns {Object} Datos del perfil creado
 */
export const createClienteProfile = async (clienteData) => {
  try {
    console.log('📤 Enviando datos para crear perfil de cliente:', clienteData);
    const response = await apiClient.post('/clientes', clienteData);
    
    console.log('📥 Respuesta del servidor (crear perfil):', response.data);
    
    // Si la respuesta tiene la estructura {success, data}, extraer data
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    // Si no, asumir que response.data ya contiene los datos del perfil
    return response.data;
  } catch (error) {
    console.error('Error creando perfil de cliente:', error);
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
 * Obtiene el perfil del cliente logueado
 * @returns {Object} Datos del perfil del cliente
 */
export const getClienteProfile = async () => {
  try {
    const response = await apiClient.get('/clientes/perfil');
    
    // Si la respuesta tiene la estructura {success, data}, extraer data
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    // Si no, asumir que response.data ya contiene los datos del perfil
    return response.data;
  } catch (error) {
    console.error('Error obteniendo perfil de cliente:', error);
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
 * Verifica si un usuario es cliente
 * @param {Object} userData - Datos del usuario
 * @returns {boolean} True si es cliente
 */
export const isCliente = (userData) => {
  return userData?.nombre_rol === "cliente";
};

/**
 * Verifica si un usuario es administrador
 * @param {Object} userData - Datos del usuario
 * @returns {boolean} True si es administrador
 */
export const isAdmin = (userData) => {
  return userData?.nombre_rol === "administrador";
};