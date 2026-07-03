import { useEffect, useRef, useState } from "react";

/**
 * Estado + detección de click afuera para un menú flotante de acciones
 * (Actualizar / Detalles / Eliminar) que se reutiliza en varias tarjetas.
 */
export function useActionsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return { open, setOpen, containerRef };
}

export default useActionsMenu;
