import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user, onLogout}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Opciones del menú - Fácil de agregar/eliminar
  const menuItems = [
    {
      id: "orders",
      label: "Mis Órdenes",
      icon: FiShoppingBag,
      onClick: () => {
        navigate('/ordenes');
        setIsOpen(false);
      }
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: FiLogOut,
      onClick: () => {
        onLogout();
        setIsOpen(false);
      },
      isDanger: true
    }
  ];

  return (
    <div className="user-menu-container">
      {/* Botón del usuario */}
      <button
        ref={buttonRef}
        className="user-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiUser size={20} />
        <span>{user?.nombre || user?.nombre_usuario || 'Mi Cuenta'}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div ref={menuRef} className="user-menu-dropdown">
          {/* Header con información del usuario */}
          <div className="user-menu-header">
            <div className="user-menu-avatar">
              {(user?.nombre || user?.nombre_usuario || "U").charAt(0).toUpperCase()}
            </div>
            <div className="user-menu-info">
              <p className="user-menu-name">{user?.nombre || user?.nombre_usuario}</p>
              <p className="user-menu-email">{user?.correo_electronico || "usuario@ejemplo.com"}</p>
            </div>
          </div>

          {/* Separador */}
          <div className="user-menu-divider"></div>

          {/* Opciones del menú */}
          <div className="user-menu-items">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className={`user-menu-item ${item.isDanger ? 'user-menu-item-danger' : ''}`}
                  onClick={item.onClick}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
