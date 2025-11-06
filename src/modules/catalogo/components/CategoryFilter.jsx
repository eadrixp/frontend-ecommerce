import React from "react";

const CategoryFilter = ({ productos, selectedCategory, onCategoryChange }) => {
  // Obtener categorías únicas de los productos
  const categories = [...new Set(productos
    .map(producto => producto.categoria)
    .filter(categoria => categoria && typeof categoria === 'string' && categoria.trim() !== "")
  )];

  const selectStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#ffffff",
    cursor: "pointer"
  };

  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      style={selectStyle}
      onFocus={(e) => {
        e.target.style.borderColor = "#2563eb";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e7eb";
      }}
    >
      <option value="">🏷️ Todas las categorías</option>
      {categories.map(categoria => (
        <option key={categoria} value={categoria}>
          {categoria}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;