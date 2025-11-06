import { useState } from "react";
import { createProducto } from "../../services/productService";

const ProductoForm = ({ onClose }) => {
  const [form, setForm] = useState({
    nombre_producto: "",
    precio: "",
    stock: "",
    descripcion: "",
    id_categoria: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProducto(form);
      alert("Producto creado exitosamente");
      onClose();
    } catch (err) {
      alert("Error al crear el producto");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "600px",
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>Nuevo Producto</h3>

      {["nombre_producto", "precio", "stock", "descripcion", "id_categoria"].map(
        (field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace("_", " ")}
            value={form[field]}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            required={field !== "descripcion"}
          />
        )
      )}

      <button
        type="submit"
        style={{
          backgroundColor: "#16a34a",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Guardar
      </button>
    </form>
  );
};

export default ProductoForm;
