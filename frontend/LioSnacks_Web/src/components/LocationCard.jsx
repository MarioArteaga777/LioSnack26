import {
  MapPin,
  ExternalLink,
  Store,
  Navigation,
} from "lucide-react";

function getGoogleMapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export default function LocationCard({
  name,
  description,
  locations = [],
  selectedLocation,
  onLocationSelect,
}) {
  return (
    <div className="animate-rise overflow-hidden rounded-xl border border-nebula-border bg-nebula/60 backdrop-blur-sm">
      {/* ==========================================
          NOMBRE DEL NEGOCIO
      ========================================== */}
      <div className="border-b border-nebula-border bg-nebula-light/30 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bloom/10">
            <Store
              className="h-4 w-4 text-bloom"
              strokeWidth={2}
            />
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-stardust">
              {name}
            </h3>

            {description && (
              <p className="mt-1 font-body text-[11px] leading-relaxed text-mist">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          SUCURSALES
      ========================================== */}
      <div className="divide-y divide-nebula-border">
        {locations.map((location) => {
          const isSelected =
            selectedLocation?.id === location.id;

          return (
            <div
              key={location.id}
              className={`group transition-colors ${
                isSelected
                  ? "bg-bloom/10"
                  : "hover:bg-nebula-light/30"
              }`}
            >
              <div className="flex items-center gap-2 p-3">
                {/* Seleccionar ubicación */}
                <button
                  type="button"
                  onClick={() =>
                    onLocationSelect?.(location)
                  }
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isSelected
                        ? "bg-bloom text-bloom-ink"
                        : "bg-teal/10 text-teal"
                    }`}
                  >
                    {isSelected ? (
                      <Navigation
                        className="h-3.5 w-3.5"
                        strokeWidth={2}
                      />
                    ) : (
                      <MapPin
                        className="h-3.5 w-3.5"
                        strokeWidth={2}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`font-body text-xs font-semibold transition-colors ${
                        isSelected
                          ? "text-bloom"
                          : "text-stardust group-hover:text-bloom"
                      }`}
                    >
                      {location.name}
                    </p>

                    <p className="mt-1 font-body text-[11px] leading-relaxed text-mist">
                      {location.address}
                    </p>

                    {isSelected && (
                      <span className="mt-1.5 inline-block font-body text-[10px] font-medium text-teal">
                        Mostrando en el mapa
                      </span>
                    )}
                  </div>
                </button>

                {/* Abrir Google Maps */}
                <a
                  href={getGoogleMapsUrl(
                    location.searchQuery
                  )}
                  target="_blank"
                  rel="noreferrer"
                  title={`Abrir ${location.name} en Google Maps`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-nebula-border bg-void-soft text-mist transition-all hover:border-bloom hover:bg-bloom hover:text-bloom-ink"
                >
                  <ExternalLink
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}