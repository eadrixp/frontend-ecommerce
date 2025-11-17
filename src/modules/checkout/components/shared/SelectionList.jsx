import React from "react";
import SelectionItem from "./SelectionItem";

const SelectionList = ({
  items = [],
  selectedId,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  getItemContent,
  renderBadge,
  loading = false,
  emptyMessage,
  formGroupStyle,
  labelStyle,
  editIcon,
  deleteIcon,
  title
}) => {
  if (loading) {
    return (
      <div style={{ 
        padding: "1rem", 
        textAlign: "center",
        color: "#6b7280"
      }}>
        Cargando...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ 
        padding: "1rem", 
        backgroundColor: "#fef3c7", 
        borderRadius: "8px", 
        marginBottom: "1rem",
        border: "1px solid #f59e0b"
      }}>
        <p style={{ margin: 0, color: "#92400e" }}>
          {emptyMessage || "No hay elementos disponibles."}
        </p>
      </div>
    );
  }

  return (
    <div style={formGroupStyle}>
      {title && <label style={labelStyle}>{title}</label>}
      {items.map((item, index) => {
        const itemId = item.id || item.id_direccion || item.id_metodo_pago || item.id_metodo_pago_cliente || index;
        const isSelected = selectedId === itemId;
        const { primary, secondary, badge, icon } = getItemContent(item);

        return (
          <SelectionItem
            key={itemId}
            isSelected={isSelected}
            onSelect={() => {
              onSelectItem(itemId, item);
            }}
            onEdit={onEditItem ? () => onEditItem(item) : null}
            onDelete={onDeleteItem ? () => onDeleteItem(item) : null}
            primaryContent={primary}
            secondaryContent={secondary}
            badge={badge && renderBadge ? renderBadge(badge) : badge}
            icon={icon}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
          />
        );
      })}
    </div>
  );
};

export default SelectionList;
