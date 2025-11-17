/**
 * Utilidades para validación y formato de tarjetas de crédito/débito
 */

/**
 * Formatea el número de tarjeta a formato XXXX XXXX XXXX XXXX
 * @param {string} value - Valor ingresado por el usuario
 * @returns {string} Número de tarjeta formateado
 */
export const formatCardNumber = (value) => {
  // Solo permitir dígitos
  const digits = value.replace(/\D/g, '');
  
  // Limitar a 16 dígitos
  const limited = digits.slice(0, 16);
  
  // Agrupar en bloques de 4
  const formatted = limited.replace(/(\d{4})/g, '$1 ').trim();
  
  return formatted;
};

/**
 * Formatea la fecha de expiración a MM/YY
 * @param {string} value - Valor ingresado por el usuario
 * @returns {string} Fecha formateada
 */
export const formatExpirationDate = (value) => {
  // Solo permitir dígitos
  const digits = value.replace(/\D/g, '');
  
  // Limitar a 4 dígitos
  const limited = digits.slice(0, 4);
  
  // Formatear como MM/YY
  if (limited.length >= 2) {
    return limited.slice(0, 2) + '/' + limited.slice(2);
  }
  
  return limited;
};

/**
 * Formatea el CVV (solo dígitos, 3-4 caracteres)
 * @param {string} value - Valor ingresado por el usuario
 * @returns {string} CVV formateado
 */
export const formatCVV = (value) => {
  // Solo permitir dígitos
  const digits = value.replace(/\D/g, '');
  
  // Limitar a 4 dígitos
  return digits.slice(0, 4);
};

/**
 * Detecta el tipo de tarjeta basado en el número
 * @param {string} cardNumber - Número de tarjeta (sin espacios)
 * @returns {string} Tipo de tarjeta (visa, mastercard, amex, discover, unknown)
 */
export const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  // Visa: comienza con 4
  if (/^4/.test(number)) {
    return 'visa';
  }
  // Mastercard: comienza con 51-55 o 2221-2720
  else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
    return 'mastercard';
  }
  // American Express: comienza con 34 o 37
  else if (/^3[47]/.test(number)) {
    return 'amex';
  }
  // Discover: comienza con 6011, 622126-622925, 644, 645, 646, 647, 648, 649, o 65
  else if (/^(6011|622126|622925|64[4-9]|65)/.test(number)) {
    return 'discover';
  }
  
  return 'unknown';
};

/**
 * Valida el número de tarjeta usando el algoritmo de Luhn
 * @param {string} cardNumber - Número de tarjeta (con o sin espacios)
 * @returns {boolean} True si la tarjeta es válida
 */
export const validateCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  
  // Debe tener 13-19 dígitos
  if (!/^\d{13,19}$/.test(digits)) {
    return false;
  }
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Valida el formato de la fecha de expiración (MM/YY)
 * @param {string} expirationDate - Fecha en formato MM/YY
 * @returns {boolean} True si la fecha es válida y no ha expirado
 */
export const validateExpirationDate = (expirationDate) => {
  // Validar formato MM/YY
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
    return false;
  }
  
  // Validar que no esté expirada
  const [month, year] = expirationDate.split('/');
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  const expYear = parseInt(year);
  const expMonth = parseInt(month);
  
  // Si el año es menor, está expirada
  if (expYear < currentYear) {
    return false;
  }
  
  // Si el año es igual, verificar el mes
  if (expYear === currentYear && expMonth < currentMonth) {
    return false;
  }
  
  return true;
};

/**
 * Valida el CVV
 * @param {string} cvv - CVV (3 o 4 dígitos)
 * @param {string} cardType - Tipo de tarjeta (visa, mastercard, amex, etc.)
 * @returns {boolean} True si el CVV es válido
 */
export const validateCVV = (cvv, cardType = 'unknown') => {
  // American Express tiene 4 dígitos, otros tienen 3
  if (cardType === 'amex') {
    return /^\d{4}$/.test(cvv);
  }
  
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Máscara el número de tarjeta para mostrar solo los últimos 4 dígitos
 * @param {string} cardNumber - Número de tarjeta (con o sin espacios)
 * @returns {string} Número enmascarado (ej: ****-****-****-1234)
 */
export const maskCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 4) {
    return cardNumber;
  }
  
  const lastFour = digits.slice(-4);
  return `****-****-****-${lastFour}`;
};
