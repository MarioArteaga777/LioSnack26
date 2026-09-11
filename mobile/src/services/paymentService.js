import { getApiUrl } from "../config/api";
import { WOMPI_API, generateTransactionReference } from "../config/wompi";

/**
 * Procesa un pago a través del backend
 * El backend maneja la comunicación con Wompi
 * 
 * @param {Object} paymentData - Datos del pago
 * @param {number} paymentData.amount - Monto en centavos (ej: 500000 = $5,000 COP)
 * @param {string} paymentData.email - Email del cliente
 * @param {string} paymentData.phone - Teléfono del cliente
 * @param {string} paymentData.fullName - Nombre completo del cliente
 * @param {string} paymentData.cardToken - Token de la tarjeta generado por Wompi
 * @param {Array} paymentData.items - Items del carrito
 * @param {string} paymentData.description - Descripción del pago
 * @returns {Promise<Object>} Respuesta de la transacción
 */
export async function processPaymentWithWompi(paymentData) {
  const url = `${getApiUrl()}/pagos/procesar`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...paymentData,
        reference: generateTransactionReference(),
      }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || "Error al procesar el pago";
      throw new Error(message);
    }

    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
    throw error;
  }
}

/**
 * Obtiene el estado de una transacción
 * 
 * @param {string} transactionId - ID de la transacción en Wompi
 * @returns {Promise<Object>} Estado de la transacción
 */
export async function getTransactionStatus(transactionId) {
  const url = `${getApiUrl()}/pagos/estado/${transactionId}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || "Error al obtener el estado del pago";
      throw new Error(message);
    }

    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
    throw error;
  }
}

/**
 * Formatea un monto en COP a centavos
 * @param {number} amount - Monto en pesos COP
 * @returns {number} Monto en centavos
 */
export function formatAmountToWompi(amount) {
  return Math.round(amount * 100);
}

/**
 * Convierte centavos a COP
 * @param {number} cents - Monto en centavos
 * @returns {number} Monto en pesos COP
 */
export function formatWompiAmountToCOP(cents) {
  return cents / 100;
}
