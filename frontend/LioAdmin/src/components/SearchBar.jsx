import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { useGlobalSearch } from "../context/SearchContext";

const SearchBar = ({ mobileMenuOpen, onMenuToggle }) => {
  const { query, setQuery } = useGlobalSearch();

  return (
    <nav className="flex h-20 shrink-0 items-center justify-center gap-3 bg-transparent px-4 sm:h-28 sm:px-8 lg:px-20">
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileMenuOpen}
        aria-controls="admin-sidebar"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
      >
        {mobileMenuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
      </button>

      <div className="mx-0 flex h-[38px] w-full min-w-0 max-w-4xl flex-1 items-center gap-2 rounded-lg border border-[#c9a97a] bg-white px-4 sm:mx-8">
        <FiSearch className="text-[#a07850] shrink-0" size={15} />
        <input
          type="search"
          placeholder="Buscar..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar en la sección actual"
          className="bg-transparent outline-none flex-1 text-sm text-[#5c3d1e] placeholder-[#b09070]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpiar búsqueda"
            className="rounded p-1 text-[#a07850] hover:bg-[#f4ede5]"
          >
            <FiX size={15} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default SearchBar;