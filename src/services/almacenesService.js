import apiClient from "../api/apiClient";

export const obtenerAlmacenes = async () => {
  const response = await apiClient.get("/almacenes");
  return response.data?.data;
};

export const obtenerAlmacenPorId = async (id) => {
  const response = await apiClient.get(`/almacenes/${id}`);
  return response.data?.data;
};

export const crearAlmacen = async (almacen) => {
  const response = await apiClient.post("/almacenes", almacen);
  return response.data?.data;
};

export const actualizarAlmacen = async (id, almacen) => {
  const response = await apiClient.put(`/almacenes/${id}`, almacen);
  return response.data?.data;
};

export const eliminarAlmacen = async (id, hard = false) => {
  const response = await apiClient.delete(`/almacenes/${id}?hard=${hard}`);
  return response.data?.data;
};
