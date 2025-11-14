import React, { useEffect, useState } from "react";
import { createCotizacion, agregarMultiplesItems, actualizarMontos, actualizarNotasTerminos } from "../../services/cotizacionesService";
import { getClientes } from "../../services/clientesService";
import { getProductos } from "../../services/productService";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

const CotizacionesForm = ({ editingCotizacion, onClose }) => {
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

  // INGRESO MANUAL TEMPORAL
  const [idUsuarioCreador, setIdUsuarioCreador] = useState(
    editingCotizacion?.id_usuario_creador || ""
  );

  // --- Obtener clientes registrados ---
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const lista = await getClientes();
        console.log("Clientes obtenidos:", lista);

        if (Array.isArray(lista)) {
          setClientes(lista);
        } else {
          console.warn("El backend no devolvió un array. Resultado:", lista);
          setClientes([]);
        }
      } catch (err) {
        console.error("Error al obtener clientes:", err);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  // --- Obtener productos registrados ---
  useEffect(() => {
    const fetchProductos = async () => {
      setLoadingProductos(true);
      try {
        const lista = await getProductos();
        console.log("Productos obtenidos:", lista);
        if (lista.length > 0) {
          console.log("Primer producto estructura:", lista[0]);
        }

        if (Array.isArray(lista)) {
          setProductos(lista);
        } else {
          console.warn("El backend no devolvió un array. Resultado:", lista);
          setProductos([]);
        }
      } catch (err) {
        console.error("Error al obtener productos:", err);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  // --- Cargar datos al editar ---
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

  // ===============================
  // HELPERS
  // ===============================
  const calculateSubtotal = () =>
    formData.orders.reduce((sum, it) => {
      const line = (it.cantidad * it.precio_unitario) * (1 - (it.descuento_porcentaje || 0) / 100);
      return sum + Number(line || 0);
    }, 0);

  const calculateTotal = () => calculateSubtotal();

  // ===============================
  // NAVEGACIÓN
  // ===============================
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

  // ===============================
  // ITEMS LOCALES
  // ===============================
  const handleAddOrderLocal = async () => {
    if (!currentOrder.descripcion || currentOrder.cantidad < 1 || !currentOrder.precio_unitario) {
      alert("Por favor selecciona un producto, ingresa cantidad y asegúrate que tenga precio");
      return;
    }

    // Agregar a la lista local
    const nuevoOrder = { ...currentOrder, id: Date.now() };
    setFormData((f) => ({
      ...f,
      orders: [...f.orders, nuevoOrder],
    }));

    // Guardar en el backend automáticamente si existe cotizacionId
    if (cotizacionId) {
      try {
        const items = [{
          id_producto: currentOrder.id_producto || null,
          cantidad: currentOrder.cantidad,
          precio_unitario: currentOrder.precio_unitario,
          descuento_porcentaje: currentOrder.descuento_porcentaje || 0,
        }];
        
        console.log("Items a enviar al backend:", items);
        console.log("CotizacionId:", cotizacionId);
        
        await agregarMultiplesItems(cotizacionId, items);
        console.log("Item guardado en el backend");
      } catch (err) {
        console.error("Error al guardar item:", err);
        console.error("Respuesta del servidor:", err.response?.data);
        alert("No se pudo guardar el item en el backend, pero se agregó localmente");
      }
    } else {
      console.log("No hay cotizacionId, el item solo se guardó localmente");
    }

    // Limpiar el formulario
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

  // ===============================
  // FINALIZAR
  // ===============================
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {editingCotizacion ? "Editar Cotización" : "Nueva Cotización"}
        </h2>
        <button onClick={onClose} className="text-gray-600">
          Cancelar
        </button>
      </div>

      {/* STEPS */}
      <div className="flex gap-4 mb-6">
        <div className={`p-3 rounded-lg ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>1. Cliente</div>
        <div className={`p-3 rounded-lg ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>2. Productos</div>
        <div className={`p-3 rounded-lg ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>3. Finalizar</div>
      </div>

      {/* STEP CONTENT */}
      <div>
        {currentStep === 1 && (
          <div className="space-y-4">

            {/* SELECT CLIENTE */}
            <div>
              <label className="block text-sm font-medium">Cliente *</label>
              <select
                className="w-full border rounded p-2"
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

            {/* FECHA */}
            <div>
              <label className="block text-sm font-medium">Fecha de expiración</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={formData.fecha_expiracion}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_expiracion: e.target.value })
                }
              />
            </div>

            {/* NOTAS */}
            <div>
              <label className="block text-sm font-medium">Notas</label>
              <textarea
                className="w-full border rounded p-2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {/* ID USUARIO TEMPORAL */}
            <div>
              <label className="block text-sm font-medium">ID Usuario Creador *</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={idUsuarioCreador}
                onChange={(e) => setIdUsuarioCreador(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
          </div>
        )}

        {/* PASO 2 Y PASO 3 SIN CAMBIOS IMPORTANTES... */}
        {/* (tu código de paso 2 y paso 3 lo mantengo idéntico, solo corregí referencias a nombre) */}

        {currentStep === 2 && (
          <div>
            <div className="mb-4 bg-gray-50 rounded p-4">
              <div className="grid md:grid-cols-3 gap-3">
                {/* SELECT PRODUCTO */}
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
                    
                    console.log("Producto seleccionado:", productoSeleccionado);
                    
                    if (productoSeleccionado) {
                      const precio = parseFloat(productoSeleccionado?.precio || productoSeleccionado?.price || productoSeleccionado?.precioUnitario || 0);
                      const nombre = productoSeleccionado?.nombre_producto || productoSeleccionado?.nombre || productoSeleccionado?.name || "";
                      
                      console.log("Precio extraído:", precio);
                      console.log("Nombre extraído:", nombre);
                      
                      setCurrentOrder({
                        ...currentOrder,
                        id_producto: productoSeleccionado?.id_producto || productoSeleccionado?.id || null,
                        descripcion: nombre,
                        precio_unitario: precio,
                      });
                    }
                  }}
                  disabled={loadingProductos}
                  className="col-span-2 border rounded p-2"
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
                  className="border rounded p-2"
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
                  className="border rounded p-2"
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
                  className="border rounded p-2"
                  placeholder="% descuento"
                />

                <button
                  type="button"
                  onClick={handleAddOrderLocal}
                  className="col-span-1 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>
            </div>

            {formData.orders.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded">
                No hay productos agregados
              </div>
            ) : (
              <div className="space-y-3">
                {formData.orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between bg-white border rounded p-3"
                  >
                    <div>
                      <div className="font-medium">{o.descripcion}</div>
                      <div className="text-sm text-gray-600">
                        Cantidad: {o.cantidad} • Q{o.precio_unitario.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        Q
                        {(
                          o.cantidad *
                          o.precio_unitario *
                          (1 - (o.descuento_porcentaje || 0) / 100)
                        ).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveLocal(o.id)}
                        className="text-red-500 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center bg-blue-50 rounded p-3">
                  <div>Subtotal</div>
                  <div className="font-bold">
                    Q{calculateSubtotal().toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Cliente */}
            <div>
              <h4 className="font-semibold">Cliente</h4>
              <div className="bg-gray-50 p-3 rounded">
                <div>{formData.client.name}</div>
                <div className="text-sm text-gray-600">
                  Expira: {formData.fecha_expiracion}
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold">Productos / Servicios</h4>
              <div className="space-y-2">
                {formData.orders.map((o) => (
                  <div key={o.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{o.descripcion}</div>
                        <div className="text-sm text-gray-600">
                          Cantidad: {o.cantidad} × Q{o.precio_unitario.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-bold">
                        Q
                        {(
                          o.cantidad *
                          o.precio_unitario *
                          (1 - (o.descuento_porcentaje || 0) / 100)
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Notas adicionales
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {/* Total */}
            <div className="bg-blue-600 text-white p-4 rounded flex justify-between items-center">
              <div className="font-semibold">Total de la Cotización</div>
              <div className="text-2xl font-bold">
                Q{calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex gap-3 mt-6 justify-between">
        {currentStep > 1 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-200 rounded flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubmitFinalize}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Finalizar y Guardar
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CotizacionesForm;
