import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

const InventoryCard = ({
  image,
  name,
  sku,
  stock,
  location,
  expirationDate,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    containerRef,
  } = useActionsMenu();

  const hasActions = onUpdate || onDetails || onDelete;

  const getStockColor = () => {
    if (Number(stock) <= 5) return "bg-red-500/20 text-red-300";
    if (Number(stock) <= 15) return "bg-yellow-500/20 text-yellow-300";
    return "bg-green-500/20 text-green-300";
  };

  const formattedDate = expirationDate
    ? new Date(expirationDate).toLocaleDateString()
    : "N/A";

  return (
    <div
      ref={containerRef}
      className={`group relative w-72 overflow-hidden rounded-2xl bg-[#2A1F5E] p-5 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:ring-1 hover:ring-sky-400/40 ${
        hasActions ? "cursor-pointer" : ""
      }`}
      role={hasActions ? "button" : undefined}
      tabIndex={hasActions ? 0 : undefined}
      onClick={
        hasActions
          ? () => setMenuOpen((prev) => !prev)
          : undefined
      }
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3D2F80] to-[#2A1F5E] opacity-90" />

      <div className="relative">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Inventory
        </h2>

        <div className="mb-3 flex h-36 w-full items-center justify-center">
          <img
            src={image}
            alt={name}
            className="h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <h3 className="mb-3 text-center font-semibold text-white">
          {name}
        </h3>

        <div className="space-y-3 text-sm text-white">
          <div className="flex justify-between">
            <span className="text-white/70">SKU</span>
            <span>{sku}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Stock</span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${getStockColor()}`}
            >
              {stock}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Location</span>
            <span>{location}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Expiration</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {hasActions && (
          <div className="mt-6 flex justify-end text-xs text-white/70">
            Click for actions
          </div>
        )}
      </div>

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

export default InventoryCard;