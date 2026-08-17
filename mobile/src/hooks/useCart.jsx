import { useContext } from "react";
import { CartContext } from "../context/CartContext";

/**
 * Custom hook para acceder al carrito de compras global
 * Proporciona métodos para agregar, actualizar y eliminar productos del carrito
 * 
 * @returns {Object} Objeto carrito con propiedades:
 *   - items: array de productos en el carrito
 *   - totals: objeto con subtotal, impuestos, total
 *   - addItem(product): agrega un producto al carrito
 *   - updateQuantity(id, quantity): actualiza cantidad de producto
 *   - removeItem(id): elimina un producto del carrito
 * @throws {Error} Si se usa fuera de CartProvider
 * 
 * @example
 * const { items, addItem, totals } = useCart();
 */
export default function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart debe utilizarse dentro de CartProvider.");
  return cart;
}
