import { Link } from "react-router-dom";

export default function CtaBanner({
  eyebrow = "Continúa la misión",
  title = "Explora nuestras creaciones",
  description = "No solo vendemos snacks: ofrecemos la experiencia del sabor tradicional convertido en combustible espacial. Cada bolsa es un paso hacia un futuro más limpio y sano.",
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="animate-rise flex flex-col items-start gap-8 rounded-3xl border border-nebula-border bg-nebula/60 px-6 py-12 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <div className="max-w-lg">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-stardust">
            {title}
          </h2>
          <p className="mt-3 font-body text-sm leading-relaxed text-mist">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <Link
            to="/catalogo"
            className="rounded-full bg-bloom px-6 py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark"
          >
            Ver Catálogo
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full border border-nebula-border px-6 py-3 font-body text-sm font-semibold text-stardust transition-colors hover:border-mist-dim"
          >
            Volver Arriba
          </button>
        </div>
      </div>
    </section>
  );
}
