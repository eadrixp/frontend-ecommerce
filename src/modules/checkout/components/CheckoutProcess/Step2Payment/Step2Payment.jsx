import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { getClientPaymentMethods } from "../../../../../services/paymentService";
import NewPaymentMethodModal from "./NewPaymentMethodModal";

const Step2Payment = ({
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentData,
  onPaymentDataChange,
  errors,
  setErrors,
  onPrevStep,
  onNextStep,
  secondaryButtonStyle,
  primaryButtonStyle
}) => {
  const [clientPaymentMethods, setClientPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewMethodModal, setShowNewMethodModal] = useState(false);

  useEffect(() => {
    loadClientPaymentMethods();
  }, []);

  const loadClientPaymentMethods = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getClientPaymentMethods();

      if (result.success) {
        setClientPaymentMethods(result.data || []);
      } else {
        setError("Error al cargar los métodos de pago");
      }
    } catch (err) {
      console.error("Error cargando métodos del cliente:", err);
      setError("Error al cargar los métodos de pago");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSavedMethod = (savedMethod) => {
    onPaymentMethodChange({
      ...savedMethod.metodoPago,
      isSaved: true,
      savedMethodData: savedMethod,
    });

    if (
      savedMethod.metodoPago.tipo_metodo === "tarjeta_credito" ||
      savedMethod.metodoPago.tipo_metodo === "tarjeta_debito"
    ) {
      onPaymentDataChange({
        numero_tarjeta: `****-****-****-${savedMethod.numero_tarjeta_ultimos_4}`,
        nombre_titular: savedMethod.nombre_titular || "",
        fecha_expiracion: savedMethod.fecha_expiracion || "",
        cvv: "",
        tipo_tarjeta: savedMethod.tipo_tarjeta || "",
        banco: savedMethod.banco || "",
      });
    }

    setErrors({});
  };

  const handleNewMethodSelect = (method) => {
    // El método recibido es el que se acaba de guardar
    // Recargar la lista de métodos para mostrar el nuevo
    loadClientPaymentMethods();
    
    onPaymentMethodChange(method);
    onPaymentDataChange({});
    setErrors({});
    setShowNewMethodModal(false);
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Información de pago
      </h2>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            color: "#dc2626",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          ⏳ Cargando métodos de pago...
        </div>
      )}

      {/* Payment Methods Section */}
      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Métodos Guardados */}
          {clientPaymentMethods && clientPaymentMethods.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Métodos Guardados
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    clientPaymentMethods.length > 0
                      ? "repeat(auto-fill, minmax(280px, 1fr))"
                      : "1fr",
                  gap: "1rem",
                }}
              >
                {clientPaymentMethods.map((savedMethod) => (
                  <button
                    key={savedMethod.id_metodo_pago_cliente}
                    onClick={() => handleSelectSavedMethod(savedMethod)}
                    style={{
                      padding: "1.25rem",
                      border:
                        selectedPaymentMethod?.savedMethodData
                          ?.id_metodo_pago_cliente ===
                        savedMethod.id_metodo_pago_cliente
                          ? "2px solid #2563eb"
                          : "1px solid #d1d5db",
                      borderRadius: "12px",
                      backgroundColor:
                        selectedPaymentMethod?.savedMethodData
                          ?.id_metodo_pago_cliente ===
                        savedMethod.id_metodo_pago_cliente
                          ? "#f0f9ff"
                          : "white",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      boxShadow:
                        selectedPaymentMethod?.savedMethodData
                          ?.id_metodo_pago_cliente ===
                        savedMethod.id_metodo_pago_cliente
                          ? "0 4px 12px rgba(37, 99, 235, 0.15)"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        selectedPaymentMethod?.savedMethodData
                          ?.id_metodo_pago_cliente !==
                        savedMethod.id_metodo_pago_cliente
                      ) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                        e.currentTarget.style.borderColor = "#bfdbfe";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        selectedPaymentMethod?.savedMethodData
                          ?.id_metodo_pago_cliente !==
                        savedMethod.id_metodo_pago_cliente
                      ) {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#1f2937",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {savedMethod.alias}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#6b7280",
                          }}
                        >
                          {savedMethod.metodoPago.nombre_metodo}
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div
                      style={{
                        padding: "0.75rem",
                        backgroundColor:
                          selectedPaymentMethod?.savedMethodData
                            ?.id_metodo_pago_cliente ===
                          savedMethod.id_metodo_pago_cliente
                            ? "rgba(37, 99, 235, 0.1)"
                            : "#f3f4f6",
                        borderRadius: "6px",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Últimos 4 dígitos
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1f2937",
                          fontFamily: "monospace",
                        }}
                      >
                        ****{savedMethod.numero_tarjeta_ultimos_4}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {savedMethod.verificado ? (
                        <>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#10b981",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#10b981",
                              fontWeight: "600",
                            }}
                          >
                            Verificado
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#f59e0b",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#f59e0b",
                              fontWeight: "600",
                            }}
                          >
                            No verificado
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Button to Add New Method */}
          <div>
            <button
              onClick={() => setShowNewMethodModal(true)}
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px dashed #d1d5db",
                borderRadius: "12px",
                backgroundColor: "white",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                color: "#2563eb",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f9ff";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              <FiPlus size={18} />
              Agregar Nuevo Método de Pago
            </button>
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button onClick={onPrevStep} style={secondaryButtonStyle}>
          Volver
        </button>
        <button onClick={onNextStep} style={primaryButtonStyle}>
          Revisar Orden
        </button>
      </div>

      {/* New Payment Method Modal */}
      <NewPaymentMethodModal
        isOpen={showNewMethodModal}
        onClose={() => setShowNewMethodModal(false)}
        onPaymentMethodSelect={handleNewMethodSelect}
        paymentData={paymentData}
        onPaymentDataChange={onPaymentDataChange}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};

export default Step2Payment;
