import React from "react";
import { Edit2, Trash2, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // -----------------------------------
  //          GENERAR PDF
  // -----------------------------------
  const handlePrintPDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
    });

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Nexxus Technology", 40, 50);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Cotización / Propuesta Comercial", 40, 70);

    // Número
    doc.setFont("helvetica", "bold");
    doc.text(`No. ${cot.numero_cotizacion || cot.numero}`, 400, 50);

    // Fechas
    doc.setFont("helvetica", "normal");
    doc.text(
      `Fecha creación: ${
        cot.fecha_creacion
          ? new Date(cot.fecha_creacion).toLocaleDateString("es-GT")
          : "-"
      }`,
      400,
      70
    );

    doc.text(
      `Válida hasta: ${
        cot.fecha_expiracion
          ? new Date(cot.fecha_expiracion).toLocaleDateString("es-GT")
          : "-"
      }`,
      400,
      85
    );

    // Datos cliente
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Datos del Cliente", 40, 120);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Nombre: ${cot.cliente_nombre || "—"}`, 40, 140);
    cot.cliente_email && doc.text(`Email: ${cot.cliente_email}`, 40, 155);
    cot.cliente_telefono &&
      doc.text(`Teléfono: ${cot.cliente_telefono}`, 40, 170);

    // Tabla
    autoTable(doc, {
      startY: 200,
      head: [["Descripción", "Cantidad", "Precio", "Subtotal"]],
      body: items.map((it) => [
        it.descripcion || `Producto ${it.id_producto}`,
        it.cantidad,
        `Q ${Number(it.precio_unitario).toFixed(2)}`,
        `Q ${Number(
          it.subtotal || it.cantidad * it.precio_unitario
        ).toFixed(2)}`,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [109, 40, 217] },
    });

    // Totales
    let y = doc.lastAutoTable.finalY + 30;

    doc.setFont("helvetica", "bold");
    doc.text("Totales", 40, y);

    doc.setFont("helvetica", "normal");
    y += 20;
    doc.text(`Subtotal: Q${Number(subtotal).toFixed(2)}`, 40, y);
    y += 15;
    doc.text(`Impuestos: Q${Number(impuestos).toFixed(2)}`, 40, y);
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`TOTAL: Q${Number(total).toFixed(2)}`, 40, y);

    // Notas
    if (cot.notas) {
      y += 40;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Notas:", 40, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const split = doc.splitTextToSize(cot.notas, 500);
      doc.text(split, 40, y + 20);
    }

    doc.save(`Cotizacion-${cot.numero_cotizacion || cot.numero}.pdf`);
  };

  // -----------------------------------
  //     RENDER (con estilos ok)
  // -----------------------------------

  return (
    <div style={card}>
      <div style={header}>
        <div>
          <h2 style={title}>{cot.numero_cotizacion || cot.numero}</h2>
          <div style={status}>
            Estado: {cot.estado || cot.estado_cotizacion || "—"}
          </div>
        </div>

        <div style={actions}>
          <button onClick={handlePrintPDF} style={btnPrint}>
            <Printer style={icon} /> Descargar PDF
          </button>

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
          <div style={value}>
            {cot.cliente_nombre || cot.cliente?.name || "—"}
          </div>
          {cot.cliente_email && <div style={small}>{cot.cliente_email}</div>}
          {cot.cliente_telefono && (
            <div style={small}>{cot.cliente_telefono}</div>
          )}
        </div>

        <div style={infoBox}>
          <div style={label}>Creada</div>
          <div style={value}>
            {cot.fecha_creacion
              ? new Date(cot.fecha_creacion).toLocaleDateString("es-GT")
              : "-"}
          </div>
        </div>

        <div style={infoBox}>
          <div style={label}>Expira</div>
          <div style={value}>
            {cot.fecha_expiracion
              ? new Date(cot.fecha_expiracion).toLocaleDateString("es-GT")
              : "-"}
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
                  <div style={itemDesc}>
                    {it.descripcion || `Producto ${it.id_producto}`}
                  </div>
                  <div style={small}>
                    Cantidad: {it.cantidad} × Q
                    {Number(it.precio_unitario).toFixed(2)}
                  </div>
                  {it.descuento_porcentaje && (
                    <div style={small}>
                      Descuento: {it.descuento_porcentaje}%
                    </div>
                  )}
                </div>

                <div style={itemTotal}>
                  Q
                  {Number(
                    it.subtotal || it.cantidad * it.precio_unitario
                  ).toFixed(2)}
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
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#2563eb",
            }}
          >
            Q{Number(total).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotizacionDetalle;

/* ------------------------------------------
                ESTILOS
------------------------------------------- */

const card = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  marginBottom: "20px",
};

const title = { fontSize: "1.75rem", fontWeight: "700", margin: 0 };
const status = { fontSize: "0.875rem", color: "#6b7280" };

const actions = { display: "flex", gap: "10px" };

const btnPrint = {
  backgroundColor: "#6d28d9",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const btnEdit = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const btnDelete = {
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const icon = { width: "16px", height: "16px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const infoBox = {
  backgroundColor: "#f9fafb",
  padding: "12px",
  borderRadius: "8px",
};

const label = {
  fontSize: "0.75rem",
  color: "#6b7280",
  marginBottom: "4px",
};

const value = { fontWeight: 500 };
const small = { fontSize: "0.875rem", color: "#4b5563" };

const sectionTitle = {
  fontWeight: 600,
  fontSize: "1.125rem",
  marginBottom: "10px",
};

const emptyBox = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  color: "#6b7280",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#f3f4f6",
  padding: "10px",
  borderRadius: "8px",
};

const itemDesc = { fontWeight: 500 };
const itemTotal = { fontWeight: 600 };

const notesBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "6px",
};

const bold = { fontWeight: 600 };

const totalFinal = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#eff6ff",
  padding: "10px",
  borderRadius: "8px",
};
