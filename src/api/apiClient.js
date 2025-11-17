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
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('🔧 Interceptor - No Authorization header set (no token)');
  }
  return config;
});

export default apiClient;
export { apiClient };
