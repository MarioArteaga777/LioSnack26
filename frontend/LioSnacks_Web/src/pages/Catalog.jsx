import { useMemo, useState } from "react";

import Hero from "../components/Hero";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";

import { products, categories } from "../data/products";

export default function Catalog({
  onAdd,
  recentlyAddedId,
  onProductDetail,
}) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");

  // =========================
  // FILTRO DE PRODUCTOS
  // =========================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "todos" ||
        product.category === activeCategory;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  // =========================
  // CAMBIO DE CATEGORÍA
  // =========================
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearch(""); // reset search al cambiar categoría
  };

  return (
    <section className="min-h-screen">
      {/* HERO DEL CATÁLOGO */}
      <Hero />

      {/* FILTROS */}
      <Filters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        search={search}
        onSearchChange={setSearch}
      />

      {/* GRID DE PRODUCTOS */}
      <ProductGrid
        products={filteredProducts}
        onAdd={onAdd}
        recentlyAddedId={recentlyAddedId}
        onProductDetail={onProductDetail}
      />
    </section>
  );
}