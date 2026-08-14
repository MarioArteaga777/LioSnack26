import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";
import ProductModal from "./components/ProductModal";

// Contexto
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Páginas
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import History from "./pages/History";
import Location from "./pages/Location";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";

function AppShell() {
  // Producto seleccionado para el modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    cart,
    cartCount,
    cartOpen,
    setCartOpen,
    addToCart,
    increment,
    decrement,
    remove,
    recentlyAddedId,
  } = useCart();

  return (
    <>
      <ScrollToTop />

      <div
        className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage: "url('/fondo.jpg')",
        }}
      >
        <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAdd={addToCart}
                  recentlyAddedId={recentlyAddedId}
                  onProductDetail={setSelectedProduct}
                />
              }
            />

            <Route
              path="/catalogo"
              element={
                <Catalog
                  onAdd={addToCart}
                  recentlyAddedId={recentlyAddedId}
                  onProductDetail={setSelectedProduct}
                />
              }
            />

            <Route path="/historia" element={<History />} />
            <Route path="/ubicacion" element={<Location />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        <Footer />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
        />

        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}
