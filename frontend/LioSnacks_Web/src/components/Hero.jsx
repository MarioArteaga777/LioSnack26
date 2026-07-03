import { useMemo } from "react";

// Genera posiciones de estrellas/lunas de forma determinista (sin Math.random en cada render)
function useSky(count, seed) {
  return useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const x = ((i * 137.5 + seed * 13) % 100).toFixed(2);
      const y = ((i * 71.3 + seed * 7) % 100).toFixed(2);
      const size = 1 + ((i * 3) % 3);
      const delay = ((i * 0.27) % 4).toFixed(2);
      items.push({ x, y, size, delay });
    }
    return items;
  }, [count, seed]);
}

export default function Hero() {
  const stars = useSky(46, 1);

  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
      <div className="animate-rise relative overflow-hidden rounded-3xl border border-nebula-border bg-nebula/55 px-6 py-14 backdrop-blur-sm sm:px-12 sm:py-20">
        {/* signature starfield */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 80% 10%, rgba(245,168,202,0.10), transparent 60%), radial-gradient(ellipse 50% 60% at 10% 90%, rgba(99,217,196,0.08), transparent 55%)",
            }}
          />
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-stardust animate-twinkle"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-xl">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Catálogo de misión
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-stardust sm:text-5xl">
            Descubre nuestros productos
          </h1>
          <p className="mt-4 max-w-md font-body text-base leading-relaxed text-mist">
            Nutrición de alto rendimiento, diseñada para las tareas más
            exigentes. Elige tu combustible snack favorito.
          </p>
        </div>
      </div>
    </section>
  );
}
