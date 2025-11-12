import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getClientes,
  deleteCliente,
} from "../../services/clientesService";
import TableClientes from "../clientes/TableClientes";
import ClienteForm from "../clientes/FormClientes";

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Gestión de Clientes
          </h2>
          <button
            onClick={() => {
              setShowForm(true);
              setClienteEdit(null);
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
            + Nuevo Cliente
          </button>
        </div>

        <TableClientes
          clientes={clientes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showForm && (
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
