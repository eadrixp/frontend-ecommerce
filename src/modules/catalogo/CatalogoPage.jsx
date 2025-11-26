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
  // eslint-disable-next-line no-unused-vars
  const [cartLoading, setCartLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cartError, setCartError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [cartId, setCartId] = useState(null);

  // Cargar carrito del backend
  useEffect(() => {
    if (!isClienteLoggedIn) {
      console.log("📵 Usuario no autenticado - Limpiando carrito");
      setCart([]);
      setCartId(null);
      return;
    }

    const loadCart = async () => {
      try {
        setCartLoading(true);
        setCartError(null);
        console.log("📦 [CARRITO] Iniciando carga del carrito del servidor...");
        const response = await getCart();
        
        console.log("📦 [CARRITO] Respuesta del servidor:", response);
        
        if (response.success && response.data) {
          const carritoData = response.data;
          console.log("📦 [CARRITO] Datos del carrito:", carritoData);
          console.log("📦 [CARRITO] ID Carrito:", carritoData.id_carrito);
          console.log("📦 [CARRITO] Productos en carrito:", carritoData.productosCarrito?.length || 0);
          
          setCartId(carritoData.id_carrito);
          
          // Mapear productos del carrito a la estructura local
          const cartItems = carritoData.productosCarrito?.map(item => {
            console.log(`🔍 [CARRITO] ITEM RAW DEL SERVIDOR:`, JSON.stringify(item, null, 2));
            console.log(`📷 [CARRITO] Estructura del producto ${item.id_producto}:`, item.producto);
            
            // Acceder a la imagen desde diferentes rutas posibles
            let imagenUrl = null;
            
            // 1. Intentar obtener imagen_url directo del producto (nueva estructura del backend)
            if (item.producto?.imagen_url) {
              imagenUrl = item.producto.imagen_url;
              console.log(`📷 [CARRITO] Imagen encontrada en item.producto.imagen_url:`, imagenUrl);
            }
            // 2. Si no, intentar obtener desde array imagenes (estructura antigua)
            else if (item.producto?.imagenes && Array.isArray(item.producto.imagenes)) {
              const imgPrincipal = item.producto.imagenes.find(img => img.es_principal);
              imagenUrl = imgPrincipal?.url_imagen || item.producto.imagenes[0]?.url_imagen || null;
              console.log(`📷 [CARRITO] Imagen encontrada en item.producto.imagenes:`, imagenUrl);
            }
            
            // 3. Si aún no hay imagen, buscar en los productos cargados del catálogo
            if (!imagenUrl) {
              const productoEnCatalogo = productos.find(p => p.id_producto === item.id_producto);
              console.log(`📷 [CARRITO] Buscando en catálogo para producto ${item.id_producto}:`, productoEnCatalogo);
              if (productoEnCatalogo) {
                imagenUrl = productoEnCatalogo.imagen_url;
                console.log(`📷 [CARRITO] Imagen encontrada en catálogo:`, imagenUrl);
              }
            }
            
            console.log(`📷 [CARRITO] URL de imagen final mapeada:`, imagenUrl);
            
            // El backend retorna id_carrito_producto, usarlo directamente
            const idCarritoProducto = item.id_carrito_producto;
            console.log(`🔑 [CARRITO] ID del item en carrito: ${idCarritoProducto} (para producto ${item.id_producto})`);
            
            return {
              id: item.id_producto,
              id_producto: item.id_producto,
              id_carrito_producto: idCarritoProducto,  // ESTE ES EL ID DEL ITEM EN EL CARRITO - USADO EN DELETE/PATCH
              nombre_producto: item.producto?.nombre_producto || '',
              precio: Number(item.precio_unitario) || 0,
              cantidad: Number(item.cantidad) || 1,
              stock: Number(item.producto?.stock) || 0,
              imagen_url: imagenUrl,
              producto: item.producto
            };
          }) || [];
          
          console.log("✅ [CARRITO] Carrito cargado exitosamente con", cartItems.length, "productos");
          cartItems.forEach(item => {
            console.log(`  - ${item.nombre_producto} (ID Producto: ${item.id_producto}): ${item.cantidad} unidades, Stock: ${item.stock}`);
          });
          
          setCart(cartItems);
        } else {
          console.warn("⚠️ [CARRITO] Respuesta sin datos o success=false");
          setCart([]);
        }
      } catch (error) {
        console.error("❌ [CARRITO] Error al cargar carrito:", error);
        console.error("❌ [CARRITO] Detalles del error:", error.response?.data);
        setCartError("No se pudo cargar carrito");
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    loadCart();
  }, [isClienteLoggedIn, productos]);

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
      console.log("➕ [AGREGAR] Iniciando agregación de producto:", producto.id_producto, "-", producto.nombre_producto);
      
      const existingItem = cart.find(item => 
        (item.id || item.id_producto) === (producto.id || producto.id_producto)
      );
      
      if (existingItem) {
        console.log(`➕ [AGREGAR] Producto ya existe en carrito (ID: ${existingItem.id_carrito_producto}), cantidad actual: ${existingItem.cantidad}`);
        
        if (existingItem.cantidad >= producto.stock) {
          console.warn(`⚠️ [AGREGAR] Stock insuficiente - Cantidad: ${existingItem.cantidad}, Stock disponible: ${producto.stock}`);
          alert(`No puedes agregar más de ${producto.stock} unidades de "${producto.nombre_producto}"`);
          return;
        }
        
        // Actualizar cantidad en backend
        const newQuantity = existingItem.cantidad + 1;
        console.log(`📝 [AGREGAR] Actualizando cantidad en backend: ID ${existingItem.id_carrito_producto} → ${newQuantity}`);
        
        const response = await updateCartItemAPI(existingItem.id_carrito_producto, newQuantity);
        console.log(`✅ [AGREGAR] Respuesta de actualización:`, response);
        
        if (response.success) {
          setCart(cart.map(item =>
            (item.id || item.id_producto) === (producto.id || producto.id_producto)
              ? { ...item, cantidad: newQuantity }
              : item
          ));
          console.log(`✅ [AGREGAR] Cantidad actualizada exitosamente a ${newQuantity}`);
        }
      } else {
        if (producto.stock <= 0) {
          console.warn(`⚠️ [AGREGAR] Producto agotado - Stock: ${producto.stock}`);
          alert(`"${producto.nombre_producto}" está agotado`);
          return;
        }
        
        // Agregar a backend
        console.log(`➕ [AGREGAR] Producto nuevo, enviando al backend: ID ${producto.id_producto}, Cantidad: 1`);
        
        const response = await addToCartAPI({ 
          id_producto: producto.id_producto, 
          cantidad: 1 
        });
        
        console.log(`📦 [AGREGAR] Respuesta del servidor:`, response);
        
        if (response.success && response.data) {
          const carritoData = response.data;
          console.log(`✅ [AGREGAR] Carrito actualizado, nuevo ID carrito: ${carritoData.id_carrito}`);
          setCartId(carritoData.id_carrito);
          
          // Mapear nuevo producto
          const newItem = carritoData.productosCarrito?.find(item => 
            item.id_producto === producto.id_producto
          );
          
          if (newItem) {
            console.log(`✅ [AGREGAR] Producto agregado exitosamente:`, newItem);
            console.log(`📷 [AGREGAR] Estructura del producto:`, newItem.producto);
            console.log(`📷 [AGREGAR] Imagenes disponibles:`, newItem.producto?.imagenes);
            
            setCart(carritoData.productosCarrito.map(item => {
              console.log(`📷 [AGREGAR-MAP] ITEM RAW DEL SERVIDOR:`, JSON.stringify(item, null, 2));
              console.log(`📷 [AGREGAR-MAP] Mapeando producto ${item.id_producto}`);
              
              // Acceder a la imagen desde diferentes rutas posibles
              let imagenUrl = null;
              
              // 1. Intentar obtener imagen_url directo del producto (nueva estructura del backend)
              if (item.producto?.imagen_url) {
                imagenUrl = item.producto.imagen_url;
                console.log(`📷 [AGREGAR-MAP] Imagen encontrada en item.producto.imagen_url:`, imagenUrl);
              }
              // 2. Si no, intentar obtener desde array imagenes (estructura antigua)
              else if (item.producto?.imagenes && Array.isArray(item.producto.imagenes)) {
                const imgPrincipal = item.producto.imagenes.find(img => img.es_principal);
                imagenUrl = imgPrincipal?.url_imagen || item.producto.imagenes[0]?.url_imagen || null;
                console.log(`📷 [AGREGAR-MAP] Imagen encontrada en item.producto.imagenes:`, imagenUrl);
              }
              
              // 3. Si aún no hay imagen, buscar en los productos cargados del catálogo
              if (!imagenUrl) {
                const productoEnCatalogo = productos.find(p => p.id_producto === item.id_producto);
                if (productoEnCatalogo) {
                  imagenUrl = productoEnCatalogo.imagen_url;
                  console.log(`📷 [AGREGAR-MAP] Imagen encontrada en catálogo para ${item.id_producto}:`, imagenUrl);
                }
              }
              
              // El backend retorna id_carrito_producto, usarlo directamente
              const idCarritoProducto = item.id_carrito_producto;
              console.log(`🔑 [AGREGAR-MAP] ID del item en carrito: ${idCarritoProducto} (para producto ${item.id_producto})`);
              
              // Verificar que tenemos el ID correcto antes de continuar
              if (!idCarritoProducto) {
                console.error(`❌ [AGREGAR-MAP] CRÍTICO: No se encontró id_carrito_producto para producto ${item.id_producto}`);
              }
              
              return {
                id: item.id_producto,
                id_producto: item.id_producto,
                id_carrito_producto: idCarritoProducto,
                nombre_producto: item.producto?.nombre_producto || '',
                precio: Number(item.precio_unitario) || 0,
                cantidad: Number(item.cantidad) || 1,
                stock: Number(item.producto?.stock) || 0,
                imagen_url: imagenUrl,
                producto: item.producto
              };
            }));
          }
        }
      }
    } catch (error) {
      console.error("❌ [AGREGAR] Error al agregar al carrito:", error);
      console.error("❌ [AGREGAR] Detalles del error:", error.response?.data);
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
      if (!itemToRemove) {
        console.warn("⚠️ [ELIMINAR] Producto no encontrado en carrito:", productoId);
        return;
      }

      console.log(`🗑️ [ELIMINAR] Producto encontrado:`, itemToRemove);
      console.log(`🗑️ [ELIMINAR] ID QUE SE ENVIARÁ AL API:`, itemToRemove.id_producto);
      console.log(`🗑️ [ELIMINAR] Eliminando producto del carrito: ID ${itemToRemove.id_producto} (${itemToRemove.nombre_producto})`);
      const response = await removeFromCartAPI(itemToRemove.id_producto);
      
      console.log(`📦 [ELIMINAR] Respuesta del servidor:`, response);
      
      if (response.success) {
        setCart(cart.filter(item => (item.id || item.id_producto) !== productoId));
        console.log(`✅ [ELIMINAR] Producto eliminado exitosamente del carrito`);
      }
    } catch (error) {
      console.error("❌ [ELIMINAR] Error al eliminar del carrito:", error);
      console.error("❌ [ELIMINAR] Detalles del error:", error.response?.data);
      alert(error.message || "Error al eliminar producto del carrito");
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (productoId, newQuantity) => {
    try {
      console.log(`📊 [CANTIDAD] Iniciando actualización de cantidad - Producto ID: ${productoId}, Nueva cantidad: ${newQuantity}`);
      
      if (newQuantity === 0) {
        console.log(`📊 [CANTIDAD] Cantidad es 0, eliminando producto...`);
        await removeFromCart(productoId);
        return;
      }

      const itemToUpdate = cart.find(item => (item.id || item.id_producto) === productoId);
      if (!itemToUpdate) {
        console.warn("⚠️ [CANTIDAD] Producto no encontrado en carrito:", productoId);
        return;
      }

      console.log(`📊 [CANTIDAD] Producto encontrado: ${itemToUpdate.nombre_producto} (ID Producto: ${itemToUpdate.id_producto})`);
      console.log(`📊 [CANTIDAD] Cantidad actual: ${itemToUpdate.cantidad}, Nueva cantidad: ${newQuantity}`);

      const producto = productos.find(p => (p.id || p.id_producto) === productoId);
      
      if (producto && newQuantity > producto.stock) {
        console.warn(`⚠️ [CANTIDAD] Stock insuficiente - Solicitado: ${newQuantity}, Disponible: ${producto.stock}`);
        alert(`No puedes agregar más de ${producto.stock} unidades`);
        return;
      }
      
      console.log(`📝 [CANTIDAD] Enviando actualización al backend: ID Carrito Producto ${itemToUpdate.id_carrito_producto} → Cantidad ${newQuantity}`);
      const response = await updateCartItemAPI(itemToUpdate.id_carrito_producto, newQuantity);
      
      console.log(`📦 [CANTIDAD] Respuesta del servidor:`, response);
      
      if (response.success) {
        console.log(`✅ [CANTIDAD] Actualizando estado local...`);
        setCart(cart.map(item =>
          (item.id || item.id_producto) === productoId
            ? { ...item, cantidad: newQuantity }
            : item
        ));
        console.log(`✅ [CANTIDAD] Cantidad actualizada exitosamente a ${newQuantity}`);
      } else {
        console.warn(`⚠️ [CANTIDAD] Response sin success`);
      }
    } catch (error) {
      console.error("❌ [CANTIDAD] Error al actualizar cantidad:", error);
      console.error("❌ [CANTIDAD] Detalles del error:", error.response?.data);
      console.error("❌ [CANTIDAD] Status code:", error.response?.status);
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
