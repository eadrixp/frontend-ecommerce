import React from 'react';
import CreditCardForm from './CreditCardForm';
import BankTransferForm from './BankTransferForm';
import DigitalWalletForm from './DigitalWalletForm';
import CashPaymentForm from './CashPaymentForm';
import CryptoPaymentForm from './CryptoPaymentForm';

const PaymentMethodForm = ({ 
  selectedPaymentMethod,
  paymentData, 
  onPaymentDataChange, 
  errors = {} 
}) => {
  if (!selectedPaymentMethod) {
    return (
      <div style={{
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)'
      }}>
        Selecciona un método de pago para continuar
      </div>
    );
  }

  const tipo = selectedPaymentMethod.tipo_metodo;
  const isSaved = selectedPaymentMethod.isSaved;

  switch (tipo) {
    case 'tarjeta_credito':
    case 'tarjeta_debito':
      return (
        <CreditCardForm
          paymentData={paymentData}
          onPaymentDataChange={onPaymentDataChange}
          errors={errors}
          isSaved={isSaved}
        />
      );

    case 'transferencia_bancaria':
      return (
        <BankTransferForm
          paymentData={paymentData}
          onPaymentDataChange={onPaymentDataChange}
          errors={errors}
        />
      );

    case 'billetera_digital':
      return (
        <DigitalWalletForm
          paymentData={paymentData}
          onPaymentDataChange={onPaymentDataChange}
          errors={errors}
        />
      );

    case 'efectivo':
      return (
        <CashPaymentForm
          paymentData={paymentData}
          onPaymentDataChange={onPaymentDataChange}
          errors={errors}
        />
      );

    case 'criptomoneda':
      return (
        <CryptoPaymentForm
          paymentData={paymentData}
          onPaymentDataChange={onPaymentDataChange}
          errors={errors}
        />
      );

    default:
      return (
        <div style={{
          padding: 'var(--spacing-lg)',
          color: 'var(--danger-color)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)'
        }}>
          Método de pago no soportado: {tipo}
        </div>
      );
  }
};

export default PaymentMethodForm;
