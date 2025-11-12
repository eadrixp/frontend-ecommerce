import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiShoppingCart, FiUsers, FiLayers, FiMapPin, FiUser } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { getProfile } from "../../api/authService";

const DashboardLayout = ({ children }) => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        logout();
      }
    };
    fetchProfile();
  }, [logout]);

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#6d4ed3ff",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box",
    justifyContent: "space-between", // Para que el botón quede abajo
  };

  const navStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px", // más separación entre links
  };

  const linkStyle = {
    color: "#d1d5db",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "all 0.2s",
  };

  const iconStyle = {
    marginRight: 10,
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 18,
  };

  const linkActiveStyle = {
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#7d54ddff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  };

  const containerStyle = {
    display: "flex",
    minHeight: "50vh",
  };

  const contentStyle = {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: "0px",
  };

  const logoutButtonStyle = {
    backgroundColor: "#542f5edf",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "all 0.2s",
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>

        <div>
          <h2 style={{ marginBottom: "30px", color: "#fff" }}>
            Nexxus Tecnology
          </h2>

          {user && (
            <p style={{ marginBottom: "20px", fontWeight: "bold" }}>
               {user.nombre_usuario}
            </p>
          )}

          <nav style={navStyle}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <FiHome style={iconStyle} /> Inicio
              </span>
            </NavLink>

            <NavLink
              to="/productos"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <FiShoppingCart style={iconStyle} /> Productos
              </span>
            </NavLink>

            <NavLink
              to="/clientes"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <FiUsers style={iconStyle} /> Clientes
              </span>
            </NavLink>

            <NavLink
              to="/categorias"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <FiLayers style={iconStyle} /> Categorías
              </span>
            </NavLink>

            <NavLink
              to="/direcciones"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <FiMapPin style={iconStyle} /> Direcciones
              </span>
            </NavLink>

            <NavLink
              to="/usuarios"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <FiUser style={iconStyle} /> Usuarios
              </span>
            </NavLink>
          </nav>
        </div>

        {/*{user && (
          <div
            style={{
              marginBottom: 10,
              textAlign: "center",
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.06)",
              padding: "8px 12px",
              borderRadius: "8px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontWeight: 700 }}>{user.nombre_usuario}</div>
          </div>
        )}*/}

        <button
          style={logoutButtonStyle}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#8d6be4ff")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#7d54ddff")}
          onClick={logout}
        >
          🚪 Cerrar sesión
        </button>

      </aside>

      <main style={contentStyle}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
