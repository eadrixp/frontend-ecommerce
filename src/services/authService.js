import { apiClient } from '../api/apiClient';

// Servicio de autenticación para administradores
export const login = async (correo_electronico, contrasena) => {
  try {
    const response = await apiClient.post('/auth/login', {
      correo_electronico,
      contrasena
    });
    
    console.log('📥 Respuesta del servidor (admin login):', response.data);
    
    // Extraer datos de la respuesta del backend
    const { data } = response.data;
    
    // Retornar estructura que espera useAuth
    return {
      token: data.token,
      user: data, // Incluye todo el objeto user con permisos
      ...data // Mantener compatibilidad
    };
  } catch (error) {
    console.error('Error en login:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error de conexión al servidor');
  }
};

export const register = async (userData) => {
  try {
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
    console.error('Error en registro:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error de conexión al servidor');
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await apiClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    throw new Error('Error verificando usuario');
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await apiClient.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verificando token:', error);
    return null;
  }
};