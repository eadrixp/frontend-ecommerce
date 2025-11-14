import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getCotizaciones,
  getCotizacionById,
  createCotizacion,
  deleteCotizacion,
} from "../../services/cotizacionesService";
import { getClientes } from "../../services/clientesService";
import {
  getItemsByCotizacion,
  getResumenCotizacion,
  agregarItemACotizacion,
  agregarMultiplesItems,
} from "../../services/cotizacionesService"; // items están en el mismo servicio
import CotizacionesForm from "./CotizacionesForm";
import CotizacionDetalle from "./CotizacionDetalle";
import { Search, Plus, Eye, Trash2 } from "lucide-react";

const CotizacionesPage = () => {
  const [view, setView] = useState("list"); // list | form | details
  const [cotizaciones, setCotizaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const [editingCotizacion, setEditingCotizacion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCotizaciones = async () => {
    try {
      setLoading(true);
      const data = await getCotizaciones();
      
      // El backend retorna {cotizaciones: [...]}
      let cotizacionesList = Array.isArray(data) ? data : (data?.cotizaciones || []);
      
      // Obtener los nombres de clientes para cada cotización
      const clientes = await getClientes();
      
      const cotizacionesConClientes = cotizacionesList.map((cot) => {
        const cliente = clientes.find(c => c.id_cliente === cot.id_cliente);
        return {
          ...cot,
          cliente_nombre: cliente?.nombre || "Cliente sin nombre"
        };
      });
      
      setCotizaciones(cotizacionesConClientes);
    } catch (err) {
      console.error("Error al obtener cotizaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const handleNew = () => {
    setEditingCotizacion(null);
    setView("form");
  };

  const handleEdit = (cotizacion) => {
    setEditingCotizacion(cotizacion);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta cotización?")) return;
    try {
      await deleteCotizacion(id);
      await fetchCotizaciones();
      if (selectedCotizacion?.id_cotizacion === id) {
        setSelectedCotizacion(null);
        setView("list");
      }
    } catch (err) {
      console.error("Error al eliminar cotización:", err);
      alert("No se pudo eliminar la cotización");
    }
  };

  const handleViewDetails = async (cotizacion) => {
    try {
      // Obtener cotización actualizada + items + resumen
      const full = await getCotizacionById(cotizacion.id_cotizacion || cotizacion.id);
      const items = await getItemsByCotizacion(full.id_cotizacion || full.id);
      const resumen = await getResumenCotizacion(full.id_cotizacion || full.id);
      
      console.log("Cotización completa:", full);
      console.log("Items obtenidos:", items);
      console.log("Resumen:", resumen);
      
      // Items podría venir como array o dentro de una propiedad
      const itemsList = Array.isArray(items) ? items : (items?.items || items?.data || []);
      
      setSelectedCotizacion({
        ...full,
        items: itemsList,
        resumen,
      });
      setView("details");
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      alert("No se pudo cargar el detalle de la cotización");
    }
  };

  const handleFormClose = async () => {
    setView("list");
    setEditingCotizacion(null);
    await fetchCotizaciones();
  };

  const filtered = cotizaciones.filter((c) => {
    const q = (searchTerm || "").toLowerCase();
    return (
      (c.numero_cotizacion || c.numero || "").toLowerCase().includes(q) ||
      (c.cliente_nombre || c.cliente?.name || "").toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Cotizaciones</h1>
            <p className="text-sm text-gray-600">Crear, editar y revisar cotizaciones</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número o cliente..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <button
              onClick={handleNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Nueva Cotización
            </button>
          </div>
        </div>

        {view === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.length === 0 ? (
              <div style={{ background: "white", borderRadius: "8px", padding: "40px", textAlign: "center", color: "#999" }}>
                No se encontraron cotizaciones
              </div>
            ) : (
              filtered.map((cot) => {
                let estadoColor = "#f3f4f6";
                let estadoTextColor = "#374151";
                
                if (cot.estado === "borrador") {
                  estadoColor = "#fef08a";
                  estadoTextColor = "#854d0e";
                } else if (cot.estado === "enviada") {
                  estadoColor = "#dbeafe";
                  estadoTextColor = "#1e40af";
                } else if (cot.estado === "aceptada") {
                  estadoColor = "#dcfce7";
                  estadoTextColor = "#15803d";
                } else if (cot.estado === "rechazada") {
                  estadoColor = "#fee2e2";
                  estadoTextColor = "#991b1b";
                }

                return (
                  <div
                    key={cot.id_cotizacion || cot.id}
                    style={{
                      background: "white",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      borderLeft: "4px solid #3b82f6",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px" }}>
                      {/* Información principal */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div>
                            <h3 style={{ fontWeight: "bold", fontSize: "18px", color: "#1f2937" }}>
                              {cot.numero_cotizacion || cot.numero || cot.numeroCotizacion}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>
                              {cot.cliente_nombre || cot.cliente?.name || "Cliente sin nombre"}
                            </p>
                            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                              {cot.fecha_creacion
                                ? new Date(cot.fecha_creacion).toLocaleDateString("es-GT")
                                : cot.fecha || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Estado */}
                      <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                        <div style={{ display: "inline-block" }}>
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "9999px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: estadoColor,
                              color: estadoTextColor,
                            }}
                          >
                            {cot.estado || "—"}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div style={{ paddingLeft: "16px", paddingRight: "16px", textAlign: "right" }}>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Total</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
                          Q{" "}
                          {Number(cot.total || cot.monto_total || 0).toLocaleString(
                            "es-GT",
                            { minimumFractionDigits: 2 }
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div style={{ display: "flex", gap: "8px", paddingLeft: "16px" }}>
                        <button
                          title="Ver detalle"
                          onClick={() => handleViewDetails(cot)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "none",
                            background: "transparent",
                            color: "#2563eb",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => handleDelete(cot.id_cotizacion || cot.id)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "none",
                            background: "transparent",
                            color: "#ef4444",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {view === "form" && (
          <CotizacionesForm
            editingCotizacion={editingCotizacion}
            onClose={handleFormClose}
            agregarItemACotizacion={agregarItemACotizacion}
            agregarMultiplesItems={agregarMultiplesItems}
            createCotizacion={createCotizacion}
          />
        )}

        {view === "details" && selectedCotizacion && (
          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedCotizacion(null);
                setView("list");
              }}
              className="mb-4 text-sm text-gray-600"
            >
              ← Volver
            </button>

            <CotizacionDetalle
              cotizacion={selectedCotizacion}
              onEdit={() => {
                handleEdit(selectedCotizacion);
              }}
              onDelete={() => handleDelete(selectedCotizacion.id_cotizacion || selectedCotizacion.id)}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CotizacionesPage;
