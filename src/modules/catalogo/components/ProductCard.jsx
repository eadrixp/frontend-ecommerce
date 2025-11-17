import React, { useState } from "react";
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { getImageUrl } from '../../../utils/imageUtils';

const ProductCard = ({ producto, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  // Usar imagen del producto o placeholder si no hay imagen
  const imageUrl = getImageUrl(producto.imagen_url);
  const placeholderUrl = 'https://via.placeholder.com/400x300?text=Sin+Imagen';

  // Calcular descuento si existe
  const calcularDescuento = () => {
    if (producto.precio_original && producto.precio) {
      const desc = ((producto.precio_original - producto.precio) / producto.precio_original) * 100;
      return Math.round(desc);
    }
    return 0;
  };

  const descuento = calcularDescuento();
  const mostrarBadgeOferta = descuento > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart({
      id: producto.id || producto.id_producto,
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      cantidad: 1
    });
  };

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-card-image">
        <img
          src={imageError ? placeholderUrl : imageUrl}
          alt={producto.nombre_producto}
          onError={() => setImageError(true)}
        />

        {/* Descuento Badge */}
        {mostrarBadgeOferta && (
          <div className="product-card-badge">
            -{descuento}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-card-content">
        {/* Title */}
        <h3 className="product-card-title">
          {producto.nombre_producto}
        </h3>

        {/* Rating */}
        <div className="product-card-rating">
          <div className="product-card-stars">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={14}
                fill="#f39c12"
                stroke="#f39c12"
                style={{ marginRight: '2px' }}
              />
            ))}
          </div>
          <span className="product-card-reviews">(12 reseñas)</span>
        </div>

        {/* Description */}
        {producto.descripcion && (
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {producto.descripcion}
          </p>
        )}

        {/* Price */}
        <div className="product-card-price">
          <span className="product-card-price-current">
            Q{Number(producto.precio || 0).toLocaleString('es-GT')}
          </span>
          {producto.precio_original && (
            <span className="product-card-price-original">
              Q{Number(producto.precio_original).toLocaleString('es-GT')}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {producto.stock !== undefined && (
          <div style={{
            fontSize: '12px',
            color: producto.stock > 5 ? '#27ae60' : '#f39c12',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            {producto.stock > 5 ? (
              <span>✓ En Stock ({producto.stock} disponibles)</span>
            ) : producto.stock > 0 ? (
              <span>⚠ Poco disponible ({producto.stock})</span>
            ) : (
              <span>✗ Agotado</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="product-card-actions">
          <button
            className="product-card-btn product-card-btn-primary"
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
            style={{
              opacity: producto.stock === 0 ? 0.5 : 1,
              cursor: producto.stock === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <FiShoppingCart size={16} />
            {producto.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
          <button
            className="product-card-btn product-card-btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              // Implementar ver detalles
            }}
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;