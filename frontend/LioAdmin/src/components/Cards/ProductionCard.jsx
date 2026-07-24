import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

const ProductionCard = ({
  sku,
  horaInicio,
  horaFinalizacion,
  bolsasEsperadas,
  bolsasObtenidas,
  kg,
  estado,
  onUpdate,
  onFinalize,
  onDetails,
  onDelete,
}) => {
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    containerRef,
  } = useActionsMenu();

  // El menú de acciones solo se muestra si hay al menos un handler definido
  const hasActions = onUpdate || onFinalize || onDetails || onDelete;

  // El botón de finalizar solo tiene sentido mientras la producción sigue en proceso
  const canFinalize = estado !== "Finalizado" && estado !== "Cancelado";

  // Color de la etiqueta de estado según el estado de la producción
  const getStatusColor = () => {
    switch (estado) {
      case "Finalizado":
        return "bg-green-500/20 text-green-300";

      case "Cancelado":
        return "bg-red-500/20 text-red-300";

      default:
        return "bg-yellow-500/20 text-yellow-300";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-72 rounded-2xl bg-[#2A1F5E] p-5 shadow-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:ring-1 hover:ring-sky-400/40 ${
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

      <div className="relative">

        <h2 className="text-white font-semibold text-lg mb-5">
          Producción
        </h2>

        <div className="space-y-3 text-white text-sm">

          <div className="flex justify-between">
            <span className="font-medium text-white/70">
              SKU
            </span>

            <span>{sku}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-white/70">
              Hora Inicio
            </span>

            <span>{horaInicio}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-white/70">
              Hora Final
            </span>

            <span>{horaFinalizacion}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-white/70">
              Bolsas Esperadas
            </span>

            <span>{bolsasEsperadas}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-white/70">
              Bolsas Obtenidas
            </span>

            <span>{bolsasObtenidas}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-white/70">
              KG
            </span>

            <span>{kg}</span>
          </div>

        </div>

        <div className="mt-6 flex justify-between items-center">

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}
          >
            {estado}
          </span>

        </div>

      </div>

      {hasActions && menuOpen && (
        <EntityActionsMenu
          className="bottom-4 right-4"
          onUpdate={onUpdate}
          onFinalize={canFinalize ? onFinalize : undefined}
          onDetails={onDetails}
          onDelete={onDelete}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductionCard;