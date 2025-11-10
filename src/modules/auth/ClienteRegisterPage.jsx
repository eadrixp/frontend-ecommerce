import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiArrowLeft, FiUserPlus, FiAlertTriangle } from 'react-icons/fi';
import useAuth from "../../hooks/useAuth";

const ClienteRegisterPage = () => {
  const navigate = useNavigate();
  const { user, createClientProfile } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.telefono.trim()) {
      setError("Todos los campos son obligatorios");
      setIsLoading(false);
      return;
    }

    try {
      // Crear el perfil de cliente
      const clienteData = {
        id_usuario: user.id,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim()
      };

      console.log('📝 Creando perfil de cliente:', clienteData);
      await createClientProfile(clienteData);
      
      // Redirigir al catálogo
      navigate('/catalogo');
    } catch (error) {
      console.error('❌ Error al crear perfil de cliente:', error);
      setError(error.response?.data?.message || "Error al crear el perfil de cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem"
  };

  const containerStyle = {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem"
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  };

  const subtitleStyle = {
    color: "#6b7280",
    fontSize: "1rem"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  };

  const labelStyle = {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151"
  };

  const inputStyle = {
    padding: "0.75rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s"
  };

  const errorStyle = {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#dc2626"
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.875rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
    opacity: isLoading ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  };

  const backButtonStyle = {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#6b7280",
    fontSize: "0.875rem",
    padding: "0.5rem"
  };

  return (
    <div style={pageStyle}>
      <button 
        style={backButtonStyle}
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={18} />
        Volver
      </button>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FiUserPlus size={28} color="#2563eb" />
            Completar Perfil
          </h1>
          <p style={subtitleStyle}>
            Para continuar, necesitamos algunos datos adicionales
          </p>
          {user && (
            <p style={{ color: "#10b981", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Bienvenido, {user.nombre_usuario} ({user.correo_electronico})
            </p>
          )}
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiUser size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ingresa tu nombre"
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiUser size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ingresa tu apellido"
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiPhone size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              style={inputStyle}
              placeholder="+502 1234-5678"
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              required
            />
          </div>

          {error && (
            <div style={errorStyle}>
              <FiAlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                Creando perfil...
              </>
            ) : (
              <>
                <FiUserPlus size={18} />
                Completar Perfil
              </>
            )}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ClienteRegisterPage;