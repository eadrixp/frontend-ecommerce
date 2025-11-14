import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TableProveedores from "../proveedores/TableProveedores";
import FormProveedores from "../proveedores/FormProveedores";
import {
  getProveedores,
  deleteProveedor,
} from "../../services/proveedoresService";

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Gestión de Proveedores
          </h2>
          <button
            onClick={() => {
              setShowForm(true);
              setProveedorEdit(null);
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
            + Nuevo Proveedor
          </button>
        </div>

        <TableProveedores
          proveedores={proveedores}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showForm && (
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
