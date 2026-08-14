const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, headers } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
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
  login: (payload) => request("/login", { method: "POST", body: payload }),
  logout: () => request("/logout", { method: "POST" }),
};

export const pedidosApi = {
  create: (payload) => request("/pedidos/insert", { method: "POST", body: payload }),
};

export default request;