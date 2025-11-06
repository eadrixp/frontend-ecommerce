import apiClient from "../api/apiClient";

// ✅ Obtiene todos los productos
export const getProductos = async () => {
  const { data } = await apiClient.get("/productos");
  return data.data || [];
};

// ✅ Crea un nuevo producto
export const createProducto = async (producto) => {
  const { data } = await apiClient.post("/productos", producto);
  return data;
};

// ✅ Actualiza un producto existente
export const updateProducto = async (id, producto) => {
  const { data } = await apiClient.put(`/productos/${id}`, producto);
  return data;
};

// ✅ Elimina (desactiva) un producto
export const deleteProducto = async (id) => {
  const { data } = await apiClient.delete(`/productos/${id}`);
  return data;
};
