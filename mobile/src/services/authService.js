import { getApiUrl } from "../config/api";

/**
 * Función auxiliar para hacer peticiones POST autenticadas al servidor
 * Maneja errores de red y parseo de JSON automáticamente
 * 
 * @private
 * @param {string} endpoint - Ruta del endpoint (ej: '/login', '/register')
 * @param {Object} body - Datos a enviar en el body de la petición
 * @returns {Promise<Object>} Respuesta JSON del servidor
 * @throws {Error} Si la petición falla o el servidor retorna un error
 */
async function authRequest(endpoint, body) {
  const url = `${getApiUrl()}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    return authRequest("/login", { email: email.trim().toLowerCase(), password });
  },

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
};
