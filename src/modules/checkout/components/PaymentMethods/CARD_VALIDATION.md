# Validación y Formato de Tarjetas de Crédito/Débito

## Características Implementadas

### 1. **Autoformato en Tiempo Real**

#### Número de Tarjeta
- **Formato**: `XXXX XXXX XXXX XXXX` (16 dígitos)
- **Restricción**: Solo acepta dígitos (0-9)
- **Longitud máxima**: 19 caracteres (16 dígitos + 3 espacios)
- **Detección automática**: Detecta el tipo de tarjeta (Visa, Mastercard, American Express, Discover)

#### Fecha de Expiración
- **Formato**: `MM/YY` (Mes/Año)
- **Restricción**: Solo acepta dígitos (0-9)
- **Longitud máxima**: 5 caracteres
- **Validación**: 
  - Mes debe estar entre 01-12
  - Año es de 2 dígitos
  - Valida que la fecha no esté expirada

#### CVV (Card Verification Value)
- **Formato**: 3-4 dígitos dependiendo del tipo de tarjeta
- **Restricción**: Solo acepta dígitos (0-9)
- **Longitud máxima**: 4 caracteres
- **Validación automática**: 
  - Tarjetas Amex: 4 dígitos
  - Otras tarjetas: 3-4 dígitos

### 2. **Vista Previa de Tarjeta (CardPreview)**

Se muestra una visualización interactiva de la tarjeta con:
- Representación visual con gradientes por tipo de tarjeta
- Chip de la tarjeta
- Número de tarjeta formateado en tiempo real
- Fecha de vencimiento
- Nombre del titular
- Información adicional del tipo de tarjeta

**Colores por tipo de tarjeta:**
- Visa: Azul (1434CB)
- Mastercard: Rojo a Naranja (EB001B → F79E1B)
- American Express: Azul (006FCF)
- Discover: Naranja (FF6000)
- Desconocida: Gris oscuro

### 3. **Validación Backend**

En `paymentService.js`, la función `validatePaymentData` incluye:
- Validación de 16 dígitos exactos
- Formato correcto de fecha (MM/YY)
- Verificación de fecha no expirada
- Validación de CVV (3 o 4 dígitos)
- Validación de nombre del titular

### 4. **Utilidades Reutilizables (cardUtils.js)**

Funciones disponibles:
- `formatCardNumber(value)` - Formatea número a XXXX XXXX XXXX XXXX
- `formatExpirationDate(value)` - Formatea a MM/YY
- `formatCVV(value)` - Restringe a dígitos y longitud
- `detectCardType(cardNumber)` - Detecta tipo de tarjeta
- `validateCardNumber(cardNumber)` - Validación de Luhn
- `validateExpirationDate(expirationDate)` - Valida fecha y si no está expirada
- `validateCVV(cvv, cardType)` - Valida CVV según tipo
- `maskCardNumber(cardNumber)` - Enmascara a ****-****-****-1234

## Flujo de Validación

1. **Entrada del Usuario**
   - Usuario escribe en el input
   - onChange dispara formateo automático
   - Solo se aceptan caracteres válidos

2. **Formateo Automático**
   - Se elimina caracteres no permitidos
   - Se aplica el formato específico
   - Se actualiza el estado con valor formateado

3. **Detección de Tipo**
   - Automáticamente se detecta tipo de tarjeta
   - Se actualiza el campo `tipo_tarjeta` en paymentData

4. **Validación**
   - Se ejecuta al intentar proceder
   - Se valida cada campo según requisitos
   - Se muestran errores específicos si hay problemas

## Ejemplos de Uso

### Entrada y Salida

**Número de Tarjeta:**
```
Entrada: 4532123456789010
Salida:  4532 1234 5678 9010
Tipo:    visa
```

**Fecha de Expiración:**
```
Entrada: 1225
Salida:  12/25
Válida:  Sí (si no está expirada)
```

**CVV:**
```
Entrada: abc123def456
Salida:  123456 (solo dígitos)
```

## Importación en Componentes

```javascript
import { 
  formatCardNumber, 
  formatExpirationDate, 
  formatCVV,
  detectCardType,
  validateCardNumber,
  validateExpirationDate,
  validateCVV,
  maskCardNumber
} from '../../../../utils/cardUtils';
```

## Seguridad

- ✅ Las tarjetas guardadas muestran solo los últimos 4 dígitos
- ✅ CVV nunca se almacena en el frontend
- ✅ Validación de Luhn para números de tarjeta
- ✅ Detección de fecha expirada
- ✅ Solo se aceptan dígitos válidos

## Responsividad

- El CardPreview se adapta a dispositivos móviles
- Los inputs tienen `inputMode="numeric"` para teclado numérico en móviles
- El formulario mantiene funcionalidad completa en pantallas pequeñas
