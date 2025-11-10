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
    const { name, value } = e.target;
    
    if (name === 'telefono') {
      // Formatear teléfono automáticamente para Guatemala
      const formatted = formatPhoneNumber(value, formData.telefono);
      setFormData({
        ...formData,
        [name]: formatted
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const formatPhoneNumber = (newValue, oldValue = '') => {
    // Remover todo excepto números del nuevo valor
    const newNumbers = newValue.replace(/\D/g, '');
    const oldNumbers = oldValue.replace(/\D/g, '');
    
    // Si está vacío, retornar vacío (permite borrar todo)
    if (!newNumbers) return '';
    
    // Detectar si el usuario está borrando: si tenía más números antes y ahora tiene menos
    const isDeleting = oldNumbers.length > newNumbers.length;
    
    // Si está borrando y solo quedan los números "502", permitir borrar todo
    if (isDeleting && newNumbers === '502') {
      return '';
    }
    
    // Si los números son exactamente "502" y no está borrando, mantener el formato base
    if (newNumbers === '502' && !isDeleting) {
      return '+502';
    }
    
    // En cuanto hay cualquier número adicional al 502, formatear normalmente
    let formatted = newNumbers;
    if (!formatted.startsWith('502')) {
      formatted = '502' + formatted;
    }
    
    // Limitar a 11 dígitos máximo (502 + 8 dígitos)
    formatted = formatted.slice(0, 11);
    
    // Aplicar formato +502 0000-0000
    const countryCode = formatted.slice(0, 3); // 502
    const rest = formatted.slice(3);
    
    if (rest.length === 0) {
      return `+${countryCode}`;
    } else if (rest.length <= 4) {
      return `+${countryCode} ${rest}`;
    } else {
      const firstPart = rest.slice(0, 4);
      const secondPart = rest.slice(4);
      return `+${countryCode} ${firstPart}-${secondPart}`;
    }
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

    // Validar formato de teléfono (debe tener al menos +502 y 8 dígitos más)
    const phoneNumbers = formData.telefono.replace(/\D/g, '');
    if (phoneNumbers.length < 11 || !phoneNumbers.startsWith('502')) {
      setError("El teléfono debe tener el formato completo (+502 0000-0000)");
      setIsLoading(false);
      return;
    }

    try {
      // Debug: Verificar datos del usuario y token
      console.log('🔍 Debug - Usuario actual:', user);
      console.log('🔍 Debug - Token disponible:', !!user);
      
      // Verificar token en localStorage
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Debug - Token en localStorage:', token ? 'Exists' : 'Missing');
      console.log('🔍 Debug - Token length:', token?.length);
      
      if (!user) {
        setError("Error: No se encontró la información del usuario. Por favor, inicia sesión nuevamente.");
        setIsLoading(false);
        return;
      }
      
      // Crear el perfil de cliente - Solo enviar campos que espera el backend
      const clienteData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim()
      };

      console.log('📝 Datos que se enviarán al backend:', clienteData);
      console.log('📝 URL del endpoint:', '/api/clientes');

      console.log('📝 Creando perfil de cliente:', clienteData);
      await createClientProfile(clienteData);
      
      // Redirigir al catálogo
      navigate('/catalogo');
    } catch (error) {
      console.error('❌ Error al crear perfil de cliente:', error);
      setError(error.response?.data?.message || error.message || "Error al crear el perfil de cliente");
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
              placeholder="Ingresa 8 dígitos"
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              maxLength="15"
              required
            />
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
              Formato: +502 0000-0000 (se aplica automáticamente)
            </p>
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