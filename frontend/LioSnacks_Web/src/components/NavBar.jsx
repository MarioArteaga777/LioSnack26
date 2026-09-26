import { useEffect, useState } from "react";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";

const links = [
  { name: "Inicio", to: "/" },
  { name: "Productos", to: "/catalogo" },
  { name: "¿Quienes somos?", to: "/historia" },
  { name: "Puntos de Venta", to: "/Puntos de Venta" },
  { name: "Contáctanos", to: "/contactanos" },
];

export default function Navbar({
  cartCount,
  cartOpen,
  cartItems,
  onCloseCart,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  function handleCartClick() {
    onCloseCart();
    navigate("/carrito");
  }

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-nebula-border/70 bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 sm:px-8">
        <NavLink
          to="/"
          className="flex items-center transition-transform hover:scale-105"
        >
          <img
            src="/favicon_lio.png"
            alt="LioSnack Logo"
            className="h-14 w-auto object-contain"
          />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative pb-1 font-body text-sm transition-colors ${
                  isActive
                    ? "text-stardust"
                    : "text-mist hover:text-stardust"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-0 h-[2px] w-full rounded-full bg-bloom" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={handleCartClick}
              aria-label={`Ver carrito, ${cartCount} artículos`}
              className="relative rounded-full p-2 text-stardust transition-colors hover:bg-nebula-light"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-bloom text-[10px] font-semibold text-bloom-ink">
                  {cartCount}
                </span>
              )}
            </button>

            <CartDrawer
              open={cartOpen}
              onClose={onCloseCart}
              items={cartItems}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Cuenta"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full p-2 text-stardust transition-colors hover:bg-nebula-light"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
                <span className="hidden font-body text-sm sm:inline">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-nebula-border bg-void-soft/95 p-2 shadow-xl backdrop-blur-md">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-body text-sm text-mist hover:bg-nebula-light hover:text-stardust"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              aria-label="Iniciar sesión"
              className="rounded-full p-2 text-stardust transition-colors hover:bg-nebula-light"
            >
              <User className="h-5 w-5" strokeWidth={1.75} />
            </NavLink>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="rounded-full p-2 text-stardust transition-colors hover:bg-nebula-light md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-nebula-border/70 bg-void-soft/95 backdrop-blur-md transition-[max-height] duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-64" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 font-body text-sm transition-colors ${
                  isActive
                    ? "bg-nebula-light text-stardust"
                    : "text-mist hover:bg-nebula-light hover:text-stardust"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}