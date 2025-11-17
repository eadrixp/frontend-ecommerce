import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { BiWorld } from 'react-icons/bi';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import { detectCardType, maskCardNumber } from '../../../../../utils/cardUtils';
import './CardPreview.css';

const CardPreview = ({ paymentData = {} }) => {
  const cardNumber = paymentData.numero_tarjeta || '';
  const cardType = detectCardType(cardNumber);
  const expirationDate = paymentData.fecha_expiracion || 'MM/YY';
  const holderName = paymentData.nombre_titular || 'NOMBRE DEL TITULAR';
  const cvv = paymentData.cvv || '***';

  // Mapeo de colores para cada tipo de tarjeta
  const cardStyles = {
    visa: {
      backgroundColor: 'linear-gradient(135deg, #1434CB 0%, #1434CB 100%)',
      logo: <SiVisa size={32} color="white" />
    },
    mastercard: {
      backgroundColor: 'linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)',
      logo: <SiMastercard size={32} color="white" />
    },
    amex: {
      backgroundColor: 'linear-gradient(135deg, #006FCF 0%, #006FCF 100%)',
      logo: <SiAmericanexpress size={32} color="white" />
    },
    discover: {
      backgroundColor: 'linear-gradient(135deg, #FF6000 0%, #FF6000 100%)',
      logo: <FiCreditCard size={32} color="white" />
    },
    unknown: {
      backgroundColor: 'linear-gradient(135deg, #4F4F4F 0%, #222222 100%)',
      logo: <BiWorld size={32} color="white" />
    }
  };

  const style = cardStyles[cardType] || cardStyles.unknown;

  return (
    <div className="card-preview-container">
      <div 
        className="card-preview"
        style={{ backgroundImage: style.backgroundColor }}
      >
        {/* Chip */}
        <div className="card-chip">
          <div className="chip-pattern"></div>
        </div>

        {/* Logo de la tarjeta */}
        <div className="card-logo">{style.logo}</div>

        {/* Número de tarjeta */}
        <div className="card-number">
          {cardNumber ? (
            <span>{cardNumber}</span>
          ) : (
            <span className="placeholder">•••• •••• •••• ••••</span>
          )}
        </div>

        {/* Información inferior */}
        <div className="card-info">
          <div className="card-holder">
            <span className="label">TITULAR</span>
            <span className="value">{holderName.toUpperCase()}</span>
          </div>
          <div className="card-expiry">
            <span className="label">VENCIMIENTO</span>
            <span className="value">{expirationDate}</span>
          </div>
        </div>

        {/* CVV en el reverso */}
        <div className="card-back">
          <div className="card-stripe"></div>
          <div className="card-cvv">
            <span className="label">CVV</span>
            <span className="value">{cvv}</span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="card-info-box">
        <div className="info-item">
          <span className="label">Tipo:</span>
          <span className="value">{cardType.toUpperCase()}</span>
        </div>
        {cardNumber && (
          <div className="info-item">
            <span className="label">Enmascarado:</span>
            <span className="value">{maskCardNumber(cardNumber)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
