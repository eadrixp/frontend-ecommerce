import axios from "axios";
import { getToken } from "../utils/storage";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 🔧 cambia al dominio o puerto de tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: agrega token si existe
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  console.log('🔧 Interceptor - Token check:', token ? 'Token found' : 'No token');
  console.log('🔧 Interceptor - URL:', config.url);
  console.log('🔧 Interceptor - Method:', config.method);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔧 Interceptor - Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
  } else {
    console.log('🔧 Interceptor - No Authorization header set (no token)');
  }
  
  console.log('🔧 Interceptor - Final headers:', config.headers);
  return config;
});

export default apiClient;
export { apiClient };
