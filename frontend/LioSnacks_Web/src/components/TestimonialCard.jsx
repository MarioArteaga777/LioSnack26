import { Quote } from "lucide-react";

export default function TestimonialCard({ name, role, quote }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="animate-rise flex h-full flex-col gap-4 rounded-2xl border border-nebula-border bg-nebula/60 p-6 backdrop-blur-sm">
      <Quote className="h-5 w-5 text-teal" strokeWidth={1.75} />

      <p className="flex-1 font-body text-sm leading-relaxed text-mist">
        “{quote}”
      </p>

      <div className="flex items-center gap-3 border-t border-nebula-border pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bloom font-display text-sm font-semibold text-bloom-ink">
          {initial}
        </span>
        <div>
          <p className="font-body text-sm font-medium text-stardust">{name}</p>
          <p className="font-body text-xs text-mist-dim">{role}</p>
        </div>
      </div>
    </div>
  );
}
