import apiClient from "../api/apiClient";

/* ================================
    COTIZACIONES (CRUD)
================================ */

export const createCotizacion = async (data) => {
  const response = await apiClient.post("/cotizaciones", data);
  return response.data?.data;
};

export const getCotizaciones = async () => {
  const response = await apiClient.get("/cotizaciones");
  return response.data?.data;
};

export const getCotizacionById = async (id) => {
  const response = await apiClient.get(`/cotizaciones/${id}`);
  return response.data?.data;
};

export const updateCotizacion = async (id, data) => {
  const response = await apiClient.put(`/cotizaciones/${id}`, data);
  return response.data?.data;
};

export const deleteCotizacion = async (id) => {
  const response = await apiClient.delete(`/cotizaciones/${id}`);
  return response.data?.data;
};

/* ================================
    OTRAS FUNCIONALIDADES 
================================ */

export const generarNumeroCotizacion = async () => {
  const response = await apiClient.get("/cotizaciones/generar-numero");
  return response.data?.data;
};

export const cambiarEstadoCotizacion = async (id, estado) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/estado`, { estado });
  return response.data?.data;
};

export const marcarComoEnviada = async (id) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/enviar`);
  return response.data?.data;
};

export const marcarComoAceptada = async (id) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/aceptar`);
  return response.data?.data;
};

export const marcarComoRechazada = async (id) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/rechazar`);
  return response.data?.data;
};

export const marcarComoExpirada = async (id) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/expirada`);
  return response.data?.data;
};

export const actualizarMontos = async (id, montos) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/montos`, montos);
  return response.data?.data;
};

export const actualizarNotasTerminos = async (id, notasTerminos) => {
  const response = await apiClient.patch(`/cotizaciones/${id}/notas-terminos`, notasTerminos);
  return response.data?.data;
};

/* ================================
    ITEMS DE COTIZACIÓN
================================ */

// Agregar un item individual
export const agregarItemACotizacion = async (idCotizacion, item) => {
  const response = await apiClient.post(`/cotizaciones/${idCotizacion}/items`, item);
  return response.data?.data;
};

// Agregar múltiples items
export const agregarMultiplesItems = async (idCotizacion, items) => {
  const response = await apiClient.post(`/cotizaciones/${idCotizacion}/items/multiples`, items);
  return response.data?.data;
};

// Obtener todos los items
export const getItemsByCotizacion = async (idCotizacion) => {
  const response = await apiClient.get(`/cotizaciones/${idCotizacion}/items`);
  return response.data?.data;
};

// Resumen
export const getResumenCotizacion = async (idCotizacion) => {
  const response = await apiClient.get(`/cotizaciones/${idCotizacion}/items/resumen`);
  return response.data?.data;
};

// Estadísticas
export const getEstadisticasCotizacion = async (idCotizacion) => {
  const response = await apiClient.get(`/cotizaciones/${idCotizacion}/items/estadisticas`);
  return response.data?.data;
};

// Obtener item por producto
export const getItemByProducto = async (idCotizacion, idProducto) => {
  const response = await apiClient.get(`/cotizaciones/${idCotizacion}/items/${idProducto}`);
  return response.data?.data;
};

// Actualizar cantidad/precio/descuento
export const actualizarItem = async (idCotizacion, idProducto, data) => {
  const response = await apiClient.put(`/cotizaciones/${idCotizacion}/items/${idProducto}`, data);
  return response.data?.data;
};

// Eliminar item
export const eliminarItem = async (idCotizacion, idProducto) => {
  const response = await apiClient.delete(`/cotizaciones/${idCotizacion}/items/${idProducto}`);
  return response.data?.data;
};

// Vaciar toda la cotización
export const vaciarCotizacion = async (idCotizacion) => {
  const response = await apiClient.delete(`/cotizaciones/${idCotizacion}/items`);
  return response.data?.data;
};

/* ================================
    CONVERTIR A ORDEN
================================ */

export const convertirEnOrden = async (idCotizacion) => {
  const response = await apiClient.post(`/cotizaciones/${idCotizacion}/convertir`);
  return response.data?.data;
};

export const getOrdenByCotizacion = async (idCotizacion) => {
  const response = await apiClient.get(`/cotizaciones/${idCotizacion}/orden`);
  return response.data?.data;
};
