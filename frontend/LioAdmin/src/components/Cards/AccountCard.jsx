import {
  Banknote,
  CheckCircle2,
  Package,
  Clock,
  MoreVertical,
  UserRound,
} from "lucide-react";
import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

const statusColors = {
  Cobrado: "bg-sky-200 text-sky-900",
  Pagado: "bg-sky-200 text-sky-900",
  Pendiente: "bg-rose-600 text-white",
};

const cardColors = {
  Cobrado: "bg-sky-100",
  Pagado: "bg-sky-100",
  Pendiente: "bg-rose-600",
};

/**
 * Card reutilizable para "Cuentas por Cobrar" y "Cuentas por Pagar".
 *
 * @param {string} client
 * @param {string} [clientLabel] - etiqueta del pill superior (por defecto "Cliente", usar "Proveedor" en Pagar)
 * @param {string} image
 * @param {number} amount
 * @param {number} [pendingBalance] - si se pasa, se muestra el pill de saldo pendiente
 * @param {"Cobrado"|"Pagado"|"Pendiente"} status
 * @param {string} dueDate
 * @param {boolean} [showProducts] - muestra el pill de detalle (usado en Cobrar)
 * @param {string} [productsLabel] - texto del pill de detalle (por defecto "Productos")
 * @param {number} [daysLeft] - si se pasa, muestra el badge flotante de días (usado en Pagar)
 * @param {() => void} onUpdate
 * @param {() => void} onDetails
 * @param {() => void} onDelete
 */
const AccountCard = ({
  client,
  clientLabel = "Cliente",
  image,
  amount,
  pendingBalance,
  status,
  dueDate,
  showProducts = false,
  productsLabel = "Productos",
  daysLeft,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const isPending = status === "Pendiente";
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    containerRef: menuRef,
  } = useActionsMenu();

  const pillClass = isPending
    ? "bg-rose-800/40 text-white"
    : "bg-white/60 text-gray-800";

  return (
    <div
      className={`group relative rounded-2xl p-3 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 ${cardColors[status]}`}
    >
      {/* Badge de días restantes (Cuentas por Pagar) */}
      {daysLeft !== undefined && (
        <span className="absolute -top-3 -right-3 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow">
          <Clock className="h-3 w-3" /> {daysLeft} días
        </span>
      )}

      {/* Nombre del cliente */}
      <div
        className={`mb-3 rounded-full px-4 py-1.5 text-center ${
          isPending ? "bg-rose-950" : "bg-white"
        }`}
      >
        <span
          className={`text-sm font-medium ${
            isPending ? "text-white" : "text-gray-800"
          }`}
        >
          {clientLabel}: {client}
        </span>
      </div>

      {/* Contenido */}
      <div className="mb-3 flex gap-3">
        {image ? (
          <img
            src={image}
            alt={client}
            className="h-20 w-20 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-black/10">
            <UserRound className="h-9 w-9 text-gray-500" />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${pillClass}`}
          >
            <Banknote className="h-3 w-3" /> Monto: ${amount}
          </span>

          {pendingBalance !== undefined && (
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${pillClass}`}
            >
              <Clock className="h-3 w-3" /> Saldo pendiente: ${pendingBalance}
            </span>
          )}

          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusColors[status]}`}
          >
            <CheckCircle2 className="h-3 w-3" /> Estado: {status}
          </span>

          {showProducts && (
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${pillClass}`}
            >
              <Package className="h-3 w-3" /> {productsLabel}
            </span>
          )}
        </div>
      </div>

      {/* Fecha */}
      <div
        className={`mb-2 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs ${pillClass}`}
      >
        <Clock className="h-3 w-3" /> Fecha de vencimiento: {dueDate}
      </div>

      {/* Botón de menú (kebab) */}
      <div className="relative flex justify-end" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir acciones"
          aria-expanded={menuOpen}
          className={`rounded-full p-1.5 transition-colors ${
            isPending
              ? "hover:bg-rose-800/40 text-white"
              : "hover:bg-white/60 text-gray-700"
          }`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {/* Popup de acciones */}
        {menuOpen && (
          <EntityActionsMenu
            className="bottom-8 right-0"
            onUpdate={onUpdate}
            onDetails={onDetails}
            onDelete={onDelete}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountCard;
