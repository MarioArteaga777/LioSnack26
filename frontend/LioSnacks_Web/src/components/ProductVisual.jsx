// src/components/ProductVisual.jsx

export default function ProductVisual({ name, imagePath }) {
  return (
    /* El contenedor ahora es totalmente transparente (bg-transparent) y sin pading restrictivo */
    <div className="relative w-full h-48 bg-transparent flex items-center justify-center overflow-hidden">
      
      {imagePath ? (
        /* Tu imagen original se mostrará limpia adaptándose al alto sin cajas grises */
        <img 
          src={imagePath} 
          alt={name} 
          className="h-full w-auto object-contain max-h-[180px] transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        /* Texto minimalista de respaldo en caso de que falte la ruta en la data */
        <div className="text-center text-zinc-500 font-sans text-xs uppercase tracking-widest">
          [ {name || "Sin Imagen"} ]
        </div>
      )}
    </div>
  );
}