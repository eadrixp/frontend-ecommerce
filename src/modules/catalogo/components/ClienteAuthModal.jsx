import React, { useState } from "react";
import { loginCliente, registerCliente } from "../../../services/clienteAuthService";
import useAuth from "../../../hooks/useAuth";

const ClienteAuthModal = ({ isOpen, onClose, returnPath = "/catalogo" }) => {
  const { loginWithRedirect } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // true = login, false = registro
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    contrasena: "",
    confirmarContrasena: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Limpiar error al cambiar input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        console.log('🔐 Intentando login de cliente...');
        const userData = await loginCliente(formData.correo_electronico, formData.contrasena);
        console.log('✅ Login exitoso, datos recibidos:', userData);
        loginWithRedirect(userData, returnPath);
        onClose();
      } else {
        // Registro
        if (formData.contrasena !== formData.confirmarContrasena) {
          setError("Las contraseñas no coinciden");
          return;
        }

        if (formData.contrasena.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          return;
        }

        const userData = await registerCliente(
          formData.nombre_usuario,
          formData.correo_electronico,
          formData.contrasena
        );
        
        loginWithRedirect(userData, returnPath);
        onClose();
      }
    } catch (err) {
      console.error(err);
      // El servicio puede lanzar una Error con .message o devolver un objeto axios error
      const message = err?.message || err?.response?.data?.message || "Error en la autenticación. Verifica tus datos.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem"
  };

  const modalStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    padding: "2rem",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem"
  };

  const titleStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem"
  };

  const subtitleStyle = {
    color: "#6b7280",
    fontSize: "1rem"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.875rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    disabled: isLoading,
    opacity: isLoading ? 0.7 : 1
  };

  const toggleButtonStyle = {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: "0.875rem",
    cursor: "pointer",
    textDecoration: "underline"
  };

  const errorStyle = {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    border: "1px solid #fecaca",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#6b7280"
          }}
        >
          ❌
        </button>

        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <p style={subtitleStyle}>
            {isLogin 
              ? "Ingresa para continuar con tu compra"
              : "Regístrate para acceder a todas las funcionalidades"
            }
          </p>
        </div>

        {/* Formulario */}
        <form style={formStyle} onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="nombre_usuario"
              placeholder="Nombre de usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              required
            />
          )}

          <input
            type="email"
            name="correo_electronico"
            placeholder="Correo electrónico"
            value={formData.correo_electronico}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            required
          />

          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmarContrasena"
              placeholder="Confirmar contraseña"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              required
            />
          )}

          {error && (
            <div style={errorStyle}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={buttonStyle}
          >
            {isLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                {isLogin ? "Iniciando..." : "Registrando..."}
              </div>
            ) : (
              isLogin ? "Iniciar Sesión" : "Crear Cuenta"
            )}
          </button>
        </form>

        {/* Toggle entre login/registro */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.875rem" }}>
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  nombre_usuario: "",
                  correo_electronico: "",
                  contrasena: "",
                  confirmarContrasena: ""
                });
              }}
              style={toggleButtonStyle}
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ClienteAuthModal;