import React, { useEffect, useState } from "react";
import { getProductos } from "../../services/productService";
import ProductCard from "./components/ProductCard";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import ShoppingCart from "./components/ShoppingCart";

const CatalogoPage = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        
        // Asegurar que los datos tengan la estructura correcta según el API
        const productosValidados = Array.isArray(data) ? data.map(producto => ({
          id: producto.id_producto,
          nombre_producto: producto.nombre_producto || '',
          descripcion: producto.descripcion || '',
          precio: Number(producto.precio) || 0,
          stock: Number(producto.stock) || 0,
          categoria: producto.categoria?.nombre_categoria || null,
          imagen_url: producto.imagenes?.find(img => img.es_principal)?.url_imagen || null,
          activo: producto.activo
        })) : [];
        
        setProductos(productosValidados);
        setFilteredProductos(productosValidados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProductos([]);
        setFilteredProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos por búsqueda y categoría
  useEffect(() => {
    let filtered = productos;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        (producto.nombre_producto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(producto => 
        producto.categoria === selectedCategory
      );
    }

    setFilteredProductos(filtered);
  }, [productos, searchTerm, selectedCategory]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    const existingItem = cart.find(item => item.id === producto.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...producto, cantidad: 1 }]);
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productoId) => {
    setCart(cart.filter(item => item.id !== productoId));
  };

  // Actualizar cantidad en carrito
  const updateQuantity = (productoId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productoId);
    } else {
      setCart(cart.map(item =>
        item.id === productoId
          ? { ...item, cantidad: newQuantity }
          : item
      ));
    }
  };

  const headerStyle = {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "1.5rem 2rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    backdropFilter: "blur(8px)"
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#f9fafb",
    minHeight: "100vh"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.25rem",
    marginTop: "2rem",
    padding: "0 0.5rem"
  };

  const cartButtonStyle = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "50px",
    padding: "1rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: "#f9fafb" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "50px", 
            height: "50px", 
            border: "3px solid #e5e7eb", 
            borderTop: "3px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              🛍️ Tienda Online
            </h1>
            <p style={{ color: "#6b7280", margin: "0.5rem 0 0 0" }}>
              Descubre nuestros productos
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#6b7280" }}>
              {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div style={containerStyle}>
        {/* Filtros */}
        <div 
          className="filters-grid"
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr auto", 
            gap: "1rem", 
            marginBottom: "1.5rem",
            alignItems: "center"
          }}
        >
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          <div style={{ minWidth: "200px" }}>
            <CategoryFilter
              productos={productos}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProductos.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "4rem", 
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ color: "#6b7280", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              No se encontraron productos
            </h3>
            <p style={{ color: "#9ca3af" }}>
              Intenta con otros términos de búsqueda o filtros
            </p>
          </div>
        ) : (
          <div className="catalog-grid" style={gridStyle}>
            {filteredProductos.map(producto => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante del carrito */}
      <button
        style={cartButtonStyle}
        onClick={() => setShowCart(true)}
      >
        <span>🛒</span>
        <span>Carrito ({cart.reduce((acc, item) => acc + item.cantidad, 0)})</span>
      </button>

      {/* Modal del carrito */}
      {showCart && (
        <ShoppingCart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mejoras de responsividad */
        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .catalog-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default CatalogoPage;