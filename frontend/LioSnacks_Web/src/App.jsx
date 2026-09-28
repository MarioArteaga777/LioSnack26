import { memo, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProductModal from "./components/ProductModal";
import Galaxy from "./components/Galaxy/Galaxy";

const StableGalaxy = memo(Galaxy);

// Contexto
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Páginas
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import History from "./pages/History";
import Location from "./pages/Location";
import Contactanos from "./pages/Contactanos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import PaymentStatus from "./pages/PaymentStatus";
import CartPage from "./pages/cartPage";
import NotFound from "./pages/NotFound";

function AppShell() {
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

      <div className="fixed inset-0 -z-10 overflow-hidden bg-void">
        <StableGalaxy
          starSpeed={0.5}
          density={1}
          hueShift={140}
          speed={1}
          glowIntensity={0.3}
          saturation={0}
          mouseRepulsion={false}
          repulsionStrength={0}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          transparent
        />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <Navbar
          cartCount={cartCount}
          cartOpen={cartOpen}
          cartItems={cart}
          onCloseCart={() => setCartOpen(false)}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
        />

        <main className="flex-1">
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
            <Route path="/Puntos de Venta" element={<Location />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Página completa del carrito con sugerencias */}
            <Route path="/carrito" element={<CartPage />} />

            {/* Formulario de datos de compra */}
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/pago/:id" element={<PaymentStatus />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

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