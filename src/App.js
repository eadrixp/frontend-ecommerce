import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import LoginPage from "./modules/auth/LoginPage";
import UserRegisterPage from "./modules/auth/UserRegisterPage";
import ClienteRegisterPage from "./modules/auth/ClienteRegisterPage";
import DashboardPage from "./modules/dashboard/DashboardPage";
import ProductosPage from "./modules/products/ProductoPage";
import ClientesPage from "./modules/clientes/ClientesPage"; // tu página real de clientes
import CategoriasPage from "./modules/categories/CategoirasPage"; // tu página real de categorías
import DireccionPage from "./modules/direccion/DireccionPage";
import CatalogoPage from "./modules/catalogo/CatalogoPage";
import CheckoutPage from "./modules/checkout/CheckoutPage";
import UsuariosList from "./modules/usuarios/UsuarioList";
import ProveedoresPage from "./modules/proveedores/ProveedoresPage";
import AlmacenesPage from "./modules/almacenes/AlmacenesPage";
import CotizacionesPage from "./modules/cotizaciones/CotizacionesPage";

// Componentes
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Página principal (login) */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Registro de usuario inicial */}
      <Route path="/auth/register" element={<UserRegisterPage />} />
      
      {/* Registro de perfil de cliente */}
      <Route path="/cliente/registro" element={<ClienteRegisterPage />} />
      
      {/* Catálogo público para clientes */}
      <Route path="/catalogo" element={<CatalogoPage />} />
      
      {/* Checkout page para clientes autenticados */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Rutas protegidas con sidebar */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/productos"
          element={
            
              <ProductosPage />
            
          }
        />

        <Route
          path="/clientes"
          element={
            
              <ClientesPage />
            
          }
        />

        <Route
          path="/categorias"
          element={
            <DashboardLayout>
              <CategoriasPage />
            </DashboardLayout>
          }
        />
          <Route
          path="/direcciones"
          element={
            <DashboardLayout>
              <DireccionPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/usuarios"
          element={
            <DashboardLayout>
              <UsuariosList />
            </DashboardLayout>
          }
        />
         <Route
          path="/proveedores"
          element={
           
              <ProveedoresPage />
            
          }
        />
            <Route
          path="/almacenes"
          element={
           
              <AlmacenesPage />
            
          }
        />
                <Route
          path="/cotizaciones"
          element={
           
              <CotizacionesPage />
            
          }
        />
      </Route>

      

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
