import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getProductos,
  deleteProducto,
} from "../../services/productService";
import ProductoTable from "./ProductoTable";
import ProductoForm from "./ProductoForm";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  // 🔹 Cargar productos desde el backend
  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Editar producto
  const handleEdit = (producto) => {
    setProductoEdit(producto);
    setShowForm(true);
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );
    if (confirm) {
      try {
        await deleteProducto(id);
        fetchProductos(); // recargar lista
      } catch (err) {
        console.error("Error al eliminar producto:", err);
      }
    }
  };

  // 🔹 Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setProductoEdit(null);
    fetchProductos(); // recargar lista después de guardar/editar
  };

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
            onClick={() => {
              setShowForm(!showForm);
              setProductoEdit(null); // limpiar edición si se abre nuevo formulario
            }}
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
          <ProductoForm
            productoEdit={productoEdit}
            onClose={handleCloseForm}
          />
        ) : (
          <ProductoTable
            productos={productos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductosPage;
