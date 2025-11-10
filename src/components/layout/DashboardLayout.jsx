import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
    backgroundColor: "#1f2937",
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

  const linkActiveStyle = {
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#374151",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  };

  const containerStyle = {
    display: "flex",
    minHeight: "50vh",
  };

  const contentStyle = {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: "20px",
  };

  const logoutButtonStyle = {
    backgroundColor: "#ef4444",
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
              👤 {user.nombre_usuario}
            </p>
          )}

          <nav style={navStyle}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/productos"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/clientes"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              Clientes
            </NavLink>
            <NavLink
              to="/categorias"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              Categorías
            </NavLink>
            <NavLink
              to="/direcciones"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...linkActiveStyle } : linkStyle
              }
            >
              Direcciones
            </NavLink>
          </nav>
        </div>

        <button
          style={logoutButtonStyle}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
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
