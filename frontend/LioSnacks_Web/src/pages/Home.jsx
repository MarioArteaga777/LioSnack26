import { Link } from "react-router-dom";
import { Leaf, Feather, Sparkles, ArrowRight, LoaderCircle, TriangleAlert } from "lucide-react";

import OrbitBadge from "../components/OrbitBadge";
import FeatureCard from "../components/FeatureCard";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import useProducts from "../hooks/useProducts";

const testimonials = [
  {
    name: "Mario Reyes",
    role: "Terrestre",
    quote:
      "Se me antojaba de algo dulce a media tarde y esto me dio energía real sin el bajón después.",
  },
  {
    name: "JP",
    role: "Astronauta autoproclamado",
    quote:
      "La liofilización de mi confianza. Sabor increíble y ligero.",
  },
  {
    name: "Benja",
    role: "Terrestre",
    quote:
      "Perfecto para llevar en excursiones, súper ligero y rico.",
  },
];

export default function Home({
  onAdd,
  onProductDetail,
  recentlyAddedId,
}) {
  const { products, loading, error } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section id="top" className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-ink px-3 py-1 text-xs font-semibold text-teal">
              <Sparkles className="h-3.5 w-3.5" />
              Nuevo lanzamiento
            </span>

            <h1 className="mt-5 text-4xl font-semibold text-stardust sm:text-5xl">
              Snacks Galácticos para los Terrestres
            </h1>

            <p className="mt-5 max-w-md text-base text-mist">
              Crujientes, ligeros y 100% liofilizados.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                to="/catalogo"
                className="rounded-full bg-bloom px-6 py-3 font-semibold text-bloom-ink"
              >
                Explora Ahora
              </Link>

              <Link
                to="/historia"
                className="rounded-full border border-nebula-border px-6 py-3 font-semibold text-stardust"
              >
                Ver Tecnología
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[300px]">
            <OrbitBadge className="aspect-square w-full" />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-stardust">
            Beneficios
          </h2>
          <p className="mt-3 text-mist">
            Conserva nutrientes sin conservantes.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <FeatureCard icon={Leaf} title="Natural">
            Conservamos el sabor original.
          </FeatureCard>

          <FeatureCard icon={Feather} title="Ligero">
            Ideal para viajes y excursiones.
          </FeatureCard>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-stardust">
              Catálogo Estelar
            </h2>
          </div>

          <Link to="/catalogo" className="flex items-center gap-2 text-bloom">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
            <LoaderCircle className="h-6 w-6 animate-spin text-teal" />
            <p className="font-body text-sm text-mist">Cargando catálogo...</p>
          </div>
        ) : error ? (
          <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
            <TriangleAlert className="h-6 w-6 text-coral" />
            <p className="font-body text-sm text-mist">{error}</p>
          </div>
        ) : featured.length === 0 ? (
          <p className="mt-10 py-16 text-center font-body text-sm text-mist">
            Aún no hay productos publicados en el catálogo.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAdd}
                justAdded={recentlyAddedId === product.id}
                onDetailClick={onProductDetail}
              />
            ))}
          </div>
        )}
      </section>

      {/* TESTIMONIOS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-stardust">
            Reseñas
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>
    </>
  );
}