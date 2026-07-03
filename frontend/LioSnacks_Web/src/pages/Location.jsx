import { useState } from "react";
import { Search } from "lucide-react";
import LocationCard from "../components/LocationCard";

const allLocations = [
  {
    name: "Farmacias Camila",
    address: "Avenida Independencia Sur, Santa Ana",
    status: "Abierto hasta las 19:00",
    statusOpen: true,
    rating: 5.0,
    mapUrl: "https://www.google.com/maps?q=13.9942,-89.5597&z=15&output=embed",
  },
  {
    name: "Estación El Casco",
    address: "Barrio El Centro, Santa Ana",
    status: "Abierto 24 horas",
    statusOpen: true,
    rating: 4.9,
    mapUrl: "https://www.google.com/maps?q=13.9942,-89.5597&z=15&output=embed",
  },
  {
    name: "Colegio Ricaldone",
    address: "Km 62, Santa Ana",
    status: "Cerrado · abre 6:00",
    statusOpen: false,
    rating: 4.8,
    mapUrl: "https://www.google.com/maps?q=13.9942,-89.5597&z=15&output=embed",
  },
];

const embedSrc =
  "https://www.google.com/maps?q=13.9942,-89.5597&z=15&output=embed";

export default function Location() {
  const [search, setSearch] = useState("");

  const filtered = allLocations.filter((loc) =>
    loc.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <section id="top" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="animate-rise max-w-lg">
        <h1 className="font-display text-3xl font-semibold text-stardust sm:text-4xl">
          ¿Dónde nos encontramos?
        </h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-mist">
          Encuentra el punto de venta LioSnack más cercano usando el mapa interactivo.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">Buscar ubicación</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-dim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ubicación..."
              className="w-full rounded-full border border-nebula-border bg-nebula/60 py-2.5 pl-9 pr-4 font-body text-sm text-stardust placeholder:text-mist-dim backdrop-blur-sm focus:border-teal"
            />
          </label>

          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <p className="font-body text-sm text-mist">
                No encontramos puntos de venta con ese nombre.
              </p>
            ) : (
              filtered.map((loc) => <LocationCard key={loc.name} {...loc} />)
            )}
          </div>
        </div>

        <div className="animate-rise h-[420px] overflow-hidden rounded-2xl border border-nebula-border bg-nebula/60 backdrop-blur-sm lg:h-auto">
          <iframe
            title="Mapa de puntos de venta LioSnack"
            src={embedSrc}
            className="h-full min-h-[420px] w-full grayscale-[15%] contrast-[1.05] invert-[0.92] hue-rotate-180"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
