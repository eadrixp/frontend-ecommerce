import React from "react";
import { Edit2, Trash2, Mail, Phone, Calendar, FileCheck, DollarSign } from "lucide-react";

const CotizacionDetalle = ({ cotizacion, onEdit, onDelete }) => {
  const cot = cotizacion;
  const items = cot.items || [];

  const subtotal = cot.subtotal ?? cot.resumen?.subtotal ?? items.reduce((s, it) => s + Number(it.subtotal || (it.cantidad * it.precio_unitario)), 0);
  const total = cot.total ?? cot.resumen?.total ?? subtotal;
  const impuestos = cot.impuestos ?? cot.resumen?.impuestos ?? 0;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{cot.numero_cotizacion || cot.numero}</h2>
          <div className="text-sm text-gray-600">Estado: {cot.estado || cot.estado_cotizacion || "—"}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={onEdit} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Editar
          </button>
          <button onClick={onDelete} className="bg-red-50 text-red-600 px-4 py-2 rounded flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded p-4">
          <div className="text-sm text-gray-600 mb-1">Cliente</div>
          <div className="font-medium">{cot.cliente_nombre || cot.cliente?.name || "—"}</div>
          {cot.cliente_email && <div className="text-sm text-gray-600">{cot.cliente_email}</div>}
          {cot.cliente_telefono && <div className="text-sm text-gray-600">{cot.cliente_telefono}</div>}
        </div>

        <div className="bg-gray-50 rounded p-4">
          <div className="text-sm text-gray-600 mb-1">Creada</div>
          <div className="font-medium">{cot.fecha_creacion ? new Date(cot.fecha_creacion).toLocaleDateString("es-GT") : '-'}</div>
        </div>

        <div className="bg-gray-50 rounded p-4">
          <div className="text-sm text-gray-600 mb-1">Expira</div>
          <div className="font-medium">{cot.fecha_expiracion ? new Date(cot.fecha_expiracion).toLocaleDateString("es-GT") : '-'}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Productos / Servicios</h3>
        {items.length === 0 ? (
          <div className="bg-gray-50 rounded p-6 text-center text-gray-500">
            <p>No hay productos agregados a esta cotización</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id_cotizacion_item || it.id || `${it.id_producto}-${it.id_cotizacion}`} className="bg-gray-50 p-4 rounded flex justify-between">
                <div>
                  <div className="font-medium">{it.descripcion || `Producto ${it.id_producto}`}</div>
                  <div className="text-sm text-gray-600">Cantidad: {it.cantidad} × Q{Number(it.precio_unitario).toFixed(2)}</div>
                  {it.descuento_porcentaje && <div className="text-sm text-gray-600">Descuento: {it.descuento_porcentaje}%</div>}
                </div>
                <div className="font-bold">Q{Number(it.subtotal || (it.cantidad * it.precio_unitario)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cot.notas && (
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-sm mb-2">Notas</h4>
          <p className="text-sm text-gray-700">{cot.notas}</p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">Subtotal</div>
          <div className="font-bold">Q{Number(subtotal).toFixed(2)}</div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">Impuestos</div>
          <div className="font-bold">Q{Number(impuestos).toFixed(2)}</div>
        </div>

        <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-2xl font-bold text-blue-600">Q{Number(total).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default CotizacionDetalle;
