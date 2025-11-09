import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../api/authService";
import { getProductos } from "../../services/productService";
import useAuth from "../../hooks/useAuth";

const DashboardPage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productos: 0,
    categorias: 0,
    inventario: 0,
    valorInventario: 0
  });

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

    const fetchStats = async () => {
      try {
        // Obtener productos del API
        const productos = await getProductos();
        
        // Calcular estadísticas basadas en los datos reales
        const totalProductos = productos.length;
        const productosActivos = productos.filter(p => p.activo).length;
        const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
        const valorInventario = productos.reduce((acc, p) => acc + ((p.precio || 0) * (p.stock || 0)), 0);
        
        // Categorías únicas
        const categoriasUnicas = [...new Set(productos
          .filter(p => p.categoria?.nombre_categoria)
          .map(p => p.categoria.nombre_categoria)
        )].length;
        
        setStats({
          productos: productosActivos,
          categorias: categoriasUnicas,
          inventario: totalStock,
          valorInventario: valorInventario
        });
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        // Valores por defecto en caso de error
        setStats({
          productos: 0,
          categorias: 0,
          inventario: 0,
          valorInventario: 0
        });
      }
    };

    fetchProfile();
    fetchStats();
  }, [logout]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>Cargando dashboard...</p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    textAlign: "center"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem"
  };

  const headerStyle = {
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e5e7eb"
  };

  const quickActionStyle = {
    display: "inline-block",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    textDecoration: "none",
    margin: "0.5rem",
    fontWeight: "500",
    transition: "background-color 0.2s"
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  return (
    <div className="dashboard" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
              Bienvenido, {user?.nombre_usuario}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1rem" }}>
              Rol: {user?.rol?.nombre_rol} | {user?.correo_electronico}
            </p>
          </div>
          <button 
            onClick={logout}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ color: "#2563eb", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Productos Activos</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>{stats.productos}</p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Productos en el catálogo</p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "#059669", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Categorías</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>{stats.categorias}</p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Categorías diferentes</p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "#dc2626", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Stock Total</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>{stats.inventario.toLocaleString()}</p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Unidades en inventario</p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "#7c3aed", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Valor Inventario</h3>
          <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#111827" }}>{formatPrice(stats.valorInventario)}</p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Valor total del inventario</p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#111827" }}>
          Acciones Rápidas
        </h2>
        <div style={{ textAlign: "center" }}>
          <Link to="/productos" style={quickActionStyle}>
            📦 Gestionar Productos
          </Link>
          <Link to="/clientes" style={quickActionStyle}>
            👥 Ver Clientes
          </Link>
          <Link to="/categorias" style={quickActionStyle}>
            📋 Categorías
          </Link>
          
        </div>
      </div>

      {/* Resumen del Inventario */}
      <div style={{ 
        backgroundColor: "#ffffff", 
        borderRadius: "12px", 
        padding: "1.5rem", 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
        border: "1px solid #e5e7eb",
        marginTop: "1.5rem"
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#111827" }}>
          Resumen del Sistema
        </h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1rem" 
        }}>
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f8fafc", 
            borderRadius: "8px",
            border: "1px solid #e2e8f0"
          }}>
            <h4 style={{ color: "#1e40af", marginBottom: "0.5rem", fontSize: "1rem" }}>
              📊 Estado del Inventario
            </h4>
            <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
              {stats.productos} productos activos distribuidos en {stats.categorias} categorías diferentes
            </p>
          </div>
          
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f0fdf4", 
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            <h4 style={{ color: "#059669", marginBottom: "0.5rem", fontSize: "1rem" }}>
              💰 Valor del Negocio
            </h4>
            <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
              Inventario valorizado en {formatPrice(stats.valorInventario)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
