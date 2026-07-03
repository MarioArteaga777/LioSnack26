export default function FeatureCard({ icon: Icon, title, children, tone = "default", className = "" }) {
  const toneStyles = {
    default: "border-nebula-border bg-nebula/60",
    teal: "border-teal/30 bg-teal-ink/50",
  };

  return (
    <div
      className={`animate-rise rounded-2xl border p-6 backdrop-blur-sm ${toneStyles[tone]} ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-nebula-light text-teal">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-stardust">{title}</h3>
      <div className="mt-2 font-body text-sm leading-relaxed text-mist">{children}</div>
    </div>
  );
}
