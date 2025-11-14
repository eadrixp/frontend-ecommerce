import apiClient from "../api/apiClient";

export const getProveedores = async () => {
  const response = await apiClient.get("/proveedores");
  return response.data?.data;
};

export const getProveedorById = async (id) => {
  const response = await apiClient.get(`/proveedores/${id}`);
  return response.data?.data;
};

export const createProveedor = async (proveedor) => {
  const response = await apiClient.post("/proveedores", proveedor);
  return response.data?.data;
};

export const updateProveedor = async (id, proveedor) => {
  const response = await apiClient.put(`/proveedores/${id}`, proveedor);
  return response.data?.data;
};

export const deleteProveedor = async (id) => {
  const response = await apiClient.delete(`/proveedores/${id}`);
  return response.data?.data;
};
