import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Paginación reutilizable basada en número de página (1-indexed).
 *
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {(page: number) => void} onPageChange
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [...new Set([
    1,
    totalPages,
    ...Array.from(
      { length: Math.min(3, totalPages) },
      (_, index) => Math.max(1, Math.min(currentPage - 1, totalPages - 2)) + index,
    ),
  ])].sort((a, b) => a - b);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-2">
          {index > 0 && page - pages[index - 1] > 1 && (
            <span className="text-white/40" aria-hidden="true">…</span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
              page === currentPage
                ? "bg-sky-500 text-white"
                : "text-white/70 hover:bg-white/10"
            }`}
          >
            {page}
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
