import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import LocationCard from "../components/LocationCard";

const locationGroups = [
  {
    id: "farmacia-camila",
    name: "Farmacia Camila",
    description: "Encuentra nuestros productos en estas sucursales.",
    locations: [
      {
        id: "camila-palm-plaza",
        name: "Palm Plaza",
        address: "Palm Plaza, El Salvador",
        searchQuery: "Farmacia Camila Palm Plaza El Salvador",
      },
      {
        id: "camila-plaza-maite",
        name: "Plaza Maite",
        address: "Plaza Maite, El Salvador",
        searchQuery: "Farmacia Camila Plaza Maite El Salvador",
      },
      {
        id: "camila-escalon",
        name: "Escalón",
        address: "Colonia Escalón, San Salvador",
        searchQuery: "Farmacia Camila Escalon El Salvador",
      },
      {
        id: "camila-antiguo-cuscatlan",
        name: "Antiguo Cuscatlán",
        address: "Antiguo Cuscatlán, La Libertad",
        searchQuery: "Farmacia Camila Antiguo Cuscatlan El Salvador",
      },
    ],
  },

  {
    id: "nutrimarket",
    name: "Nutrimarket",
    description: "También puedes encontrar nuestros productos aquí.",
    locations: [
      {
        id: "nutrimarket-las-ramblas",
        name: "Las Ramblas",
        address: "Las Ramblas, El Salvador",
        searchQuery: "Nutrimarket Las Ramblas El Salvador",
      },
      {
        id: "nutrimarket-la-mascota",
        name: "La Mascota",
        address: "Colonia La Mascota, San Salvador",
        searchQuery: "Nutrimarket La Mascota El Salvador",
      },
    ],
  },

  {
    id: "soya-nutribar",
    name: "Soya Nutribar",
    description: "Encuéntranos también en los puntos de venta Soya Nutribar.",
    locations: [
      {
        id: "soya-san-benito",
        name: "San Benito",
        address: "San Benito, San Salvador",
        searchQuery: "Soya Nutribar San Benito El Salvador",
      },
      {
        id: "soya-el-tunco",
        name: "El Tunco",
        address: "Playa El Tunco, La Libertad",
        searchQuery: "Soya Nutribar El Tunco El Salvador",
      },
      {
        id: "soya-el-spot",
        name: "El Spot",
        address: "El Spot, El Salvador",
        searchQuery: "Soya Nutribar El Spot El Salvador",
      },
      {
        id: "soya-el-zonte",
        name: "El Zonte",
        address: "Playa El Zonte, La Libertad",
        searchQuery: "Soya Nutribar El Zonte El Salvador",
      },
    ],
  },
];

// Convierte un texto en una URL válida para Google Maps.
function getGoogleMapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

// URL utilizada dentro del iframe.
function getGoogleMapsEmbedUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&z=16&output=embed`;
}

export default function Location() {
  const [search, setSearch] = useState("");

  /*
   * Ubicación seleccionada inicialmente.
   * Puedes cambiarla después por la que quieras mostrar
   * al entrar a la página.
   */
  const [selectedLocation, setSelectedLocation] = useState(
    locationGroups[0].locations[0]
  );

  const normalizedSearch = search.trim().toLowerCase();

  /*
   * Filtramos por:
   * - nombre del negocio
   * - nombre de la sucursal
   * - dirección
   */
  const filteredGroups = locationGroups
    .map((group) => {
      if (!normalizedSearch) {
        return group;
      }

      const businessMatches = group.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchingLocations = group.locations.filter((location) => {
        return (
          location.name.toLowerCase().includes(normalizedSearch) ||
          location.address.toLowerCase().includes(normalizedSearch)
        );
      });

      /*
       * Si coincide el nombre del negocio,
       * mostramos todas sus sucursales.
       */
      if (businessMatches) {
        return group;
      }

      /*
       * Si solamente coinciden ciertas sucursales,
       * mostramos únicamente esas.
       */
      if (matchingLocations.length > 0) {
        return {
          ...group,
          locations: matchingLocations,
        };
      }

      return null;
    })
    .filter(Boolean);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const selectedMapUrl = getGoogleMapsEmbedUrl(
    selectedLocation.searchQuery
  );

  const selectedDirectionsUrl = getGoogleMapsSearchUrl(
    selectedLocation.searchQuery
  );

  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16"
    >
      {/* Título */}
      <div className="animate-rise max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-stardust sm:text-4xl">
          ¿Dónde nos encontramos?
        </h1>

        <p className="mt-3 font-body text-sm leading-relaxed text-mist">
          Encuentra el punto de venta LioSnack más cercano y selecciona una
          ubicación para visualizarla directamente en el mapa.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,350px)_1fr]">
        {/* ==========================================
            COLUMNA IZQUIERDA
        ========================================== */}
        <div className="flex flex-col gap-4">
          {/* Buscador */}
          <label className="relative block">
            <span className="sr-only">Buscar ubicación</span>

            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-dim"
              strokeWidth={2}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ubicación..."
              className="w-full rounded-full border border-nebula-border bg-nebula/60 py-2.5 pl-9 pr-4 font-body text-sm text-stardust outline-none placeholder:text-mist-dim backdrop-blur-sm transition-colors focus:border-teal"
            />
          </label>

          {/* Cards */}
          <div className="flex flex-col gap-5">
            {filteredGroups.length === 0 ? (
              <div className="rounded-xl border border-nebula-border bg-nebula/60 p-5 text-center backdrop-blur-sm">
                <MapPin className="mx-auto h-6 w-6 text-mist-dim" />

                <p className="mt-3 font-body text-sm text-mist">
                  No encontramos puntos de venta relacionados con tu búsqueda.
                </p>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <LocationCard
                  key={group.id}
                  name={group.name}
                  description={group.description}
                  locations={group.locations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                />
              ))
            )}
          </div>
        </div>

        {/* ==========================================
            MAPA
        ========================================== */}
        <div className="animate-rise">
          <div className="sticky top-24">
            {/* Información de la ubicación seleccionada */}
            <div className="mb-3 flex flex-col gap-3 rounded-xl border border-nebula-border bg-nebula/60 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <MapPin
                    className="h-4 w-4 text-teal"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <p className="font-body text-xs text-mist">
                    Ubicación seleccionada
                  </p>

                  <p className="font-display text-sm font-semibold text-stardust">
                    {selectedLocation.name}
                  </p>
                </div>
              </div>

              <a
                href={selectedDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-bloom px-5 py-2 text-center font-body text-xs font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark"
              >
                Abrir en Google Maps
              </a>
            </div>

            {/* Mapa */}
            <div className="h-[520px] overflow-hidden rounded-2xl border border-nebula-border bg-nebula/60 backdrop-blur-sm lg:h-[650px]">
              <iframe
                key={selectedLocation.id}
                title={`Mapa de ${selectedLocation.name}`}
                src={selectedMapUrl}
                className="h-full w-full grayscale-[15%] contrast-[1.05] invert-[0.92] hue-rotate-180"
                style={{
                  border: 0,
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}