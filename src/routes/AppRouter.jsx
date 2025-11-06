import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/LoginPage";
import DashboardPage from "../modules/dashboard/DashboardPage";
import PrivateRoute from "../components/PrivateRoute";
import ProductosPage from "../modules/products/ProductoPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard-products" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
