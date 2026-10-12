const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const RECOVERY_TOKEN_KEY = "liosnack_web_recovery_token";
const ACCESS_TOKEN_KEY = "liosnack_web_access_token";

function readRecoveryToken() {
  try {
    return sessionStorage.getItem(RECOVERY_TOKEN_KEY);
  } catch {
    return null;
  }
}

let recoveryToken = readRecoveryToken();

function saveRecoveryToken(token) {
  recoveryToken = token || null;
  try {
    if (recoveryToken) {
      sessionStorage.setItem(RECOVERY_TOKEN_KEY, recoveryToken);
    } else {
      sessionStorage.removeItem(RECOVERY_TOKEN_KEY);
    }
  } catch {
  }
}

function readAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveAccessToken(token) {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
  }
}

async function request(path, {
  method = "GET",
  body,
  headers,
  useAccessToken = false,
  useRecoveryToken = false,
  credentials = "include",
} = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(useRecoveryToken && recoveryToken
        ? { Authorization: `Bearer ${recoveryToken}` }
        : {}),
      ...(useAccessToken && readAccessToken()
        ? { Authorization: `Bearer ${readAccessToken()}` }
        : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
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
}

export const authApi = {
  register: (payload) => request("/register", { method: "POST", body: payload }),
  verifyCode: (payload) => request("/register/verifyCodeEmail", { method: "POST", body: payload }),
  resendCode: (payload) => request("/register/resendCode", { method: "POST", body: payload }),
  login: async (payload) => {
    const data = await request("/login", { method: "POST", body: payload });
    saveAccessToken(data?.accessToken);
    return data;
  },
  logout: async () => {
    try {
      return await request("/logout", { method: "POST" });
    } finally {
      saveAccessToken(null);
    }
  },

  // Recuperación de contraseña
  requestRecoveryCode: async (payload) => {
    saveRecoveryToken(null);
    const data = await request("/recovery-password/requestCode", {
      method: "POST",
      body: payload,
      credentials: "omit",
    });
    saveRecoveryToken(data?.recoveryToken);
    return data;
  },
  verifyRecoveryCode: async (payload) => {
    const data = await request("/recovery-password/verifyCode", {
      method: "POST",
      body: payload,
      useRecoveryToken: true,
      credentials: "omit",
    });
    saveRecoveryToken(data?.recoveryToken || recoveryToken);
    return data;
  },
  setNewPassword: async (payload) => {
    const data = await request("/recovery-password/newPassword", {
      method: "POST",
      body: payload,
      useRecoveryToken: true,
      credentials: "omit",
    });
    saveRecoveryToken(null);
    return data;
  },
};

export const pedidosApi = {
  create: (payload) => request("/pedidos/insert", { method: "POST", body: payload }),
  getMine: () => request("/pedidos/mis-pedidos", { useAccessToken: true, credentials: "omit" }),
  createMine: (payload) => request("/pedidos/mis-pedidos", {
    method: "POST",
    body: payload,
    useAccessToken: true,
    credentials: "omit",
  }),
};

export const productosApi = {
  getAll: () => request("/productos"),
  getById: (id) => request(`/productos/${id}`),
};

export default request;