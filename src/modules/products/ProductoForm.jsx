import { useState, useEffect, useRef } from "react";
import { createProducto } from "../../services/productService";
import { getCategorias } from "../../services/categoriasService";

const ProductoForm = ({ onClose }) => {
  const [form, setForm] = useState({
    nombre_producto: "",
    precio: "",
    stock: "",
    descripcion: "",
    id_categoria: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await getCategorias();
        console.log("📦 Categorías recibidas:", categoriasData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProducto(form);
      alert("✅ Producto creado exitosamente");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear el producto");
    }
  };

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // focus first input when modal opens
    firstInputRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        // close only when clicking the overlay (not the modal content)
        if (e.target === overlayRef.current) onClose();
      }}
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
    >
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0 }}>Nuevo Producto</h3>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            style={closeBtnStyle}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "0.75rem" }}>
          <input
            ref={firstInputRef}
            name="nombre_producto"
            placeholder="Nombre del producto"
            value={form.nombre_producto}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="precio"
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              style={{ ...inputStyle, flex: 1 }}
              required
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              style={{ ...inputStyle, flex: 1 }}
              required
            />
          </div>

          <textarea
            name="descripcion"
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChange={handleChange}
            style={inputStyle}
          />

          <label htmlFor="id_categoria" style={{ display: "block", marginBottom: "0.25rem" }}>
            Categoría
          </label>

          {loadingCategorias ? (
            <p>Cargando categorías...</p>
          ) : (
            <select
              name="id_categoria"
              value={form.id_categoria}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </select>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={onClose} style={secondaryButtonStyle}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#16a34a",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  backgroundColor: "#f3f4f6",
  color: "#111827",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
};

const modalStyle = {
  width: "100%",
  maxWidth: "720px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "1rem",
  boxShadow: "0 10px 30px rgba(2,6,23,0.2)",
  transform: "translateY(0)",
  animation: "pop .12s ease-out",
};

const modalHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #eef2f7",
  paddingBottom: "0.5rem",
};

const closeBtnStyle = {
  background: "transparent",
  border: "none",
  fontSize: "1.1rem",
  cursor: "pointer",
};

// Small keyframes fallback: inline styles can't define @keyframes; keep minimal animation via transition if needed.

export default ProductoForm;
