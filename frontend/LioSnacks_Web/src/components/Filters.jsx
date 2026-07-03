import { Search } from "lucide-react";

export default function Filters({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 font-body text-sm font-medium transition-colors ${
                isActive
                  ? "bg-bloom text-bloom-ink"
                  : "border border-nebula-border bg-nebula/60 text-mist backdrop-blur-sm hover:border-mist-dim hover:text-stardust"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <label className="relative block w-full sm:w-72">
        <span className="sr-only">Buscar snack</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-dim" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar snack..."
          className="w-full rounded-full border border-nebula-border bg-nebula/60 py-2 pl-9 pr-4 font-body text-sm text-stardust placeholder:text-mist-dim backdrop-blur-sm focus:border-teal"
        />
      </label>
    </div>
  );
}
