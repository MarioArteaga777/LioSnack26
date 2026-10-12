import { getApiUrl } from "../config/api";
import { authService } from "./authService";

export async function getMyOrders() {
  const authorization = authService.getAccessTokenHeader();
  if (!authorization) {
    throw new Error("Inicia sesión nuevamente para consultar tus pedidos.");
  }

  const response = await fetch(`${getApiUrl()}/pedidos/mis-pedidos`, {
    headers: { Authorization: authorization },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "No se pudieron cargar tus pedidos.");
  }

  return data;
}