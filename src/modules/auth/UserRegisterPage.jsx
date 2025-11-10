import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiUserPlus, FiAlertTriangle } from 'react-icons/fi';
import { registerCliente } from "../../services/clienteAuthService";
import useAuth from "../../hooks/useAuth";

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    contrasena: "",
    confirmarContrasena: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!formData.nombre_usuario.trim() || !formData.correo_electronico.trim() || !formData.contrasena.trim()) {
      setError("Todos los campos son obligatorios");
      setIsLoading(false);
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      console.log('📝 Registrando nuevo usuario:', {
        nombre_usuario: formData.nombre_usuario,
        correo_electronico: formData.correo_electronico
      });

      // Registrar usuario
      const userData = await registerCliente(
        formData.nombre_usuario.trim(),
        formData.correo_electronico.trim(),
        formData.contrasena
      );

      console.log('✅ Usuario registrado exitosamente:', userData);

      // Establecer token y datos de usuario
      if (userData.token) {
        setToken(userData.token, userData.user || userData);
        
        // Redirigir a completar perfil de cliente
        setTimeout(() => {
          navigate('/cliente/registro');
        }, 500);
      }

    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      setError(error.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative"
  };

  const containerStyle = {
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "500px",
    position: "relative",
    animation: "fadeInUp 0.6s ease-out"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem"
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem"
  };

  const subtitleStyle = {
    color: "#6b7280",
    fontSize: "1.1rem",
    fontWeight: "400"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  };

  const inputGroupStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  };

  const labelStyle = {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const inputStyle = {
    padding: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "#f9fafb"
  };

  const passwordContainerStyle = {
    position: "relative"
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0.25rem"
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    opacity: isLoading ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)"
  };

  const backButtonStyle = {
    position: "absolute",
    top: "1.5rem",
    left: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s"
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb"
  };

  return (
    <div style={pageStyle}>
      <button 
        style={backButtonStyle}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FiArrowLeft size={20} />
      </button>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FiUserPlus size={32} />
            Crear Cuenta
          </h1>
          <p style={subtitleStyle}>
            Únete a nuestra tienda online
          </p>
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiUser size={16} />
              Nombre de usuario
            </label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ingresa tu nombre de usuario"
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiMail size={16} />
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              style={inputStyle}
              placeholder="ejemplo@correo.com"
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiLock size={16} />
              Contraseña
            </label>
            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? "text" : "password"}
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                style={{...inputStyle, paddingRight: "3rem"}}
                placeholder="Mínimo 6 caracteres"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
              <button
                type="button"
                style={eyeButtonStyle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiLock size={16} />
              Confirmar contraseña
            </label>
            <div style={passwordContainerStyle}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                style={{...inputStyle, paddingRight: "3rem"}}
                placeholder="Repite tu contraseña"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
              <button
                type="button"
                style={eyeButtonStyle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
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
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px 0 rgba(102, 126, 234, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 15px 0 rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                Creando cuenta...
              </>
            ) : (
              <>
                <FiUserPlus size={18} />
                Crear cuenta
              </>
            )}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ 
              fontSize: "0.875rem", 
              color: "#6b7280", 
              margin: "0" 
            }}>
            ¿Ya tienes cuenta? {" "} 
            <Link
                to="/"
                style={linkStyle}
                onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
                }}
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default UserRegisterPage;