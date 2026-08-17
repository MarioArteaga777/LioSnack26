import { API_URL } from "../config/api";

const normalizeProduct = (product) => ({
  id: product._id || product.id,
  name: product.Nombre || product.nombre || "Producto sin nombre",
  description:
    product.Descripcion ||
    product.descripcion ||
    (product.SKU ? `SKU: ${product.SKU}` : ""),
  price: Number(product.Precio ?? product.precio ?? 0),
  image: product.Imagen || product.imagen || null,
  stock: product.Stock ?? product.stock ?? null,
});

export async function getProducts() {
  const response = await fetch(`${API_URL}/productos`);

  if (!response.ok) {
    throw new Error("No fue posible obtener los productos.");
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("La respuesta de productos no tiene un formato válido.");
  }

  return data.map(normalizeProduct);
}
