import apiClient from "./apiClient";
import { saveToken, removeToken } from "../utils/storage";

// Login de usuario
export const login = async (correo_electronico, contrasena) => {
  const { data } = await apiClient.post("/auth/login", {
    correo_electronico,
    contrasena,
  });
  const { token } = data.data; // tu backend devuelve { success, data: {..., token} }
  if (token) saveToken(token);
  return data.data;
};

// Registro (opcional)
export const register = async (userData) => {
  const { data } = await apiClient.post("/auth/register", userData);
  const { token } = data.data;
  if (token) saveToken(token);
  return data.data;
};

// Perfil del usuario autenticado
export const getProfile = async () => {
  const { data } = await apiClient.get("/auth/profile");
  return data.data;
};

// Logout
export const logout = () => {
  removeToken();
};
