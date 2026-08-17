import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

// Tarjeta reutilizable para mostrar un producto en el listado
const ProductCard = ({
  image,
  name,
  sku,
  price,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    containerRef,
  } = useActionsMenu();

  // El menú de acciones solo se muestra si hay al menos un handler definido
  const hasActions = onUpdate || onDetails || onDelete;

  return (
    <div
      ref={containerRef}
      className={`group relative w-full max-w-64 flex flex-col rounded-2xl bg-[#2a1f5e] p-4 shadow-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:ring-1 hover:ring-sky-400/40 ${
        hasActions ? "cursor-pointer" : ""
      }`}
      role={hasActions ? "button" : undefined}
      tabIndex={hasActions ? 0 : undefined}
      onClick={hasActions ? () => setMenuOpen((prev) => !prev) : undefined}
      onKeyDown={
        hasActions
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMenuOpen((prev) => !prev);
              }
            }
          : undefined
      }
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b2d7a] to-[#2a1f5e] opacity-80 pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Imagen del producto */}
        <div className="h-40 w-40 flex items-center justify-center mb-3">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Nombre */}
        <h3 className="text-white text-sm font-medium text-center mb-3">
          {name}
        </h3>

        {/* Badges: SKU y precio */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-pink-500/20 text-pink-300">
            SKU: {sku}
          </span>

          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white">
            Precio: ${price}
          </span>
        </div>

        {hasActions && (
          <div className="mt-4 flex w-full justify-end text-xs text-white/70">
            Click for actions
          </div>
        )}
      </div>

      {/* Popup de acciones */}
      {hasActions && menuOpen && (
        <EntityActionsMenu
          className="bottom-4 right-4"
          onUpdate={onUpdate}
          onDetails={onDetails}
          onDelete={onDelete}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;
