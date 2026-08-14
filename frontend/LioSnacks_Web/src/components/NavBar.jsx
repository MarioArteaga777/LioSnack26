import { useState } from "react";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Inicio", to: "/" },
  { name: "Catálogo", to: "/catalogo" },
  { name: "Historia", to: "/historia" },
  { name: "Ubicación", to: "/ubicacion" },
];

export default function Navbar({ cartCount, onCartClick }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-nebula-border/70 bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 sm:px-8">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center transition-transform hover:scale-105"
        >
          <img
            src="/Logo.png"
            alt="LioSnack Logo"
            className="h-14 w-auto object-contain"
          />
        </NavLink>

        {/* Menú */}
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

        {/* Iconos */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            aria-label={`Carrito, ${cartCount} artículos`}
            className="relative rounded-full p-2 text-stardust transition-colors hover:bg-nebula-light"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-bloom text-[10px] font-semibold text-bloom-ink">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Cuenta"
                className="flex items-center gap-2 rounded-full p-2 text-stardust transition-colors hover:bg-nebula-light"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
                <span className="hidden font-body text-sm sm:inline">{user.name}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-nebula-border bg-void-soft/95 p-2 shadow-xl backdrop-blur-md">
                  <button
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
        </div>
      </div>
    </header>
  );
}