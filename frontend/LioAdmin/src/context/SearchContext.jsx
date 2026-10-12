import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useGlobalSearch debe usarse dentro de SearchProvider");
  }
  return context;
}