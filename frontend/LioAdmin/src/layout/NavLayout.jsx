import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import bgImg from "../assets/AbstractBG.png";
import { SearchProvider } from "../context/SearchContext";

// La autenticación ya se valida en PrivateRoute (usa AuthContext),
// así que este layout no necesita revisar la sesión por su cuenta.
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <SearchProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#110226]">
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
        <SideBar
          mobileMenuOpen={mobileMenuOpen}
          onMobileNavigate={() => setMobileMenuOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <SearchBar
            mobileMenuOpen={mobileMenuOpen}
            onMenuToggle={() => setMobileMenuOpen((open) => !open)}
          />
          <main className="flex-1 overflow-y-auto p-6 pt-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

/**style={{backgroundPosition: "center", backgroundImage: `url(${bgImg})`}} */

export default Layout;
