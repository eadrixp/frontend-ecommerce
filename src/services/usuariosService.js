import apiClient from "../api/apiClient";

export const getUsuarios = async () => {
  const response = await apiClient.get("/usuarios");
  return response.data.data;
};

export const getUsuarioById = async (id) => {
  const response = await apiClient.get(`/usuarios/${id}`);
  return response.data.data;
};

export const createUsuario = async (usuarioData) => {
  const response = await apiClient.post("/auth/register", usuarioData);
  return response.data.data;
};

export const updateUsuario = async (id, usuarioData) => {
  const response = await apiClient.put(`/usuarios/${id}`, usuarioData);
  return response.data.data;
};

export const deleteUsuario = async (id) => {
  const response = await apiClient.delete(`/usuarios/${id}`);
  return response.data;
};
