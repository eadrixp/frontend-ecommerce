import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getProductos } from "../../services/productService";
import ProductoTable from "./ProductoTable";
import ProductoForm from "./ProductoForm";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Gestión de Productos
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showForm ? "Cerrar" : "+ Nuevo Producto"}
          </button>
        </div>

        {showForm ? (
          <ProductoForm onClose={() => setShowForm(false)} />
        ) : (
          <ProductoTable productos={productos} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductosPage;
