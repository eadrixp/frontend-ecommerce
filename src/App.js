import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import LoginPage from "./modules/auth/LoginPage";
import DashboardPage from "./modules/dashboard/DashboardPage";
import ProductosPage from "./modules/products/ProductoPage";
import ClientesPage from "./modules/clientes/ClientesPage"; // tu página real de clientes
import CategoriasPage from "./modules/categories/CategoirasPage"; // tu página real de categorías
import DireccionPage from "./modules/direccion/DireccionPage";
import CatalogoPage from "./modules/catalogo/CatalogoPage";
import CheckoutPage from "./modules/checkout/CheckoutPage";

// Componentes
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Página principal (login) */}
      <Route path="/" element={<LoginPage />} />
      
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
            <DashboardLayout>
              <ClientesPage />
            </DashboardLayout>
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
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
