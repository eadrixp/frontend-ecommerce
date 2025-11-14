import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getClientes,
  deleteCliente,
} from "../../services/clientesService";
import TableClientes from "../clientes/TableClientes";
import ClienteForm from "../clientes/FormClientes";
import PageHeader from "../../components/layout/Header"; // ✅ Import del header

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [clienteEdit, setClienteEdit] = useState(null);

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEdit = (cliente) => {
    setClienteEdit(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este cliente?")) {
      await deleteCliente(id);
      fetchClientes();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setClienteEdit(null);
    fetchClientes();
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>

        {/* 🔹 HEADER EXACTO IGUAL AL DE PRODUCTOS */}
        <PageHeader
          title="Gestión de Clientes"
          onAdd={() => {
            setShowForm(!showForm);
            setClienteEdit(null);
          }}
          showForm={showForm}
          addButtonLabel="+ Nuevo Cliente"
        />

        {/* 🔹 TABLA O FORMULARIO */}
        {!showForm ? (
          <TableClientes
            clientes={clientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ClienteForm
            clienteEdit={clienteEdit}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientesPage;
