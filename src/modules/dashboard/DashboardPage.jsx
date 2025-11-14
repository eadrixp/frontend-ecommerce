import { useEffect, useState } from 'react';
import { getProfile } from '../../api/authService';
import { getProductos } from '../../services/productService';
import useAuth from '../../hooks/useAuth';
import { FiBarChart2, FiUsers} from 'react-icons/fi';
import { MdInventory2 } from 'react-icons/md';

// Import PostgreSQL View Components
import InventarioDashboard from '../inventario/InventarioDashboard';
import ProductosBajoStock from '../inventario/ProductosBajoStock';
import MovimientosInventario from '../inventario/MovimientosInventario';
import ClientesActividad from '../crm/ClientesActividad';
import PipelineVentas from '../crm/PipelineVentas';

const DashboardPage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    productos: 0,
    totalProductos: 0,
    categorias: 0,
    inventario: 0,
    valorInventario: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const productos = await getProductos();
        const totalProductos = productos.length;
        const productosActivos = productos.filter((p) => p.activo).length;
        const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
        const valorInventario = productos.reduce(
          (acc, p) => acc + (p.precio || 0) * (p.stock || 0),
          0
        );
        const categoriasUnicas = [
          ...new Set(
            productos
              .filter((p) => p.categoria?.nombre_categoria)
              .map((p) => p.categoria.nombre_categoria)
          ),
        ].length;

        setStats({
          productos: productosActivos,
          totalProductos: totalProductos,
          categorias: categoriasUnicas,
          inventario: totalStock,
          valorInventario: valorInventario,
        });
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        setStats({
          productos: 0,
          totalProductos: 0,
          categorias: 0,
          inventario: 0,
          valorInventario: 0,
        });
      }
    };

    fetchProfile();
    fetchStats();
  }, [logout]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
          Cargando dashboard...
        </p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const headerStyle = {
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e5e7eb',
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);

  return (
    <div
      className="dashboard"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}
    >
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              Bienvenido, {user?.nombre_usuario}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Rol: {user?.rol?.nombre_rol} | {user?.correo_electronico}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            borderBottom: '2px solid #e5e7eb',
            overflowX: 'auto',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom:
                activeTab === 'overview' ? '3px solid #2563eb' : 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '500',
              color: activeTab === 'overview' ? '#2563eb' : '#6b7280',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            <FiBarChart2 style={{marginRight: "6px", display: "inline", verticalAlign: "middle"}} /> Resumen General
          </button>
          <button
            onClick={() => setActiveTab('inventario')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom:
                activeTab === 'inventario' ? '3px solid #2563eb' : 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '500',
              color: activeTab === 'inventario' ? '#2563eb' : '#6b7280',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            <MdInventory2 style={{marginRight: "6px", display: "inline", verticalAlign: "middle"}} /> Inventario
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'crm' ? '3px solid #2563eb' : 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '500',
              color: activeTab === 'crm' ? '#2563eb' : '#6b7280',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            <FiUsers style={{marginRight: "6px", display: "inline", verticalAlign: "middle"}} /> CRM
          </button>
        </div>

        {activeTab === 'overview' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#111827',
              }}
            >
              Resumen del Sistema
            </h2>
  <div style={gridStyle}>
        <div style={cardStyle}>
          <h3
            style={{
              color: '#2563eb',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
            }}
          >
            Productos Activos
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
            {stats.productos}
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            de {stats.totalProductos} productos totales
          </p>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              color: '#059669',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
            }}
          >
            Categorías
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
            {stats.categorias}
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Categorías diferentes
          </p>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              color: '#dc2626',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
            }}
          >
            Stock Total
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
            {stats.inventario.toLocaleString()}
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Unidades en inventario
          </p>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              color: '#7c3aed',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
            }}
          >
            Valor Inventario
          </h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>
            {formatPrice(stats.valorInventario)}
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Valor total del inventario
          </p>
        </div>
      </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <div>
            <InventarioDashboard />
            <div style={{ marginTop: '2rem' }}>
              <ProductosBajoStock />
            </div>
            <div style={{ marginTop: '2rem' }}>
              <MovimientosInventario />
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div>
            <ClientesActividad />
            <div style={{ marginTop: '2rem' }}>
              <PipelineVentas />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
