import { createContext, useMemo, useRef, useState } from 'react';
import { canAddProduct, getCartTotals } from '../utils/cart';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const itemsRef = useRef([]);

  const saveItems = (nextItems) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
  };

  const addItem = (product) => {
    const current = itemsRef.current.find((item) => item.id === product.id);
    if ((current && !canAddProduct(current)) || (!current && product.stock === 0)) {
      return { ok: false, message: current ? 'No hay más unidades disponibles.' : 'Este producto no está disponible.' };
    }

    saveItems(current
      ? itemsRef.current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...itemsRef.current, { ...product, quantity: 1 }]);
    return { ok: true, message: 'Producto agregado al carrito.' };
  };

  const updateQuantity = (id, quantity) => {
    const item = itemsRef.current.find((cartItem) => cartItem.id === id);
    if (!item) return { ok: false, message: 'Producto no encontrado.' };
    if (quantity < 1) {
      removeItem(id);
      return { ok: true };
    }
    if (item.stock !== null && item.stock !== undefined && quantity > item.stock) {
      return { ok: false, message: 'No hay más unidades disponibles.' };
    }
    saveItems(itemsRef.current.map((cartItem) => cartItem.id === id ? { ...cartItem, quantity } : cartItem));
    return { ok: true };
  };

  const removeItem = (id) => saveItems(itemsRef.current.filter((item) => item.id !== id));
  const totals = useMemo(() => getCartTotals(items), [items]);

  const value = useMemo(() => ({ items, totals, addItem, updateQuantity, removeItem }), [items, totals]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
