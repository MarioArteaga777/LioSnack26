// Helpers compartidos entre los formularios, tarjetas y páginas de Cuentas.

export const formatFechaCuenta = (fecha) => {
  if (!fecha) return "Sin fecha";

  const date = new Date(fecha);
  if (isNaN(date)) return "Sin fecha";

  return date.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Formato "YYYY-MM-DD" para precargar un <input type="date">
export const toDateInputValue = (fecha) => {
  if (!fecha) return "";

  const date = new Date(fecha);
  if (isNaN(date)) return "";

  return date.toISOString().slice(0, 10);
};

export const formatMonto = (monto) => `$${Number(monto || 0).toFixed(2)}`;

// Días que faltan para la fecha de vencimiento (negativo si ya venció)
export const diasParaVencer = (fechaVencimiento) => {
  if (!fechaVencimiento) return undefined;

  const venc = new Date(fechaVencimiento);
  if (isNaN(venc)) return undefined;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  venc.setHours(0, 0, 0, 0);

  return Math.round((venc - hoy) / (1000 * 60 * 60 * 24));
};
