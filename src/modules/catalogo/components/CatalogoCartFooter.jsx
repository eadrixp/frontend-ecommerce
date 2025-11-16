import React from "react";
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const CatalogoCartFooter = ({ total, isClienteLoggedIn, onClose }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    const estaLogueado = typeof isClienteLoggedIn === 'function' 
      ? isClienteLoggedIn() 
      : isClienteLoggedIn;
    
    if (!estaLogueado) {
      navigate('/');
    } else {
      navigate('/checkout');
    }
    onClose();
  };

  const estaLogueado = typeof isClienteLoggedIn === 'function' 
    ? isClienteLoggedIn() 
    : isClienteLoggedIn;

  return (
    <div className="catalogo-cart-footer">
      <div className="catalogo-cart-totals">
        <div className="catalogo-cart-total-row grand">
          <span>Total:</span>
          <span className="catalogo-cart-total-value">
            Q{total.toLocaleString('es-GT', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {estaLogueado ? (
        <button 
          className="catalogo-cart-checkout-btn"
          onClick={handleCheckout}
        >
          <FiShoppingCart size={18} />
          Procesar Pago
        </button>
      ) : (
        <div className="catalogo-cart-not-logged-in">
          <button 
            className="catalogo-cart-checkout-btn-disabled"
            disabled
          >
            <FiShoppingCart size={18} />
            Procesar Pago
          </button>
          <p className="catalogo-cart-login-message">
            Se requiere inicio de sesión para procesar el pago
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogoCartFooter;
