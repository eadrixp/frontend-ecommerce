import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getProductos, deleteProducto } from "../../services/productService";
import ProductoTable from "./ProductoTable";
import ProductoForm from "./ProductoForm";
import PageHeader from "../../components/layout/Header"; // ✅ Import correcto

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
    const confirm = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (confirm) {
      try {
        await deleteProducto(id);
        fetchProductos();
      } catch (err) {
        console.error("Error al eliminar producto:", err);
      }
    }
  };

  // 🔹 Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setProductoEdit(null);
    fetchProductos();
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>
        {/* ✅ HEADER DINÁMICO */}
        <PageHeader
          title="Gestión de Productos"
          onAdd={() => {
            setShowForm(!showForm);
            setProductoEdit(null);
          }}
          showForm={showForm}
          addButtonLabel="+ Nuevo Producto"
        />

        {showForm ? (
          <ProductoForm productoEdit={productoEdit} onClose={handleCloseForm} />
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
