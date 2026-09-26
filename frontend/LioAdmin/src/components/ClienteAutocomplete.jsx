import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ClienteAutocomplete — Componente reutilizable de búsqueda/autocompletado de clientes.
 *
 * Props:
 *  - value        {string}    Nombre del cliente actualmente seleccionado (texto visible).
 *  - onSelect     {function}  Callback llamado con el objeto cliente seleccionado: { _id, name }.
 *  - clientes     {Array}     Lista de clientes ya cargada: [{ _id, name }, ...].
 *                             Si se omite (o se pasa vacío), el componente usará `endpoint`.
 *  - endpoint     {string}    URL base para búsqueda en backend, ej. "/api/clientes".
 *                             Se agregará ?search=<query>. Solo se usa si `clientes` está vacío.
 *  - placeholder  {string}    Texto placeholder del input. Default: "Buscar cliente…"
 *  - maxResults   {number}    Máximo de resultados visibles sin scroll. Default: 6
 *  - error        {string}    Mensaje de error externo (p.ej. de react-hook-form).
 */
const ClienteAutocomplete = ({
  value = "",
  onSelect,
  clientes = [],
  endpoint = "",
  placeholder = "Buscar cliente\u2026",
  maxResults = 6,
  error,
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const usesBackend = clientes.length === 0 && Boolean(endpoint);

  /* Sync external value into input */
  useEffect(() => {
    setQuery(value);
  }, [value]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  /* Front-end filtering */
  const filterLocal = useCallback(
    (q) => {
      if (!q.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      const lower = q.toLowerCase();
      const filtered = clientes.filter((c) =>
        c.name?.toLowerCase().includes(lower)
      );
      setResults(filtered);
      setIsOpen(true);
      setActiveIndex(-1);
    },
    [clientes]
  );

  /* Backend search with 300ms debounce */
  const fetchBackend = useCallback(
    (q) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!q.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `${endpoint}?search=${encodeURIComponent(q)}`
          );
          if (!res.ok) throw new Error("Error al buscar clientes");
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.clientes ?? []);
          setResults(list);
          setIsOpen(true);
          setActiveIndex(-1);
        } catch (err) {
          console.error(err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [endpoint]
  );

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q) onSelect?.({ _id: "", name: "" });
    usesBackend ? fetchBackend(q) : filterLocal(q);
  };

  const handleSelect = (cliente) => {
    setQuery(cliente.name);
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(cliente);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const ITEM_HEIGHT_PX = 40;
  const dropdownMaxHeight = maxResults * ITEM_HEIGHT_PX;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Input */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
          style={{ paddingRight: "2rem" }}
        />

        {/* Spinner / chevron */}
        <span
          style={{
            position: "absolute",
            right: "0.6rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#6b7280",
          }}
        >
          {loading ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animation: "ac-spin 0.8s linear infinite" }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 9999,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: `${dropdownMaxHeight}px`,
            overflowY: "auto",
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
            backgroundColor: "#2d1050",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          {results.length === 0 ? (
            <li
              style={{
                padding: "10px 14px",
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.875rem",
                cursor: "default",
              }}
            >
              No se encontraron clientes
            </li>
          ) : (
            results.map((cliente, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li
                  key={cliente._id}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(cliente);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 14px",
                    height: `${ITEM_HEIGHT_PX}px`,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.8)",
                    backgroundColor: isActive
                      ? "rgba(125, 60, 220, 0.55)"
                      : "transparent",
                    transition: "background-color 0.12s, color 0.12s",
                    borderRadius: "6px",
                    margin: "0 4px",
                  }}
                >
                  {/* Avatar iniciales */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#fff",
                      textTransform: "uppercase",
                    }}
                  >
                    {cliente.name?.slice(0, 2) ?? "??"}
                  </span>
                  <HighlightMatch text={cliente.name ?? ""} query={query} />
                </li>
              );
            })
          )}
        </ul>
      )}

      {/* Error externo (react-hook-form, etc.) */}
      {error && (
        <p style={{ marginTop: "4px", fontSize: "0.875rem", color: "#f87171" }}>
          {error}
        </p>
      )}

      {/* Keyframe para el spinner */}
      <style>{`
        @keyframes ac-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/* Resalta la coincidencia dentro del texto */
const HighlightMatch = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark
        style={{
          backgroundColor: "rgba(168, 85, 247, 0.55)",
          color: "#fff",
          borderRadius: "2px",
          padding: "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
};

export default ClienteAutocomplete;
