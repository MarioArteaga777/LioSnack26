import ProductCard from "./ProductCard";
import { ArchiveX } from "lucide-react";

export default function ProductGrid({ products, onAdd, recentlyAddedId, onProductDetail }) {
  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-24 text-center sm:px-8 bg-transparent">
        <ArchiveX className="h-10 w-10 text-zinc-600" strokeWidth={1.5} />
        <p className="font-sans text-xl font-medium text-white">
          No se encontraron productos
        </p>
        <p className="max-w-sm font-sans text-sm text-zinc-400">
          Prueba con otra categoría o ajusta tus filtros para seguir explorando nuestro catálogo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent py-10 w-full">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-stretch">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
            justAdded={recentlyAddedId === product.id}
            onDetailClick={onProductDetail}
          />
        ))}
      </div>
    </div>
  );
}