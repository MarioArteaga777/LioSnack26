export default function OrbitBadge({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* orbit rings */}
      <div className="absolute h-full w-full rounded-full border border-nebula-border" />
      <div className="absolute h-[85%] w-[85%] rounded-full border border-dashed border-nebula-border/70" />
      <span className="absolute -right-1 top-6 h-2 w-2 rounded-full bg-teal animate-twinkle" />
      <span className="absolute -left-2 bottom-10 h-1.5 w-1.5 rounded-full bg-bloom animate-twinkle" style={{ animationDelay: "1.2s" }} />
      <span className="absolute right-8 -bottom-1 h-1.5 w-1.5 rounded-full bg-gold animate-twinkle" style={{ animationDelay: "0.6s" }} />

      {/* seal */}
      <div className="flex h-[78%] w-[78%] flex-col items-center justify-center gap-2 rounded-full bg-stardust text-center shadow-[0_0_60px_-8px_rgba(245,168,202,0.35)]">
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden="true">
          <circle cx="23" cy="23" r="21" fill="#16132c" />
          <circle cx="23" cy="23" r="13" fill="#f4f1fb" />
          <circle cx="23" cy="23" r="13" fill="url(#visor)" fillOpacity="0.5" />
          <circle cx="19" cy="19" r="3" fill="#ffffff" fillOpacity="0.8" />
          <path
            d="M8 27c2 8 8 13 15 13s13-5 15-13"
            stroke="#f5a8ca"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="visor" x1="10" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#63d9c4" />
              <stop offset="1" stopColor="#f5a8ca" />
            </linearGradient>
          </defs>
        </svg>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-wide text-nebula">Lio</p>
          <p className="-mt-1 font-display text-lg font-bold tracking-wide text-bloom-dark">SNACKS</p>
        </div>
      </div>
    </div>
  );
}
