import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TableProveedores from "../proveedores/TableProveedores";
import FormProveedores from "../proveedores/FormProveedores";
import { getProveedores, deleteProveedor } from "../../services/proveedoresService";
import PageHeader from "../../components/layout/Header"; // ✅ Header importado

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [proveedorEdit, setProveedorEdit] = useState(null);

  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data?.proveedores || []);
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleEdit = (proveedor) => {
    setProveedorEdit(proveedor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este proveedor?");
    if (confirmDelete) {
      try {
        await deleteProveedor(id);
        fetchProveedores();
      } catch (err) {
        console.error("Error al eliminar proveedor:", err);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setProveedorEdit(null);
    fetchProveedores();
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>

        {/* 🔹 HEADER ESTILO UNIFORME */}
        <PageHeader
          title="Gestión de Proveedores"
          onAdd={() => {
            setShowForm(!showForm);
            setProveedorEdit(null);
          }}
          showForm={showForm}
          addButtonLabel="+ Nuevo Proveedor"
        />

        {/* 🔹 TABLA O FORMULARIO */}
        {!showForm ? (
          <TableProveedores
            proveedores={proveedores}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <FormProveedores
            proveedorEdit={proveedorEdit}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProveedoresPage;
