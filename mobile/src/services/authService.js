import { getApiUrl } from "../config/api";

/**
 * Token store en memoria para el flujo de recuperación de contraseña.
 * El backend devuelve el token en el body de la respuesta (`recoveryToken`),
 * y nosotros lo enviamos como `Authorization: Bearer <token>` en los
 * siguientes pasos. Esto evita depender de cookies, que React Native
 * no puede manejar automáticamente.
 * @private
 */
const recoveryTokenStore = {
  token: null,

  /** Guarda el token devuelto por el backend en el body */
  save(data) {
    if (data?.recoveryToken) this.token = data.recoveryToken;
  },

  /** Retorna el header Authorization con el token almacenado */
  getHeader() {
    return this.token ? `Bearer ${this.token}` : null;
  },

  /** Limpia el token almacenado al terminar el flujo */
  clear() {
    this.token = null;
  },
};

let accessToken = null;

function setAccessToken(token) {
  accessToken = token || null;
}

function getAccessTokenHeader() {
  return accessToken ? `Bearer ${accessToken}` : null;
}

/**
 * Función auxiliar para hacer peticiones POST al servidor.
 * Maneja errores de red y parseo de JSON automáticamente.
 *
 * @private
 * @param {string} endpoint - Ruta del endpoint (ej: '/login', '/register')
 * @param {Object} body - Datos a enviar en el body de la petición
 * @param {Object} [options] - Opciones adicionales
 * @param {boolean} [options.sendRecoveryToken] - Enviar token de recuperación como Bearer
 * @param {boolean} [options.saveRecoveryToken] - Guardar el recoveryToken de la respuesta
 * @returns {Promise<Object>} Respuesta JSON del servidor
 * @throws {Error} Si la petición falla o el servidor retorna un error
 */
async function authRequest(endpoint, body, { sendRecoveryToken = false, saveRecoveryToken = false } = {}) {
  const url = `${getApiUrl()}${endpoint}`;
  try {
    const headers = { "Content-Type": "application/json" };

    if (sendRecoveryToken) {
      const bearerHeader = recoveryTokenStore.getHeader();
      if (bearerHeader) headers["Authorization"] = bearerHeader;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || "Ocurrió un error al conectar con el servidor.";
      throw new Error(message);
    }

    if (saveRecoveryToken) recoveryTokenStore.save(data);

    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
    throw error;
  }
}

/**
 * Servicio de autenticación - proporciona métodos para login, registro y verificación
 * Todas las peticiones se normalizan automáticamente (trim, lowercase)
 */
export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * @param {Object} credentials - { email: string, password: string }
   * @returns {Promise<Object>} Usuario autenticado y token si es exitoso
   * @throws {Error} Si las credenciales son inválidas
   */
  login: async ({ email, password }) => {
    const data = await authRequest("/login", { email: email.trim().toLowerCase(), password });
    setAccessToken(data?.accessToken);
    return data;
  },
  setAccessToken,
  getAccessTokenHeader,

  /**
   * Registra un nuevo usuario
   * Envía un código de verificación al email proporcionado
   * @param {Object} data - { name: string, lastName: string, email: string, password: string }
   * @returns {Promise<Object>} Mensaje de confirmación
   * @throws {Error} Si el email ya existe o hay error en validación
   */
  register: async ({ name, lastName, email, password }) => {
    return authRequest("/register", {
      name: name.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  },

  /**
   * Verifica el código enviado al email durante el registro
   * @param {Object} data - { email: string, code: string }
   * @returns {Promise<Object>} Mensaje de éxito si el código es válido
   * @throws {Error} Si el código es inválido o ha expirado
   */
  verifyCode: async ({ email, code }) => {
    return authRequest("/register/verifyCodeEmail", {
      email: email.trim().toLowerCase(),
      code: code.trim(),
    });
  },

  /**
   * Reenvía el código de verificación al email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Mensaje de confirmación
   * @throws {Error} Si el email no existe
   */
  resendCode: async (email) => {
    return authRequest("/register/resendCode", {
      email: email.trim().toLowerCase(),
    });
  },

  // ─── Recuperación de contraseña ────────────────────────────────────────────

  /**
   * Paso 1: Solicita un código de recuperación al correo indicado.
   * El backend devuelve un `recoveryToken` en el body que guardamos
   * para enviarlo como Authorization Bearer en los siguientes pasos.
   * @param {string} email - Correo del usuario
   * @returns {Promise<Object>} { message: "email sent" }
   * @throws {Error} Si el correo no existe o hay error de servidor
   */
  requestRecoveryCode: async (email) => {
    recoveryTokenStore.clear();
    return authRequest(
      "/recovery-password/requestCode",
      { email: email.trim().toLowerCase() },
      { saveRecoveryToken: true }
    );
  },

  /**
   * Paso 2: Verifica el código de 6 dígitos enviado al correo.
   * Envía el token guardado como Authorization Bearer.
   * El backend retorna un nuevo token (verified=true) que también guardamos.
   * @param {string} code - Código de 6 dígitos
   * @returns {Promise<Object>} { message: "Code verified successfully" }
   * @throws {Error} Si el código es inválido o expiró
   */
  verifyRecoveryCode: async (code) => {
    return authRequest(
      "/recovery-password/verifyCode",
      { code: code.trim() },
      { sendRecoveryToken: true, saveRecoveryToken: true }
    );
  },

  /**
   * Paso 3: Establece la nueva contraseña.
   * Envía el token verificado como Authorization Bearer.
   * @param {string} newPassword - Nueva contraseña
   * @param {string} confirmNewPassword - Confirmación de contraseña
   * @returns {Promise<Object>} { message: "Password updated" }
   * @throws {Error} Si las contraseñas no coinciden o la sesión expiró
   */
  setNewPassword: async (newPassword, confirmNewPassword) => {
    const result = await authRequest(
      "/recovery-password/newPassword",
      { newPassword, confirmNewPassword },
      { sendRecoveryToken: true }
    );
    recoveryTokenStore.clear();
    return result;
  },
};
