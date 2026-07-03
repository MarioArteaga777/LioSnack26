import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";
import ProductModal from "./components/ProductModal";

// Contexto
import { CartProvider } from "./context/CartContext";

// Páginas
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import History from "./pages/History";
import Location from "./pages/Location";

export default function App() {
  // Producto seleccionado para el modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Producto agregado recientemente
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  // Carrito
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  // ==========================
  // Agregar producto
  // ==========================

  function handleAdd(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: 1,
        },
      ];
    });

    setRecentlyAddedId(product.id);
  }

  // ==========================
  // Quitar animación "Añadido"
  // ==========================

  useEffect(() => {
    if (!recentlyAddedId) return;

    const timer = setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1200);

    return () => clearTimeout(timer);
  }, [recentlyAddedId]);

  // ==========================
  // Carrito
  // ==========================

  function handleIncrement(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  }

  function handleDecrement(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function handleRemove(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearCart() {
    setCart([]);
  }

  return (
    <HashRouter>
      <CartProvider>
        <ScrollToTop />

        <div
          className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
          style={{
            backgroundImage: "url('/fondo.jpg')",
          }}
        >
          <Navbar
            cartCount={cartCount}
            onCartClick={() => setCartOpen(true)}
          />

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onAdd={handleAdd}
                    recentlyAddedId={recentlyAddedId}
                    onProductDetail={setSelectedProduct}
                  />
                }
              />

              <Route
                path="/catalogo"
                element={
                  <Catalog
                    onAdd={handleAdd}
                    recentlyAddedId={recentlyAddedId}
                    onProductDetail={setSelectedProduct}
                  />
                }
              />

              <Route
                path="/historia"
                element={<History />}
              />

              <Route
                path="/ubicacion"
                element={<Location />}
              />
            </Routes>
          </main>

          <Footer />

          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onClear={handleClearCart}
          />

          <ProductModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAdd={handleAdd}
          />
        </div>
      </CartProvider>
    </HashRouter>
  );
}