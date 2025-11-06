import apiClient from "../api/apiClient";

// ✅ Obtener todas las categorías
export const getCategorias = async () => {
  const { data } = await apiClient.get("/categorias");
  return data.data || [];
};

// ✅ Crear una categoría
export const createCategoria = async (categoria) => {
  const { data } = await apiClient.post("/categorias", categoria);
  return data;
};

// ✅ Actualizar una categoría
export const updateCategoria = async (id, categoria) => {
  const { data } = await apiClient.put(`/categorias/${id}`, categoria);
  return data;
};

// ✅ Eliminar (desactivar) una categoría
export const deleteCategoria = async (id) => {
  const { data } = await apiClient.delete(`/categorias/${id}`);
  return data;
};
