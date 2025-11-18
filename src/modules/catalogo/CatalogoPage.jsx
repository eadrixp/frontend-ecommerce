import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos } from "../../services/productService";
import { getCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, updateCartItem as updateCartItemAPI } from "../../services/orderService";
import ProductCard from "./components/ProductCard";
import CatalogoHeader from "./components/CatalogoHeader";
import CatalogoCart from "./components/CatalogoCart";
import CatalogoFooter from "./components/CatalogoFooter";
import useAuth from "../../hooks/useAuth";
import "./Catalogo.css";

const CatalogoPage = () => {
  const { user, isClienteLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [cartId, setCartId] = useState(null);

  // Cargar carrito del backend
  useEffect(() => {
    if (!isClienteLoggedIn) {
      setCart([]);
      setCartId(null);
      return;
    }

    const loadCart = async () => {
      try {
        setCartLoading(true);
        setCartError(null);
        console.log("📦 Cargando carrito del servidor...");
        const response = await getCart();
        
        if (response.success && response.data) {
          const carritoData = response.data;
          setCartId(carritoData.id_carrito);
          
          // Mapear productos del carrito a la estructura local
          const cartItems = carritoData.productosCarrito?.map(item => ({
            id: item.id_producto,
            id_producto: item.id_producto,
            id_carrito_producto: item.id_carrito_producto,
            nombre_producto: item.producto?.nombre_producto || '',
            precio: Number(item.precio_unitario) || 0,
            cantidad: Number(item.cantidad) || 1,
            stock: Number(item.producto?.stock) || 0,
            imagen_url: item.producto?.imagenes?.[0]?.url_imagen || null,
            producto: item.producto
          })) || [];
          
          setCart(cartItems);
          console.log("✅ Carrito cargado:", cartItems);
        }
      } catch (error) {
        console.error("❌ Error al cargar carrito:", error);
        setCartError("No se pudo cargar carrito");
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    loadCart();
  }, [isClienteLoggedIn]);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        
        const productosValidados = Array.isArray(data) ? data.map(producto => {
          // Intentar obtener imagen de diferentes estructuras posibles
          let imagenUrl = null;
          if (producto.imagenes && Array.isArray(producto.imagenes)) {
            const imgPrincipal = producto.imagenes.find(img => img.es_principal);
            imagenUrl = imgPrincipal?.url_imagen || producto.imagenes[0]?.url_imagen || null;
          } else if (producto.imagen_url) {
            imagenUrl = producto.imagen_url;
          } else if (producto.imagen) {
            imagenUrl = producto.imagen;
          }
          
          return {
            id: producto.id_producto,
            id_producto: producto.id_producto,
            nombre_producto: producto.nombre_producto || '',
            descripcion: producto.descripcion || '',
            precio: Number(producto.precio) || 0,
            stock: Number(producto.stock) || 0,
            categoria: producto.categoria?.nombre_categoria || null,
            imagen_url: imagenUrl,
            activo: producto.activo
          };
        }) : [];
        
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

  // Filtrar productos
  useEffect(() => {
    let filtered = productos;

    if (searchTerm) {
      filtered = filtered.filter(producto =>
        (producto.nombre_producto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(producto => 
        producto.categoria === selectedCategory
      );
    }

    setFilteredProductos(filtered);
  }, [productos, searchTerm, selectedCategory]);

  // Agregar al carrito
  const addToCart = async (producto) => {
    try {
      const existingItem = cart.find(item => 
        (item.id || item.id_producto) === (producto.id || producto.id_producto)
      );
      
      if (existingItem) {
        if (existingItem.cantidad >= producto.stock) {
          alert(`No puedes agregar más de ${producto.stock} unidades de "${producto.nombre_producto}"`);
          return;
        }
        // Actualizar cantidad en backend
        const newQuantity = existingItem.cantidad + 1;
        console.log(`📝 Actualizando cantidad en carrito: ${existingItem.id_carrito_producto} → ${newQuantity}`);
        
        const response = await updateCartItemAPI(existingItem.id_carrito_producto, newQuantity);
        if (response.success) {
          setCart(cart.map(item =>
            (item.id || item.id_producto) === (producto.id || producto.id_producto)
              ? { ...item, cantidad: newQuantity }
              : item
          ));
          console.log("✅ Cantidad actualizada");
        }
      } else {
        if (producto.stock <= 0) {
          alert(`"${producto.nombre_producto}" está agotado`);
          return;
        }
        // Agregar a backend
        console.log(`➕ Agregando producto al carrito: ${producto.id_producto}`);
        
        const response = await addToCartAPI({ 
          id_producto: producto.id_producto, 
          cantidad: 1 
        });
        
        if (response.success && response.data) {
          const carritoData = response.data;
          setCartId(carritoData.id_carrito);
          
          // Mapear nuevo producto
          const newItem = carritoData.productosCarrito?.find(item => 
            item.id_producto === producto.id_producto
          );
          
          if (newItem) {
            setCart(carritoData.productosCarrito.map(item => ({
              id: item.id_producto,
              id_producto: item.id_producto,
              id_carrito_producto: item.id_carrito_producto,
              nombre_producto: item.producto?.nombre_producto || '',
              precio: Number(item.precio_unitario) || 0,
              cantidad: Number(item.cantidad) || 1,
              stock: Number(item.producto?.stock) || 0,
              imagen_url: item.producto?.imagenes?.[0]?.url_imagen || null,
              producto: item.producto
            })));
            console.log("✅ Producto agregado al carrito");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error al agregar al carrito:", error);
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg.includes("Stock insuficiente")) {
        alert("No hay suficiente stock disponible");
      } else {
        alert(errorMsg || "Error al agregar producto al carrito");
      }
    }
  };

  // Remover del carrito
  const removeFromCart = async (productoId) => {
    try {
      const itemToRemove = cart.find(item => (item.id || item.id_producto) === productoId);
      if (!itemToRemove) return;

      console.log(`🗑️ Eliminando producto del carrito: ${itemToRemove.id_carrito_producto}`);
      const response = await removeFromCartAPI(itemToRemove.id_carrito_producto);
      
      if (response.success) {
        setCart(cart.filter(item => (item.id || item.id_producto) !== productoId));
        console.log("✅ Producto eliminado del carrito");
      }
    } catch (error) {
      console.error("❌ Error al eliminar del carrito:", error);
      alert(error.message || "Error al eliminar producto del carrito");
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (productoId, newQuantity) => {
    try {
      if (newQuantity === 0) {
        await removeFromCart(productoId);
        return;
      }

      const itemToUpdate = cart.find(item => (item.id || item.id_producto) === productoId);
      if (!itemToUpdate) return;

      const producto = productos.find(p => (p.id || p.id_producto) === productoId);
      
      if (producto && newQuantity > producto.stock) {
        alert(`No puedes agregar más de ${producto.stock} unidades`);
        return;
      }
      
      console.log(`📝 Actualizando cantidad: ${itemToUpdate.id_carrito_producto} → ${newQuantity}`);
      const response = await updateCartItemAPI(itemToUpdate.id_carrito_producto, newQuantity);
      
      if (response.success) {
        setCart(cart.map(item =>
          (item.id || item.id_producto) === productoId
            ? { ...item, cantidad: newQuantity }
            : item
        ));
        console.log("✅ Cantidad actualizada");
      }
    } catch (error) {
      console.error("❌ Error al actualizar cantidad:", error);
      alert(error.message || "Error al actualizar cantidad");
    }
  };

  const handleUserClick = () => {
    if (!user) {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setCart([]);
    setCartId(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "linear-gradient(135deg, #1a2e4a 0%, #2d4563 100%)" 
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ 
            width: "50px", 
            height: "50px", 
            border: "3px solid rgba(255,255,255,0.3)", 
            borderTop: "3px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p style={{ fontSize: "1.2rem" }}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-container">
      {/* Header */}
      <CatalogoHeader 
        user={user}
        isClienteLoggedIn={isClienteLoggedIn}
        cartCount={cart.reduce((acc, item) => acc + (item.cantidad || 1), 0)}
        onCartClick={() => setShowCart(true)}
        onUserClick={handleUserClick}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        productos={productos}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Body */}
      <main className="catalogo-body">
        {/* Productos */}
        {filteredProductos.length === 0 ? (
          <div className="catalogo-empty">
            <p>No se encontraron productos</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1a2e4a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="catalogo-products-wrapper">
            {filteredProductos.map(producto => (
              <ProductCard
                key={producto.id || producto.id_producto}
                producto={producto}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Carrito */}
      <CatalogoCart 
        isOpen={showCart}
        cartItems={cart}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        isClienteLoggedIn={isClienteLoggedIn}
      />

      {/* Footer */}
      <CatalogoFooter />
    </div>
  );
};

export default CatalogoPage;
