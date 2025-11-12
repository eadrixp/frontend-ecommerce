import apiClient from "../api/apiClient";

// Obtener todos los clientes
export const getClientes = async () => {
  const { data } = await apiClient.get("/clientes");
  return data.data?.data || []; // ajustado a tu backend (data.data.data)
};

// Crear cliente
export const createCliente = async (cliente) => {
  const { data } = await apiClient.post("/clientes", cliente);
  return data;
};

// Actualizar cliente
export const updateCliente = async (id, cliente) => {
  const { data } = await apiClient.put(`/clientes/${id}`, cliente);
  return data;
};

// Eliminar cliente
export const deleteCliente = async (id) => {
  const { data } = await apiClient.delete(`/clientes/${id}`);
  return data;
};
