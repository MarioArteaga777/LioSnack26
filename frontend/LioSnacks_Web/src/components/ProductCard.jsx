

import { ShoppingCart, Eye } from "lucide-react";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product, onAdd, justAdded, onDetailClick }) {
  return (
    <article className="flex flex-col bg-transparent p-2 transition-colors w-full group">
      
      {/* Visual del Producto directo */}
      <div className="w-full">
        <ProductVisual name={product.name} imagePath={product.imagePath} />
      </div>

      {/* Contenido e información */}
      <div className="flex flex-1 flex-col gap-2 pt-3 text-left">
        <div>
          <h3 className="text-xl font-bold font-sans tracking-tight text-white line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-0.5">
            <span className="text-lg font-semibold text-[#4CAF50]">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
            Impuesto incluido. Los <span className="underline cursor-pointer">gastos de envío</span> se calculan en la pantalla de pago.
          </p>
        </div>

        <hr className="border-zinc-800/60" />

        <p className="text-zinc-300 text-xs font-medium uppercase tracking-wide line-clamp-2">
          {product.description}
        </p>

        {/* Botones integrados */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          
          {/* Conocer más */}
          <button
            onClick={() => onDetailClick?.(product)}
            className="w-full bg-white/5 border border-zinc-800 text-zinc-300 font-bold tracking-widest text-[10px] uppercase hover:bg-white/10 hover:text-white transition-colors py-2 flex items-center justify-center gap-2"
          >
            <Eye className="h-3.5 w-3.5" />
            Conocer más
          </button>

          {/* Agregar al carrito */}
          <button
            onClick={() => onAdd(product)}
            className="w-full bg-transparent border border-zinc-700 text-white font-bold tracking-widest text-[10px] uppercase hover:bg-white hover:text-black transition-colors py-2 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {justAdded ? "¡Añadido!" : "Agregar al carrito"}
          </button>

        </div>
      </div>
    </article>
  );
}