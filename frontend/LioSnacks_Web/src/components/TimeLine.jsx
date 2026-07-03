const dotColors = ["bg-bloom", "bg-teal", "bg-gold", "bg-coral"];

export default function Timeline({ milestones }) {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-nebula-border sm:block" />
      <div className="grid gap-5 sm:grid-cols-4">
        {milestones.map((m, i) => (
          <div key={m.year} className="animate-rise relative flex flex-col gap-3">
            <span
              className={`relative z-10 h-3.5 w-3.5 rounded-full ${dotColors[i % dotColors.length]}`}
            />
            <div className="rounded-xl border border-nebula-border bg-nebula/60 p-4 backdrop-blur-sm">
              <p className="font-display text-sm font-semibold text-stardust">
                {m.year} · {m.title}
              </p>
              <p className="mt-1.5 font-body text-xs leading-relaxed text-mist">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
