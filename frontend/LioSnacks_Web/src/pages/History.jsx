import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Rocket } from "lucide-react";
import ProductVisual from "../components/ProductVisual";
import Timeline from "../components/TimeLine";
import CtaBanner from "../components/CtaBanner";

const milestones = [
  {
    year: "2018",
    title: "Nacimiento de la idea",
    description: "Nace tras dejar un trabajo de oficina para perseguir algo propio, sin saber aún hacia dónde.",
  },
  {
    year: "2021",
    title: "Lanzamiento",
    description: "Lanzamos nuestra primera línea de productos liofilizados en mercados locales.",
  },
  {
    year: "2023",
    title: "Alianzas",
    description: "Firmamos convenios con distribuidores y participamos en nuestra primera expo nacional.",
  },
  {
    year: "Presente",
    title: "Expansión",
    description: "Llegamos a nuevas ciudades y planeamos más de 50 puntos de venta este año.",
  },
];

export default function History() {
  return (
    <>
      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-ink px-3 py-1 font-body text-xs font-semibold text-teal">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Nuestra historia
            </span>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-stardust sm:text-5xl">
              ¿Cómo empezamos?
            </h1>

            <p className="mt-5 max-w-md font-body text-base leading-relaxed text-mist">
              LioSnack nació de la idea de llevar snacks reales a cualquier
              lugar, sin sacrificar sabor ni nutrientes. Empezamos en una
              cocina pequeña con una liofilizadora y muchas ganas de hacer
              las cosas distinto.
            </p>

            <Link
              to="/catalogo"
              className="mt-8 inline-block rounded-full bg-bloom px-6 py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark"
            >
              Explora Productos
            </Link>
          </div>

          <div className="animate-rise overflow-hidden rounded-2xl border border-nebula-border bg-nebula/60 backdrop-blur-sm">
            <div className="border-b border-nebula-border px-4 py-2.5 font-body text-[11px] font-semibold uppercase tracking-wide text-teal">
              Fruta real · Crunch natural
            </div>
            <ProductVisual planetHue="gold" moonHue="stardust" />
            <p className="px-4 py-3 font-body text-xs italic text-mist">
              El sabor que el espacio no pudo cambiar.
            </p>
          </div>
        </div>
      </section>

      {/* Futuro + Pureza */}
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="animate-rise flex flex-col justify-between rounded-2xl border border-nebula-border bg-nebula/60 p-7 backdrop-blur-sm">
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nebula-light text-teal">
              <Rocket className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-stardust">
              Nuestro futuro
            </h2>
            <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-mist">
              Creemos que la nutrición de alto rendimiento no debe ser
              exclusiva de los astronautas. Queremos que la liofilización
              llegue a cualquier persona, sin importar qué tan lejos esté de
              este mundo.
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <span className="rounded-full bg-teal-ink px-3 py-1 font-body text-xs font-medium text-teal">
              Sustentable
            </span>
            <span className="rounded-full bg-teal-ink px-3 py-1 font-body text-xs font-medium text-teal">
              Accesible
            </span>
          </div>
        </div>

        <div className="animate-rise overflow-hidden rounded-2xl border border-nebula-border bg-nebula/60 backdrop-blur-sm">
          <div className="p-6 pb-0">
            <h2 className="font-display text-lg font-semibold text-stardust">
              Pureza Absoluta
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-mist">
              De frutas 100% liofilizadas al vacío, garantizando la máxima
              frescura y potencia de sabor en cada bocado, sin aditivos.
            </p>
          </div>
          <div className="mt-4">
            <ProductVisual planetHue="coral" moonHue="teal" compact />
          </div>
        </div>
      </section>

      {/* Certificación + Visión 2030 */}
      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-2">
        <div className="animate-rise flex items-start gap-4 rounded-2xl border border-nebula-border bg-nebula/60 p-6 backdrop-blur-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-stardust">
              Certificación
            </h3>
            <p className="mt-1.5 font-body text-sm leading-relaxed text-mist">
              Nuestros productos son inspeccionados por expertos en seguridad
              alimentaria, garantizando un estándar de calidad para tu
              bienestar.
            </p>
          </div>
        </div>

        <div className="animate-rise rounded-2xl border border-teal/25 bg-teal-ink/50 p-6 backdrop-blur-sm">
          <h3 className="font-display text-base font-semibold text-teal">
            Visión 2030
          </h3>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-mist">
            Para el final de la década, LioSnack proyecta establecer la
            primera planta de bio-alimentos nutricionales del país, con cada
            persona sumándose al proceso.
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between font-body text-xs text-mist-dim">
              <span>Desarrollo actual</span>
              <span>40%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-nebula-light">
              <div className="h-full w-[40%] rounded-full bg-teal" />
            </div>
          </div>
        </div>
      </section>

      {/* Trayectoria */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="mb-8 text-center">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Trayectoria
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-stardust sm:text-3xl">
            Nuestra Trayectoria
          </h2>
        </div>
        <Timeline milestones={milestones} />
      </section>

      <CtaBanner />
    </>
  );
}
