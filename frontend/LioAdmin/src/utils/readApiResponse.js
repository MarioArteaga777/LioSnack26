const readApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!text) return null;

  if (!contentType.includes("application/json")) {
    throw new Error("El servidor no devolvio JSON. Verifica que el backend este activo y que la ruta API sea correcta.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("La respuesta del servidor no es JSON valido.");
  }
};

export default readApiResponse;
