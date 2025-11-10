import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../../services/authService";
import { loginCliente, getClienteProfile } from "../../services/clienteAuthService";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();
  const [form, setForm] = useState({ correo_electronico: "", contrasena: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Obtener la ruta de retorno del state (si viene de redirect)
  const returnPath = location.state?.returnPath;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Primero intentamos login como administrador
      let data;
      try {
        data = await login(form.correo_electronico, form.contrasena);
        
        // Verificar si es administrador usando nombre_rol
        if (data?.token && data?.user?.nombre_rol === 'administrador') {
          setToken(data.token);
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
          return;
        }
      } catch (adminError) {
        // Si falla el login de admin, intentamos como cliente
        console.log("Login de admin falló, intentando como cliente...");
      }

      // Intentamos login como cliente
      try {
        data = await loginCliente(form.correo_electronico, form.contrasena);
        
        if (data?.token) {
          setToken(data.token, data.user || data);
          
          // Verificar si el cliente tiene perfil completo
          try {
            await getClienteProfile();
            // Si tiene perfil, redirigir al catálogo o ruta de retorno
            setTimeout(() => {
              navigate(returnPath || "/catalogo");
            }, 500);
          } catch (profileError) {
            // Si no tiene perfil de cliente, redirigir a completar perfil
            console.log("Cliente sin perfil completo, redirigiendo a registro...");
            setTimeout(() => {
              navigate("/cliente/registro");
            }, 500);
          }
          return;
        }
      } catch (clienteError) {
        console.log("Login de cliente también falló");
      }

      // Si ambos fallan
      setError("Credenciales inválidas o usuario no encontrado");

    } catch (err) {
      console.error(err);
      setError("Error de conexión al servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
  };

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2.5rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    overflow: "hidden"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem"
  };

  const logoStyle = {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block"
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const subtitleStyle = {
    color: "#6b7280",
    fontSize: "1rem",
    fontWeight: "400"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  };

  const inputGroupStyle = {
    position: "relative"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 3rem",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    boxSizing: "border-box"
  };

  const iconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.2rem",
    color: "#9ca3af",
    zIndex: 1
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.875rem 1.5rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    position: "relative",
    overflow: "hidden"
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

  const linkStyle = {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "0.875rem",
    textAlign: "center",
    marginTop: "1.5rem",
    fontWeight: "500"
  };

  return (
    <div style={containerStyle}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.1)",
        animation: "float 6s ease-in-out infinite"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "15%",
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.08)",
        animation: "float 8s ease-in-out infinite reverse"
      }}></div>

      <div style={cardStyle} className="login-form">
        {/* Elementos decorativos internos */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: "0.1",
          zIndex: 0
        }}></div>
        
        {/* Header */}
        <div style={{...headerStyle, position: "relative", zIndex: 1}}>
          <div style={{
            ...logoStyle,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.1))"
          }}>🛍️</div>
          <h1 style={titleStyle}>Nexxus Tecnology</h1>
          <p style={subtitleStyle}>¡Bienvenido!</p>
          
          {/* Indicador visual */}
          <div style={{
            width: "60px",
            height: "4px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "2px",
            margin: "1rem auto 0",
            opacity: "0.7"
          }}></div>
        </div>

        {/* Formulario */}
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <span style={iconStyle}>📧</span>
            <input
              type="email"
              name="correo_electronico"
              placeholder="Correo electrónico"
              value={form.correo_electronico}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <span style={iconStyle}>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              style={{...inputStyle, paddingRight: "3rem"}}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#9ca3af",
                padding: "0.25rem",
                borderRadius: "4px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#667eea";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#9ca3af";
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {error && (
            <div style={errorStyle}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                Iniciando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              to="/catalogo"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Ver catálogo como invitado
            </Link>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ 
              fontSize: "0.875rem", 
              color: "#6b7280", 
              margin: "0"
            }}>
              ¿No tienes cuenta?{" "}
              <Link
                to="/auth/register"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                Registrarse
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
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
        
        @media (max-width: 480px) {
          .login-card {
            margin: 0.5rem !important;
            padding: 1.5rem !important;
            borderRadius: 16px !important;
          }
        }
        
        /* Efectos de entrada */
        .login-form {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Gradientes de fondo dinámicos */
        body {
          overflow: hidden;
        }
        
        /* Mejoras de accesibilidad */
        button:focus,
        input:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
        
        /* Efectos de hover mejorados */
        input:hover {
          border-color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
