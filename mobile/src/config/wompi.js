/**
 * Configuración de Wompi para pagos
 * Usando el ambiente de prueba (Sandbox)
 */

// Endpoint de prueba de Wompi
export const WOMPI_API = "https://sandbox.wompi.co/v1";

// Public Key para el ambiente de prueba (sandbox)
// Esta clave es pública y se usa en el frontend para tokenizar tarjetas
export const WOMPI_PUBLIC_KEY = "pub_test_nKKW3m7WW3A5T8t1AWw8k8K8K8K8k"; // Placeholder - reemplazar con clave real

// Configuración de transacciones
export const WOMPI_CONFIG = {
  // Ambiente: sandbox o production
  environment: "sandbox",
  
  // Currency en centavos (100 COP = 1 USD)
  currency: "COP",
  
  // URL de retorno después del pago (opcional)
  redirectUrl: null,
  
  // Timeout para las peticiones
  timeout: 30000,
};

/**
 * Genera un identificador único para la transacción
 * Usado como referencia en Wompi
 */
export function generateTransactionReference() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `LioSnack-${timestamp}-${random}`.substring(0, 32);
}
