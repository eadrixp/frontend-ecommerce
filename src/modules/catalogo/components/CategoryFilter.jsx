import React from "react";
import { FiTag } from 'react-icons/fi';

const CategoryFilter = ({ productos, selectedCategory, onCategoryChange }) => {
  // Obtener categorías únicas de los productos
  const categories = [...new Set(productos
    .map(producto => producto.categoria)
    .filter(categoria => categoria && typeof categoria === 'string' && categoria.trim() !== "")
  )];

  const containerStyle = {
    position: "relative",
    width: "100%"
  };

  const selectStyle = {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    appearance: "none"
  };

  const iconStyle = {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b7280",
    pointerEvents: "none",
    zIndex: 1
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>
        <FiTag size={16} />
      </div>
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
        <option value="">Todas las categorías</option>
        {categories.map(categoria => (
          <option key={categoria} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;