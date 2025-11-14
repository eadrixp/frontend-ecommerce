import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const CotizacionDetalle = ({ cotizacion, onEdit, onDelete }) => {
  const cot = cotizacion;
  const items = cot.items || [];

  const subtotal =
    cot.subtotal ??
    cot.resumen?.subtotal ??
    items.reduce(
      (s, it) => s + Number(it.subtotal || it.cantidad * it.precio_unitario),
      0
    );
  const total = cot.total ?? cot.resumen?.total ?? subtotal;
  const impuestos = cot.impuestos ?? cot.resumen?.impuestos ?? 0;

  return (
    <div style={card}>
      {/* Header */}
      <div style={header}>
        <div>
          <h2 style={title}>{cot.numero_cotizacion || cot.numero}</h2>
          <div style={status}>Estado: {cot.estado || cot.estado_cotizacion || "—"}</div>
        </div>
        <div style={actions}>
          <button onClick={onEdit} style={btnEdit}>
            <Edit2 style={icon} /> Editar
          </button>
          <button onClick={onDelete} style={btnDelete}>
            <Trash2 style={icon} /> Eliminar
          </button>
        </div>
      </div>

      {/* Cliente / Fechas */}
      <div style={grid}>
        <div style={infoBox}>
          <div style={label}>Cliente</div>
          <div style={value}>{cot.cliente_nombre || cot.cliente?.name || "—"}</div>
          {cot.cliente_email && <div style={small}>{cot.cliente_email}</div>}
          {cot.cliente_telefono && <div style={small}>{cot.cliente_telefono}</div>}
        </div>
        <div style={infoBox}>
          <div style={label}>Creada</div>
          <div style={value}>
            {cot.fecha_creacion ? new Date(cot.fecha_creacion).toLocaleDateString("es-GT") : "-"}
          </div>
        </div>
        <div style={infoBox}>
          <div style={label}>Expira</div>
          <div style={value}>
            {cot.fecha_expiracion ? new Date(cot.fecha_expiracion).toLocaleDateString("es-GT") : "-"}
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={sectionTitle}>Productos / Servicios</h3>
        {items.length === 0 ? (
          <div style={emptyBox}>No hay productos agregados a esta cotización</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {items.map((it) => (
              <div key={it.id_cotizacion_item || it.id} style={itemRow}>
                <div>
                  <div style={itemDesc}>{it.descripcion || `Producto ${it.id_producto}`}</div>
                  <div style={small}>
                    Cantidad: {it.cantidad} × Q{Number(it.precio_unitario).toFixed(2)}
                  </div>
                  {it.descuento_porcentaje && (
                    <div style={small}>Descuento: {it.descuento_porcentaje}%</div>
                  )}
                </div>
                <div style={itemTotal}>
                  Q{Number(it.subtotal || it.cantidad * it.precio_unitario).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notas */}
      {cot.notas && (
        <div style={notesBox}>
          <h4 style={{ marginBottom: "6px" }}>Notas</h4>
          <p style={{ margin: 0 }}>{cot.notas}</p>
        </div>
      )}

      {/* Totales */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px" }}>
        <div style={totalRow}>
          <div style={small}>Subtotal</div>
          <div style={bold}>Q{Number(subtotal).toFixed(2)}</div>
        </div>
        <div style={totalRow}>
          <div style={small}>Impuestos</div>
          <div style={bold}>Q{Number(impuestos).toFixed(2)}</div>
        </div>
        <div style={totalFinal}>
          <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2563eb" }}>
            Q{Number(total).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const card = { backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" };
const title = { fontSize: "1.75rem", fontWeight: "700", margin: 0 };
const status = { fontSize: "0.875rem", color: "#6b7280" };
const actions = { display: "flex", gap: "10px" };
const btnEdit = { backgroundColor: "#2563eb", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" };
const btnDelete = { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" };
const icon = { width: "16px", height: "16px" };

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" };
const infoBox = { backgroundColor: "#f9fafb", padding: "12px", borderRadius: "8px" };
const label = { fontSize: "0.75rem", color: "#6b7280", marginBottom: "4px" };
const value = { fontWeight: 500 };
const small = { fontSize: "0.875rem", color: "#4b5563" };

const sectionTitle = { fontWeight: 600, fontSize: "1.125rem", marginBottom: "10px" };
const emptyBox = { backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", textAlign: "center", color: "#6b7280" };
const itemRow = { display: "flex", justifyContent: "space-between", backgroundColor: "#f3f4f6", padding: "10px", borderRadius: "8px" };
const itemDesc = { fontWeight: 500 };
const itemTotal = { fontWeight: 600 };

const notesBox = { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "8px", marginBottom: "20px" };

const totalRow = { display: "flex", justifyContent: "space-between", marginBottom: "6px" };
const bold = { fontWeight: 600 };
const totalFinal = { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#eff6ff", padding: "10px", borderRadius: "8px" };

export default CotizacionDetalle;
