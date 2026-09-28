// El backend (colección "productos") sólo guarda: Nombre, Imagen, public_id, SKU, Precio.
// El resto de la UI (tarjetas, modal) espera un shape más amplio, así que lo completamos
// aquí con valores por defecto sensatos en vez de dejar textos vacíos regados por la app.
export function normalizeProduct(raw) {
  return {
    id: raw._id,
    sku: raw.SKU,
    name: raw.Nombre,
    price: Number(raw.Precio) || 0,
    imagePath: raw.Imagen || null,
    description: "Snack liofilizado, crocante y 100% natural.",
    extendedDescription:
      "Liofilizado al vacío para conservar el sabor y los nutrientes originales, sin conservantes ni azúcares añadidos. Listo para abrir y disfrutar donde sea.",
  };
}

export function normalizeProducts(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeProduct);
}
