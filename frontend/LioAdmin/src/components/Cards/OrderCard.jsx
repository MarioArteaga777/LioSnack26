import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";
import {
  estadoColor,
  formatHora,
  formatTotal,
  resumenItems,
} from "../../utils/pedidoFormat";

const OrderCard = ({ pedido, onUpdate, onDetails, onDelete }) => {
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    containerRef,
  } = useActionsMenu();

  const hasActions = onUpdate || onDetails || onDelete;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl bg-[#2A1F5E] p-5 shadow-xl overflow-hidden ${
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
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3D2F80] to-[#2A1F5E] opacity-90 pointer-events-none" />

      <div className="relative space-y-3 text-white text-sm">

        <div className="flex justify-between gap-2">
          <span className="font-medium text-white/70">
            Producto
          </span>

          <span className="text-right">
            {resumenItems(pedido.items)}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="font-medium text-white/70">
            Cliente
          </span>

          <span className="text-right">
            {pedido.cliente || "Sin cliente"}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="font-medium text-white/70">
            Hora de pedido
          </span>

          <span>{formatHora(pedido.fecha_pedido)}</span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="font-medium text-white/70">
            Total
          </span>

          <span>{formatTotal(pedido.total_pedido)}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-medium text-white/70">
            Estado
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor(
              pedido.estado_pedido
            )}`}
          >
            {pedido.estado_pedido || "Pendiente"}
          </span>
        </div>

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

export default OrderCard;
