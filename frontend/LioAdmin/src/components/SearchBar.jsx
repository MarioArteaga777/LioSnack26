import { FiSearch, FiShoppingCart } from "react-icons/fi";

const SearchBar = () => {
  return (
    <nav className="flex items-center justify-center bg-transparent px-20 h-28 shrink-0">
      <div className="flex-1 max-w-4xl mx-8  flex items-center gap-2 bg-white border border-[#c9a97a] rounded-lg px-4 h-[38px]">
        <FiSearch className="text-[#a07850] shrink-0" size={15} />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent outline-none flex-1 text-sm text-[#5c3d1e] placeholder-[#b09070]"
        />
      </div>
    </nav>
  );
};

export default SearchBar;