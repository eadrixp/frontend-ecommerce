import React from "react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const sidebarStyle = {
    width: "220px",
    backgroundColor: "#1f2937",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box",
  };

  const linkStyle = {
    color: "#d1d5db",
    textDecoration: "none",
    marginBottom: "12px",
    fontWeight: "500",
  };

  const linkActiveStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
  };

  const contentStyle = {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: "20px",
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <h2 style={{ marginBottom: "20px", color: "#fff" }}>📦 Dashboard</h2>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/dashboard" style={linkStyle}>
            Inicio
          </Link>
          <Link to="/productos" style={linkStyle}>
            Productos
          </Link>
          <Link to="/clientes" style={linkStyle}>
            Clientes
          </Link>
          <Link to="/categorias" style={linkStyle}>
            Categorías
          </Link>
        </nav>
      </aside>
      <main style={contentStyle}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
