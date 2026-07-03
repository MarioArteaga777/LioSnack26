import { Star, Clock } from "lucide-react";

export default function LocationCard({ name, address, status, statusOpen, rating, mapUrl }) {
  return (
    <div className="animate-rise rounded-xl border border-nebula-border bg-nebula/60 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-stardust">{name}</h3>
        <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-gold">
          <Star className="h-3 w-3 fill-gold" strokeWidth={0} />
          {rating.toFixed(1)}
        </span>
      </div>

      <p className="mt-1.5 font-body text-xs text-mist">{address}</p>

      <p
        className={`mt-1 inline-flex items-center gap-1 font-body text-xs font-medium ${
          statusOpen ? "text-teal" : "text-coral"
        }`}
      >
        <Clock className="h-3 w-3" strokeWidth={2} />
        {status}
      </p>

      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block rounded-full bg-bloom py-2 text-center font-body text-xs font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark"
      >
        Ver en Mapa
      </a>
    </div>
  );
}
