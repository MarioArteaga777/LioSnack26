import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("liosnack_cart") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  useEffect(() => {
    localStorage.setItem("liosnack_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!recentlyAddedId) return;

    const timer = setTimeout(() => setRecentlyAddedId(null), 1200);
    return () => clearTimeout(timer);
  }, [recentlyAddedId]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  function addToCart(product, { mostrarAviso = true } = {}) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          image: product.imagePath || product.image || null,
        },
      ];
    });

    setRecentlyAddedId(product.id);

    if (mostrarAviso) {
      setCartOpen(true);
    }
  }

  function increment(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decrement(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function remove(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clear() {
    setCart([]);
    setCartOpen(false);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
        recentlyAddedId,
        addToCart,
        increment,
        decrement,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}