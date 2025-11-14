import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { obtenerAlmacenes, crearAlmacen, actualizarAlmacen, eliminarAlmacen } from "../../services/almacenesService";
import AlmacenesTable from "./AlmacenesTable";
import AlmacenForm from "../almacenes/AlmacenesForm";

const AlmacenesPage = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [almacenEdit, setAlmacenEdit] = useState(null);

  const fetchAlmacenes = async () => {
    try {
      const data = await obtenerAlmacenes();
      setAlmacenes(data || []);
    } catch (error) {
      console.error("Error al obtener almacenes:", error);
    }
  };

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  const handleEdit = (almacen) => {
    setAlmacenEdit(almacen);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este almacén?");
    if (!confirmDelete) return;

    try {
      await eliminarAlmacen(id);
      fetchAlmacenes();
    } catch (error) {
      console.error("Error al eliminar almacén:", error);
    }
  };

  const handleNew = () => {
    setAlmacenEdit(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setAlmacenEdit(null);
    fetchAlmacenes();
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Gestión de Almacenes
          </h2>

          <button
            onClick={handleNew}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Nuevo Almacén
          </button>
        </div>

        <AlmacenesTable almacenes={almacenes} onEdit={handleEdit} onDelete={handleDelete} />

        {showForm && (
          <AlmacenForm
            almacenEdit={almacenEdit}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AlmacenesPage;
