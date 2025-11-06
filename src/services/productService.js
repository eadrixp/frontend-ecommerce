// Servicio para consumir el backend de productos
const API_URL = "http://localhost:3000/api/productos"; // Ajusta según tu backend

// Obtiene todos los productos
export const getProductos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  const data = await res.json();
  return data.data || [];
};

// Crea un nuevo producto
export const createProducto = async (producto) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

// Actualiza un producto existente
export const updateProducto = async (id, producto) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

// Elimina (desactiva) un producto
export const deleteProducto = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
};
