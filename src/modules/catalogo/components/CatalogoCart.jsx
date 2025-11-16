import React from "react";
import { FiShoppingCart, FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getImageUrl } from '../../../utils/imageUtils';
import CatalogoCartFooter from './CatalogoCartFooter';

const CatalogoCart = ({ 
  isOpen, 
  cartItems, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem,
  isClienteLoggedIn
}) => {
  const calcularTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = Number(item.precio) || 0;
      const cantidad = Number(item.cantidad) || 1;
      return total + (precio * cantidad);
    }, 0);
  };

  const total = calcularTotal();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`catalogo-cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`catalogo-cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="catalogo-cart-header">
          <h2 className="catalogo-cart-header-title">
            <FiShoppingCart style={{ marginRight: '8px' }} />
            Tu Carrito
          </h2>
          <button 
            className="catalogo-cart-close-btn"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            <FiX />
          </button>
        </div>

        {/* Items */}
        {cartItems.length > 0 ? (
          <>
            <div className="catalogo-cart-items">
              {cartItems.map((item) => (
                <div key={item.id || item.id_producto} className="catalogo-cart-item">
                  {/* Imagen */}
                  <div className="catalogo-cart-item-image">
                    {item.imagen_url ? (
                      <img 
                        src={getImageUrl(item.imagen_url)}
                        alt={item.nombre_producto}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80?text=Sin+Imagen';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0'
                      }}>
                        <FiShoppingCart />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="catalogo-cart-item-content">
                    <h3 className="catalogo-cart-item-title">
                      {item.nombre_producto}
                    </h3>
                    <div className="catalogo-cart-item-price">
                      Q{(Number(item.precio) || 0).toLocaleString('es-GT')}
                    </div>

                    {/* Cantidad */}
                    <div className="catalogo-cart-item-qty">
                      <button
                        onClick={() => onUpdateQuantity(
                          item.id || item.id_producto,
                          Math.max(1, (Number(item.cantidad) || 1) - 1)
                        )}
                        aria-label="Disminuir cantidad"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span>{Number(item.cantidad) || 1}</span>
                      <button
                        onClick={() => onUpdateQuantity(
                          item.id || item.id_producto,
                          (Number(item.cantidad) || 1) + 1
                        )}
                        aria-label="Aumentar cantidad"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Eliminar */}
                  <button
                    className="catalogo-cart-item-remove"
                    onClick={() => onRemoveItem(item.id || item.id_producto)}
                    aria-label="Eliminar del carrito"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <CatalogoCartFooter 
              total={total} 
              isClienteLoggedIn={isClienteLoggedIn}
              onClose={onClose}
              cartItems={cartItems}
            />
          </>
        ) : (
          <div className="catalogo-cart-empty">
            <FiShoppingCart size={48} />
            <h3 style={{ marginTop: '16px', color: '#1a2e4a' }}>Tu carrito está vacío</h3>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Agrega algunos productos para comenzar
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CatalogoCart;
