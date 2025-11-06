import apiClient from "../api/apiClient";

export const getDirecciones = async () => {
  const { data } = await apiClient.get("/direcciones");
  return data.data; // según tu estructura backend
};

export const createDireccion = async (direccion) => {
  const { data } = await apiClient.post("/direcciones", direccion);
  return data.data;
};

export const updateDireccion = async (id, direccion) => {
  const { data } = await apiClient.put(`/direcciones/${id}`, direccion);
  return data.data;
};

export const deleteDireccion = async (id) => {
  const { data } = await apiClient.delete(`/direcciones/${id}`);
  return data.data;
};
