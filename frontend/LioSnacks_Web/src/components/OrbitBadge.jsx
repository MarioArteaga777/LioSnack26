export default function OrbitBadge({ className = "" }) {
  return (
    <div
      className={`relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72 ${className}`}
    >
      {/* Órbitas */}
      <div className="absolute inset-0 rounded-full border border-nebula-border" />
      <div className="absolute inset-[7.5%] rounded-full border border-dashed border-nebula-border/70" />

      {/* Fondo suave usando la misma imagen */}
      <div className="absolute inset-[11%] overflow-hidden rounded-full bg-[#16132c] shadow-[0_0_60px_-8px_rgba(245,168,202,0.35)]">
        <img
          src="/bienvenido.jfif"
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-125 object-cover opacity-40 blur-xl"
        />
        <div className="absolute inset-0 bg-[#16132c]/40" />
      </div>

      {/* Imagen completa, sin recorte circular */}
      <img
        src="/bienvenido.jfif"
        alt="Bienvenido a LioSnack"
        className="relative z-10 block h-[87%] w-auto max-w-[78%] rounded-xl object-contain shadow-2xl"
      />

      <span className="animate-twinkle absolute -right-1 top-6 h-2 w-2 rounded-full bg-teal" />
      <span
        className="animate-twinkle absolute -left-2 bottom-10 h-1.5 w-1.5 rounded-full bg-bloom"
        style={{ animationDelay: "1.2s" }}
      />
      <span
        className="animate-twinkle absolute -bottom-1 right-8 h-1.5 w-1.5 rounded-full bg-gold"
        style={{ animationDelay: "0.6s" }}
      />
    </div>
  );
}