import React from "react";
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const containerStyle = {
    position: "relative",
    width: "100%"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem 0.75rem 0.5rem 2.5rem",
    fontSize: "0.875rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#ffffff",
    height: "40px",
    boxSizing: "border-box"
  };

  const iconStyle = {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b7280",
    fontSize: "1rem",
    pointerEvents: "none"
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>
        <FiSearch size={16} />
      </div>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = "#2563eb";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb";
        }}
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "1rem",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%"
          }}
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;