// Configuración de la base URL del servidor
const BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Construye la URL completa de una imagen
 * @param {string} imagePath - Ruta de la imagen devuelta por el backend (ej: "/images/imagen-uuid.jpg")
 * @returns {string} URL completa de la imagen o null si no hay imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }
  
  // Si la ruta ya es una URL completa, la retornamos tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // TEMPORAL: Como el backend no sirve imágenes estáticas aún,
  // usar placeholders basados en el nombre del archivo
  if (imagePath.includes('/images/')) {
    const fileName = imagePath.split('/').pop().split('.')[0];
    return getPlaceholderImageForProduct(fileName);
  }
  
  // Si la ruta empieza con /, la concatenamos con la base URL
  if (imagePath.startsWith('/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // Si no empieza con /, agregamos el / y la concatenamos
  return `${BASE_URL}/${imagePath}`;
};

/**
 * Genera una imagen placeholder específica para un producto
 * @param {string} fileName - Nombre del archivo de imagen (sin extensión)
 * @returns {string} URL de imagen placeholder apropiada
 */
const getPlaceholderImageForProduct = (fileName) => {
  // Mapeo de productos a imágenes representativas
  const productImageMap = {
    'laptop-dell-1': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'laptop-dell-2': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
    'mouse-logitech': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    'camisa-polo': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    'sabanas-king': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
    'balon-futbol': 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=400&h=300&fit=crop'
  };
  
  return productImageMap[fileName] || getPlaceholderUrl(fileName.replace(/-/g, ' '), 400, 300);
};

/**
 * Genera una URL de placeholder para imágenes faltantes
 * @param {string} text - Texto para el placeholder
 * @param {number} width - Ancho de la imagen
 * @param {number} height - Alto de la imagen
 * @returns {string} URL del placeholder
 */
export const getPlaceholderUrl = (text = 'Sin Imagen', width = 400, height = 300) => {
  // Usando un servicio de placeholder como picsum o generando uno simple
  return `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=${encodeURIComponent(text)}`;
};

/**
 * Verifica si una imagen existe en el servidor
 * @param {string} imageUrl - URL de la imagen a verificar
 * @returns {Promise<boolean>} True si la imagen existe
 */
export const checkImageExists = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Error verificando imagen:', error);
    return false;
  }
};