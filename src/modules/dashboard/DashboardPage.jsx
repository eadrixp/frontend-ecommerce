import { useEffect, useState } from "react";
import { getProfile } from "../../api/authService";
import useAuth from "../../hooks/useAuth";

const DashboardPage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout]);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="dashboard">
      <h1>Bienvenido {user?.nombre_usuario}</h1>
      <p>Rol: {user?.rol?.nombre_rol}</p>
      <p>Correo: {user?.correo_electronico}</p>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default DashboardPage;
