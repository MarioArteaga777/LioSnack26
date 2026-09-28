import { useMemo, useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

import Hero from "../components/Hero";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import useProducts from "../hooks/useProducts";

export default function Catalog({
  onAdd,
  recentlyAddedId,
  onProductDetail,
}) {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");

  // El backend sólo guarda Nombre/Imagen/SKU/Precio, así que el catálogo
  // se filtra por nombre; no hay categorías reales que filtrar.
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <section>
      {/* HERO DEL CATÁLOGO */}
      <Hero />

      {/* FILTROS (sólo búsqueda: el catálogo viene del backend) */}
      <Filters search={search} onSearchChange={setSearch} />

      {/* GRID DE PRODUCTOS */}
      {loading ? (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-24 text-center sm:px-8">
          <LoaderCircle className="h-8 w-8 animate-spin text-teal" />
          <p className="font-body text-sm text-mist">Cargando catálogo...</p>
        </div>
      ) : error ? (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-24 text-center sm:px-8">
          <TriangleAlert className="h-8 w-8 text-coral" />
          <p className="font-body text-sm text-mist">{error}</p>
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          onAdd={onAdd}
          recentlyAddedId={recentlyAddedId}
          onProductDetail={onProductDetail}
        />
      )}
    </section>
  );
}
