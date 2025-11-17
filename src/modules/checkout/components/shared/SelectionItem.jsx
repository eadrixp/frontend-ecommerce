import React from "react";

const SelectionItem = ({
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  primaryContent,
  secondaryContent,
  badge,
  icon,
  actions,
  editIcon,
  deleteIcon
}) => {
  return (
    <div 
      onClick={() => onSelect()}
      style={{
        border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "0.5rem",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: isSelected ? "#eff6ff" : "white",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isSelected ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
        transform: isSelected ? "scale(1.01)" : "scale(1)",
        position: "relative"
      }}
    >
      {/* Indicador visual de selección */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            backgroundColor: "#2563eb",
            borderRadius: "8px 0 0 8px",
            animation: "slideIn 0.3s ease-out"
          }}
        />
      )}
      
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <input
          type="radio"
          name="selection"
          checked={isSelected}
          onChange={() => onSelect()}
          style={{ 
            marginTop: "0.25rem",
            cursor: "pointer",
            accentColor: "#2563eb",
            width: "18px",
            height: "18px"
          }}
          onClick={(e) => e.stopPropagation()}
        />
        {icon && (
          <img
            src={icon}
            alt={primaryContent}
            style={{ 
              width: "24px", 
              height: "24px", 
              marginRight: "0.5rem",
              objectFit: "contain"
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <strong style={{
            fontSize: "1rem",
            color: isSelected ? "#2563eb" : "#1f2937",
            transition: "color 0.3s ease"
          }}>
            {primaryContent}
          </strong>
          {secondaryContent && (
            <>
              <br/>
              <span style={{
                color: isSelected ? "#374151" : "#6b7280",
                fontSize: "0.875rem",
                transition: "color 0.3s ease"
              }}>
                {secondaryContent}
              </span>
            </>
          )}
          {badge && <span style={badge.style}>{badge.label}</span>}
        </div>
      </div>
      
      {actions && (
        <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={{
                background: "none",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                transition: "all 0.2s ease",
                hover: {
                  backgroundColor: "#f3f4f6",
                  borderColor: "#d1d5db"
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
                e.target.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "#e5e7eb";
              }}
              title="Editar"
            >
              {editIcon}
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={{
                background: "none",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#dc2626",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#fee2e2";
                e.target.style.borderColor = "#fecaca";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "#fca5a5";
              }}
              title="Eliminar"
            >
              {deleteIcon}
            </button>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default SelectionItem;
