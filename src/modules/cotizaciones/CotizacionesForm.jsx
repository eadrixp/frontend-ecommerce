import React, { useEffect, useState } from "react";
import { createCotizacion, agregarMultiplesItems, actualizarMontos, actualizarNotasTerminos } from "../../services/cotizacionesService";
import { getClientes } from "../../services/clientesService";
import { getProductos } from "../../services/productService";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

const CotizacionesForm = ({ editingCotizacion, onClose }) => {
  // --- estado y lógica (idéntica a la tuya) ---
  const [currentStep, setCurrentStep] = useState(1);
  const [cotizacionId, setCotizacionId] = useState(editingCotizacion?.id_cotizacion || null);

  const [formData, setFormData] = useState({
    client: { id: null, name: "" },
    fecha_expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
    orders: [],
  });

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [currentOrder, setCurrentOrder] = useState({
    id_producto: null,
    descripcion: "",
    cantidad: 1,
    precio_unitario: 0,
    descuento_porcentaje: 0,
  });

  const [idUsuarioCreador, setIdUsuarioCreador] = useState(
    editingCotizacion?.id_usuario_creador || ""
  );

  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const lista = await getClientes();
        if (Array.isArray(lista)) setClientes(lista);
        else setClientes([]);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoadingProductos(true);
      try {
        const lista = await getProductos();
        if (Array.isArray(lista)) setProductos(lista);
        else setProductos([]);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (editingCotizacion) {
      setCotizacionId(editingCotizacion.id_cotizacion || editingCotizacion.id);
      setFormData((f) => ({
        ...f,
        client: {
          id: editingCotizacion.id_cliente || null,
          name: editingCotizacion.cliente_nombre || "",
        },
        fecha_expiracion: editingCotizacion.fecha_expiracion
          ? editingCotizacion.fecha_expiracion.split("T")[0]
          : f.fecha_expiracion,
        notes: editingCotizacion.notas || "",
        orders: [],
      }));
    }
  }, [editingCotizacion]);

  const calculateSubtotal = () =>
    formData.orders.reduce((sum, it) => {
      const line = (it.cantidad * it.precio_unitario) * (1 - (it.descuento_porcentaje || 0) / 100);
      return sum + Number(line || 0);
    }, 0);

  const calculateTotal = () => calculateSubtotal();

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.client.id) {
        alert("Por favor selecciona un cliente");
        return;
      }

      if (!cotizacionId) {
        try {
          const payload = {
            id_cliente: formData.client.id,
            fecha_expiracion: formData.fecha_expiracion,
            notas: formData.notes || "",
            id_usuario_creador: idUsuarioCreador,
          };

          const created = await createCotizacion(payload);
          setCotizacionId(created.id_cotizacion || created.id);
        } catch (err) {
          console.error("Error al crear cotización:", err);
          alert("No se pudo crear la cotización");
          return;
        }
      }
    }

    if (currentStep === 2 && formData.orders.length === 0) {
      alert("Agrega al menos un producto/servicio");
      return;
    }

    setCurrentStep((s) => Math.min(3, s + 1));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleAddOrderLocal = async () => {
    if (!currentOrder.descripcion || currentOrder.cantidad < 1 || !currentOrder.precio_unitario) {
      alert("Por favor selecciona un producto, ingresa cantidad y asegúrate que tenga precio");
      return;
    }

    const nuevoOrder = { ...currentOrder, id: Date.now() };
    setFormData((f) => ({
      ...f,
      orders: [...f.orders, nuevoOrder],
    }));

    if (cotizacionId) {
      try {
        const items = [{
          id_producto: currentOrder.id_producto || null,
          cantidad: currentOrder.cantidad,
          precio_unitario: currentOrder.precio_unitario,
          descuento_porcentaje: currentOrder.descuento_porcentaje || 0,
        }];
        await agregarMultiplesItems(cotizacionId, items);
      } catch (err) {
        console.error("Error al guardar item:", err, err.response?.data);
        alert("No se pudo guardar el item en el backend, pero se agregó localmente");
      }
    }

    setCurrentOrder({
      id_producto: null,
      descripcion: "",
      cantidad: 1,
      precio_unitario: 0,
      descuento_porcentaje: 0,
    });
  };

  const handleRemoveLocal = (id) =>
    setFormData((f) => ({ ...f, orders: f.orders.filter((o) => o.id !== id) }));

  const persistOrdersToBackend = async () => {
    if (!cotizacionId || formData.orders.length === 0) return;

    try {
      const items = formData.orders.map((o) => ({
        id_producto: o.id_producto || null,
        cantidad: o.cantidad,
        precio_unitario: o.precio_unitario,
        descuento_porcentaje: o.descuento_porcentaje || 0,
      }));

      await agregarMultiplesItems(cotizacionId, items);
      alert("Items guardados en la cotización");
    } catch (err) {
      console.error("Error al guardar items:", err);
      alert("No se pudieron guardar los items");
    }
  };

  const handleSubmitFinalize = async () => {
    if (!cotizacionId) {
      alert("Cotización no creada");
      return;
    }

    try {
      const subtotal = calculateSubtotal();
      const impuestos = 0;
      const total = calculateTotal();

      await actualizarMontos(cotizacionId, { subtotal, impuestos, total });
      await actualizarNotasTerminos(cotizacionId, {
        notas: formData.notes,
        terminosCondiciones: "",
      });

      alert("Cotización creada/actualizada correctamente");
      onClose();
    } catch (err) {
      console.error("Error al finalizar cotización:", err);
      alert("No se pudo finalizar la cotización");
    }
  };

  // --- ESTILOS INLINE (autocontenidos) ---
  const styles = {
    container: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      padding: 20,
      border: "1px solid #e6e9ee",
      maxWidth: 920,
      margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid #f1f3f6", paddingBottom: 12 },
    title: { fontSize: 20, fontWeight: 700, color: "#134e8a" },
    closeBtn: { color: "#c0392b", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer" },
    stepRow: { display: "flex", gap: 8, marginBottom: 18 },
    stepBox: (active, passed) => ({
      flex: 1,
      textAlign: "center",
      padding: "10px 8px",
      borderRadius: 10,
      fontWeight: 700,
      background: active ? "#0ea5a6" : passed ? "#16a34a" : "#f3f4f6",
      color: active || passed ? "#fff" : "#475569",
      boxShadow: active ? "0 6px 18px rgba(14,165,166,0.18)" : "none",
    }),
    section: { marginBottom: 14, background: "#fbfdff", padding: 14, borderRadius: 10 },
    input: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db", outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db", minHeight: 80, resize: "vertical" },
    label: { display: "block", marginBottom: 6, color: "#334155", fontWeight: 600, fontSize: 13 },
    grid4: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 },
    addBtn: { marginTop: 10, width: "100%", padding: "10px 12px", background: "#0ea5a6", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700 },
    productCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, border: "1px solid #eef2f7", background: "#fff" },
    price: { fontWeight: 800, color: "#075985" },
    dangerBtn: { padding: 8, borderRadius: 8, background: "transparent", border: "none", color: "#dc2626", cursor: "pointer" },
    footer: { display: "flex", justifyContent: "space-between", marginTop: 16 },
    navBtn: { padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700 },
    primaryBtn: { background: "#0b74ff", color: "#fff" },
    grayBtn: { background: "#f1f5f9", color: "#334155" },
    totalBox: { background: "#0f766e", color: "#fff", padding: 16, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  };

  // --- JSX (estilos inline) ---
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>{editingCotizacion ? "Editar Cotización" : "Nueva Cotización"}</div>
        <button onClick={onClose} style={styles.closeBtn}>Cerrar ✕</button>
      </div>

      {/* Steps */}
      <div style={styles.stepRow}>
        <div style={styles.stepBox(currentStep === 1, currentStep > 1)}>1. Cliente</div>
        <div style={styles.stepBox(currentStep === 2, currentStep > 2)}>2. Productos</div>
        <div style={styles.stepBox(currentStep === 3, currentStep > 3)}>3. Finalizar</div>
      </div>

      {/* Content */}
      <div>
        {currentStep === 1 && (
          <div style={styles.section}>
            <div style={{ marginBottom: 12 }}>
              <label style={styles.label}>Cliente *</label>
              <select
                style={styles.input}
                value={formData.client.id ? String(formData.client.id) : ""}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setFormData({
                      ...formData,
                      client: { id: null, name: "" },
                    });
                    return;
                  }
                  const selectedId = parseInt(e.target.value, 10);
                  const clienteSeleccionado = clientes.find((c) => c.id_cliente === selectedId);
                  setFormData({
                    ...formData,
                    client: {
                      id: clienteSeleccionado?.id_cliente || null,
                      name: clienteSeleccionado?.nombre || "",
                    },
                  });
                }}
                disabled={loadingClientes}
              >
                <option value="">-- Selecciona un cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={String(c.id_cliente)}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Fecha de expiración</label>
                <input
                  type="date"
                  style={styles.input}
                  value={formData.fecha_expiracion}
                  onChange={(e) => setFormData({ ...formData, fecha_expiracion: e.target.value })}
                />
              </div>
              <div style={{ width: 220 }}>
                <label style={styles.label}>ID Usuario Creador *</label>
                <input
                  type="number"
                  style={styles.input}
                  value={idUsuarioCreador}
                  onChange={(e) => setIdUsuarioCreador(e.target.value)}
                  placeholder="Ej: 1"
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Notas</label>
              <textarea style={styles.textarea} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div style={styles.section}>
              <div style={styles.grid4}>
                <select
                  value={currentOrder.id_producto || ""}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setCurrentOrder({
                        ...currentOrder,
                        id_producto: null,
                        descripcion: "",
                        precio_unitario: 0,
                      });
                      return;
                    }
                    const productoSeleccionado = productos.find(
                      (p) => String(p.id_producto || p.id) === e.target.value
                    );
                    const precio = parseFloat(productoSeleccionado?.precio || productoSeleccionado?.price || productoSeleccionado?.precioUnitario || 0);
                    const nombre = productoSeleccionado?.nombre_producto || productoSeleccionado?.nombre || productoSeleccionado?.name || "";
                    setCurrentOrder({
                      ...currentOrder,
                      id_producto: productoSeleccionado?.id_producto || productoSeleccionado?.id || null,
                      descripcion: nombre,
                      precio_unitario: precio,
                    });
                  }}
                  disabled={loadingProductos}
                  style={styles.input}
                >
                  <option value="">-- Selecciona un producto --</option>
                  {productos.map((p) => (
                    <option key={p.id_producto || p.id} value={String(p.id_producto || p.id)}>
                      {p.nombre_producto || p.nombre || p.name} (Q{Number(p.precio || p.price || p.precioUnitario || 0).toFixed(2)})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={currentOrder.cantidad}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      cantidad: parseInt(e.target.value || "1"),
                    })
                  }
                  style={styles.input}
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Precio unitario"
                  value={currentOrder.precio_unitario}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      precio_unitario: parseFloat(e.target.value || "0"),
                    })
                  }
                  style={styles.input}
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentOrder.descuento_porcentaje}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      descuento_porcentaje: parseFloat(e.target.value || "0"),
                    })
                  }
                  style={styles.input}
                  placeholder="% descuento"
                />
              </div>

              <button type="button" onClick={handleAddOrderLocal} style={styles.addBtn}>
                <span style={{ marginRight: 8, display: "inline-flex", verticalAlign: "middle" }}><Plus size={16} /></span>
                Agregar
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              {formData.orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: 20, borderRadius: 10, background: "#f8fafc", color: "#64748b" }}>
                  No hay productos agregados
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {formData.orders.map((o) => (
                    <div key={o.id} style={styles.productCard}>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{o.descripcion}</div>
                        <div style={{ color: "#64748b", fontSize: 13 }}>Cantidad: {o.cantidad} • Q{o.precio_unitario.toFixed(2)}</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={styles.price}>
                          Q{(o.cantidad * o.precio_unitario * (1 - (o.descuento_porcentaje || 0) / 100)).toFixed(2)}
                        </div>
                        <button onClick={() => handleRemoveLocal(o.id)} style={styles.dangerBtn}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: 12, borderRadius: 8, background: "#ecfeff", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, color: "#064e3b" }}>
                    <div>Subtotal</div>
                    <div>Q{calculateSubtotal().toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div style={styles.section}>
              <h4 style={{ margin: 0, marginBottom: 8 }}>Cliente</h4>
              <div style={{ padding: 10, background: "#fff", borderRadius: 8 }}>
                <div style={{ fontWeight: 700 }}>{formData.client.name}</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Expira: {formData.fecha_expiracion}</div>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <h4 style={{ marginBottom: 8 }}>Productos / Servicios</h4>
              <div style={{ display: "grid", gap: 10 }}>
                {formData.orders.map((o) => (
                  <div key={o.id} style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #eef2f7" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{o.descripcion}</div>
                        <div style={{ color: "#64748b", fontSize: 13 }}>{o.cantidad} × Q{o.precio_unitario.toFixed(2)}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: "#0f172a" }}>
                        Q{(o.cantidad * o.precio_unitario * (1 - (o.descuento_porcentaje || 0) / 100)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Notas adicionales</label>
              <textarea style={styles.textarea} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>

            <div style={styles.totalBox}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Total de la Cotización</div>
              <div style={{ fontSize: 20 }}>Q{calculateTotal().toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Nav */}
      <div style={styles.footer}>
        <div>
          {currentStep > 1 ? (
            <button onClick={handlePrev} style={{ ...styles.navBtn, ...styles.grayBtn }}>
              <span style={{ marginRight: 8 }}><ChevronLeft size={16} /></span>Anterior
            </button>
          ) : (
            <div />
          )}
        </div>

        <div>
          {currentStep < 3 ? (
            <button onClick={handleNext} style={{ ...styles.navBtn, ...styles.primaryBtn }}>
              Siguiente <span style={{ marginLeft: 8 }}><ChevronRight size={16} /></span>
            </button>
          ) : (
            <>
              <button onClick={handleSubmitFinalize} style={{ ...styles.navBtn, background: "#059669", color: "#fff", marginRight: 8 }}>
                Finalizar y Guardar
              </button>
              <button onClick={onClose} style={{ ...styles.navBtn, ...styles.grayBtn }}>Cerrar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CotizacionesForm;
