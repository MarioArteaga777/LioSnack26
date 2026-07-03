// src/components/ProductModal.jsx

import { X, ShoppingCart } from "lucide-react";
import ProductVisual from "./ProductVisual";

export default function ProductModal({ product, isOpen, onClose, onAdd }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      {/* Contenedor de la Ventana */}
      <div className="relative w-full max-w-3xl bg-[#0D0D0D] border border-zinc-800 text-white grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl">
        
        {/* Botón de cerrar (X) */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-1 bg-black/40 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Lado Izquierdo: Visualización de Imagen (Sin fondo gris) */}
        <div className="bg-transparent flex items-center justify-center p-6 min-h-[300px]">
          <ProductVisual name={product.name} imagePath={product.imagePath} />
        </div>

        {/* Lado Derecho: Información Extendida */}
        <div className="p-6 md:p-8 flex flex-col justify-between text-left border-l border-zinc-900">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Detalles del Producto</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 mb-2">
              {product.name}
            </h2>
            
            <div className="text-xl font-semibold text-[#4CAF50] mb-4">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              {product.extendedDescription || product.description}
            </p>

            <div className="space-y-2 mb-6 border-t border-zinc-800 pt-4">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full"></span>
                <span>Proceso de liofilizado al vacío al 100% natural.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full"></span>
                <span>Conserva todos los nutrientes y sabor original.</span>
              </div>
            </div>
          </div>

          {/* Botón inferior */}
          <div className="border-t border-zinc-800 pt-4 mt-auto">
            <button
              onClick={() => {
                onAdd(product);
                onClose();
              }}
              className="w-full bg-white text-black font-bold tracking-widest text-xs uppercase hover:bg-zinc-200 transition-colors py-3 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Añadir al carrito
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}