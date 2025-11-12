import React from "react";

const TableClientes = ({ clientes, onEdit, onDelete }) => {
    return (
        <div
            style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ddd" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>ID</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Apellido</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Teléfono</th>

                        <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c) => (
                        <tr key={c.id_cliente} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "0.5rem" }}>{c.id_cliente}</td>
                            <td style={{ padding: "0.5rem" }}>{c.nombre}</td>
                            <td style={{ padding: "0.5rem" }}>{c.apellido}</td>
                            <td style={{ padding: "0.5rem" }}>{c.telefono}</td>

                            <td style={{ padding: "0.5rem", textAlign: "center" }}>
                                <button
                                    onClick={() => onEdit(c)}
                                    style={{
                                        backgroundColor: "#2563eb",
                                        color: "#fff",
                                        border: "none",
                                        padding: "6px 10px",
                                        marginRight: "6px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(c.id_cliente)}
                                    style={{
                                        backgroundColor: "#f44336",
                                        color: "#fff",
                                        border: "none",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableClientes;
