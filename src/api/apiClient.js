import axios from "axios";
import { getToken } from "../utils/storage";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // 🔧 cambia al dominio o puerto de tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: agrega token si existe
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
