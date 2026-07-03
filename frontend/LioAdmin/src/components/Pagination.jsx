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

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
            page === currentPage
              ? "bg-sky-500 text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          {page}
        </button>
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
