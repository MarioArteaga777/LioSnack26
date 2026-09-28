// src/components/ProductVisual.jsx

export default function ProductVisual({ name }) {
  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-transparent">
      <img
        src="/fruta real.png"
        alt={name || "Producto LioSnack"}
        className="h-full w-full max-h-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}