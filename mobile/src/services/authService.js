import { getApiUrl } from "../config/api";

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

export const authService = {
  login: async ({ email, password }) => {
    return authRequest("/login", { email: email.trim().toLowerCase(), password });
  },

  register: async ({ name, lastName, email, password }) => {
    return authRequest("/register", {
      name: name.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  },

  verifyCode: async ({ email, code }) => {
    return authRequest("/register/verifyCodeEmail", {
      email: email.trim().toLowerCase(),
      code: code.trim(),
    });
  },

  resendCode: async (email) => {
    return authRequest("/register/resendCode", {
      email: email.trim().toLowerCase(),
    });
  },
};
