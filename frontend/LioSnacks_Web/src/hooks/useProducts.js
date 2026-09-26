import { useCallback, useEffect, useState } from "react";
import { productosApi } from "../services/api";
import { normalizeProducts } from "../utils/normalizeProduct";

// Trae el catálogo real desde el backend (Node/Express + MongoDB) y lo adapta
// al shape que usan las tarjetas/modal del sitio público.
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productosApi.getAll();
      setProducts(normalizeProducts(data));
    } catch (err) {
      setError(err.message || "No se pudo cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
