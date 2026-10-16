// Manejo del token de recuperación de contraseña para LioAdmin.
//
// El backend (recoveryPasswordController) emite un JWT que devuelve tanto en
// una cookie httpOnly como en el body (`recoveryToken`). En local la cookie
// funciona porque frontend y backend comparten el sitio "localhost", pero en
// producción LioAdmin (lio-snacks-admin.vercel.app) y la API viven en dominios
// distintos y la cookie SameSite=strict no viaja. Por eso el flujo
// administrativo usa el token del body como Bearer, igual que LioSnacks_Web y
// la app móvil.

const RECOVERY_TOKEN_KEY = "lio_admin_recovery_token";

export function readRecoveryToken() {
  try {
    return sessionStorage.getItem(RECOVERY_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveRecoveryToken(token) {
  try {
    if (token) {
      sessionStorage.setItem(RECOVERY_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(RECOVERY_TOKEN_KEY);
    }
  } catch {
    // Sin sessionStorage el flujo queda limitado a cookies (solo local).
  }
}

export function clearRecoveryToken() {
  saveRecoveryToken(null);
}

/**
 * Headers para las peticiones del flujo de recuperación: agrega
 * `Authorization: Bearer <token>` cuando ya hay un token guardado.
 * @param {Object} extraHeaders
 * @returns {Object}
 */
export function recoveryHeaders(extraHeaders = {}) {
  const token = readRecoveryToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Indica si el JWT de recuperación ya pasó la verificación del código
 * (claim `verified`). Solo se usa para guards de UI; el backend valida
 * el token de forma independiente en cada petición.
 * @param {string} [token]
 * @returns {boolean}
 */
export function isRecoveryTokenVerified(token = readRecoveryToken()) {
  if (!token) return false;
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded));
    return Boolean(decoded.verified);
  } catch {
    return false;
  }
}
