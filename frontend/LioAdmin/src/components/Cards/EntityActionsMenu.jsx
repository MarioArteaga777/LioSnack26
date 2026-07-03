/**
 * Menú flotante de acciones (Actualizar / Detalles / Eliminar) reutilizable
 * entre distintos tipos de tarjeta (cuentas, productos, etc.).
 */
const EntityActionsMenu = ({ onUpdate, onFinalize, onDetails, onDelete, onClose, className = "" }) => {
  const handleAction = (action) => {
    onClose?.();
    action?.();
  };

  return (
    <div
      className={`absolute z-10 flex w-32 flex-col gap-1.5 rounded-xl bg-white/10 p-1.5 shadow-lg backdrop-blur-sm ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => handleAction(onUpdate)}
        className="rounded-full bg-sky-500 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-600"
      >
        Actualizar
      </button>
      {onFinalize && (
        <button
          type="button"
          onClick={() => handleAction(onFinalize)}
          className="rounded-full bg-emerald-500 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Finalizar
        </button>
      )}
      <button
        type="button"
        onClick={() => handleAction(onDetails)}
        className="rounded-full bg-sky-500 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-600"
      >
        Detalles
      </button>
      <button
        type="button"
        onClick={() => handleAction(onDelete)}
        className="rounded-full bg-rose-600 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
      >
        Eliminar
      </button>
    </div>
  );
};

export default EntityActionsMenu;
