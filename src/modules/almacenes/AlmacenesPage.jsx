import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { obtenerAlmacenes, eliminarAlmacen } from "../../services/almacenesService";
import AlmacenesTable from "./AlmacenesTable";
import AlmacenForm from "../almacenes/AlmacenesForm";
import PageHeader from "../../components/layout/Header"; // ✅ Header importado

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

  const handleCloseForm = () => {
    setShowForm(false);
    setAlmacenEdit(null);
    fetchAlmacenes();
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>

        {/* 🔹 HEADER ESTILO UNIFORME */}
        <PageHeader
          title="Gestión de Almacenes"
          onAdd={() => {
            setShowForm(!showForm);
            setAlmacenEdit(null);
          }}
          showForm={showForm}
          addButtonLabel="+ Nuevo Almacén"
        />

        {/* 🔹 TABLA O FORMULARIO */}
        {!showForm ? (
          <AlmacenesTable
            almacenes={almacenes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
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
