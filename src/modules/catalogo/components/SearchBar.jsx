import React from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const containerStyle = {
    position: "relative",
    width: "100%"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 3rem",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#ffffff"
  };

  const iconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b7280",
    fontSize: "1.2rem",
    pointerEvents: "none"
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>🔍</div>
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
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "1.2rem"
          }}
        >
        </button>
      )}
    </div>
  );
};

export default SearchBar;