import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authService";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [form, setForm] = useState({ correo_electronico: "", contrasena: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(form.correo_electronico, form.contrasena);

      if (data?.token) {
        setToken(data.token);
        navigate("/dashboard"); // ✅ redirige al dashboard
      } else {
        setError("Error: respuesta inválida del servidor");
      }
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          name="correo_electronico"
          placeholder="Correo electrónico"
          value={form.correo_electronico}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={handleChange}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginPage;
