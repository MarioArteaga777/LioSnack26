import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

const ProductCard = ({ image, name, stock, price, onUpdate, onDetails, onDelete }) => {
  const inStock = stock > 0;
  const { open: menuOpen, setOpen: setMenuOpen, containerRef } = useActionsMenu();

  const hasActions = onUpdate || onDetails || onDelete;

  return (
    <div
      ref={containerRef}
      className={`relative w-64 rounded-2xl bg-[#2a1f5e] p-4 shadow-xl overflow-hidden ${
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
        <div className="h-32 w-32 flex items-center justify-center mb-3">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Nombre */}
        <h3 className="text-white text-sm font-medium text-center mb-3">
          {name}
        </h3>

        {/* Badges: stock y precio */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
              inStock
                ? "bg-pink-500/20 text-pink-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-pink-400" />
            En Stock: {stock}
          </span>

          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white">
            Precio: ${price}
          </span>
        </div>
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