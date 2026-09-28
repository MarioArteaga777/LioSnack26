export default function OrbitBadge({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center w-60 h-60 ${className}`}>
      {/* orbit rings - Círculo perfecto */}
      <div className="absolute inset-0 rounded-full border border-nebula-border" />
      <div className="absolute inset-[7.5%] rounded-full border border-dashed border-nebula-border/70" />
      <span className="absolute -right-1 top-6 h-2 w-2 rounded-full bg-teal animate-twinkle" />
      <span className="absolute -left-2 bottom-10 h-1.5 w-1.5 rounded-full bg-bloom animate-twinkle" style={{ animationDelay: "1.2s" }} />
      <span className="absolute right-8 -bottom-1 h-1.5 w-1.5 rounded-full bg-gold animate-twinkle" style={{ animationDelay: "0.6s" }} />

      {/* seal - Círculo perfecto sin nada en medio y la imagen ajustada sin zoom excesivo */}
      <div className="relative flex h-[78%] w-[78%] items-center justify-center rounded-full overflow-hidden bg-[#16132c] shadow-[0_0_60px_-8px_rgba(245,168,202,0.35)]">
        <img 
          src="/bienvenido.jfif" 
          alt="Misión Crunch" 
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}