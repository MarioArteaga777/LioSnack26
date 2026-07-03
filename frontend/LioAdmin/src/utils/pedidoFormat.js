// Helpers compartidos entre la tarjeta, el modal y la página de Pedidos.

export const formatFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  const date = new Date(fecha);
  if (isNaN(date)) return "Sin fecha";

  return date.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatHora = (fecha) => {
  if (!fecha) return "Pendiente";

  const date = new Date(fecha);
  if (isNaN(date)) return "Pendiente";

  return date.toLocaleTimeString("es-SV", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatTotal = (total) =>
  `$${Number(total || 0).toFixed(2)}`;

// Nombre a mostrar: primer producto del pedido (+ cuántos más lleva).
export const resumenItems = (items) => {
  if (!items || items.length === 0) return "Sin productos";

  const primero = items[0]?.producto || "Producto";

  return items.length > 1
    ? `${primero} (+${items.length - 1} más)`
    : primero;
};

export const estadoColor = (estado) => {
  switch (estado) {
    case "Finalizado":
      return "bg-green-500/20 text-green-300";

    case "Cancelado":
      return "bg-red-500/20 text-red-300";

    case "En proceso":
      return "bg-sky-500/20 text-sky-300";

    default: // Pendiente
      return "bg-yellow-500/20 text-yellow-300";
  }
};
