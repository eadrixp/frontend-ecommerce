import React from "react";

const PageHeader = ({ title, onAdd, showForm, addButtonLabel }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        backgroundColor: "#f8f8f9ff",
        padding: "3rem 3rem",
        borderRadius: "0px",
        width: "92%",
        height: "80px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#9861ebff" }}>
        {title}
      </h2>

      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            backgroundColor: "#9861ebff",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {showForm ? "Cerrar" : addButtonLabel || "Agregar"}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
