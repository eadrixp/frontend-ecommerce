import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
//import "./Sidebar.css";

const Sidebar = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">E-Commerce</h2>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          🏠 Dashboard
        </NavLink>
        
        <NavLink to="/dashboard-productos" className="sidebar-link">
           Productoss
        </NavLink>
        <NavLink to="/clientes" className="sidebar-link">
           Clientes
        </NavLink>
        <NavLink to="/dashboard-categorias" className="sidebar-link">
           Categorías
        </NavLink>
        <NavLink to="/direccion" className="sidebar-link">
           Direcciones
        </NavLink>

      </nav>

      <button onClick={handleLogout} className="logout-btn">
        🚪 Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;
