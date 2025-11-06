import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/LoginPage";
import DashboardPage from "./modules/dashboard/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductosPage from "./modules/products/ProductoPage";

import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Página principal (login) */}
      <Route path="/" element={<LoginPage />} />

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

        {/* Placeholders temporales */}
        <Route
          path="/dashboard-productos"
          element={
            <DashboardLayout>
              <h2>Productos (en construcción)</h2>
            </DashboardLayout>
          }
        />
        <Route
          path="/clientes"
          element={
            <DashboardLayout>
              <h2>Clientes (en construcción)</h2>
            </DashboardLayout>
          }
        />
        <Route
          path="/categorias"
          element={
            <DashboardLayout>
              <h2>Categorías (en construcción)</h2>
            </DashboardLayout>
          }
        />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/productos" element={<ProductosPage />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
