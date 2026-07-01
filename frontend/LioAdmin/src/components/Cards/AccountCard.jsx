import { useState, useRef, useEffect } from "react";
import { Banknote, CheckCircle2, Package, Clock, MoreVertical } from "lucide-react";

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
 * @param {string} image
 * @param {number} amount
 * @param {number} [pendingBalance] - si se pasa, se muestra el pill de saldo pendiente
 * @param {"Cobrado"|"Pagado"|"Pendiente"} status
 * @param {string} dueDate
 * @param {boolean} [showProducts] - muestra el pill de "Productos" (usado en Cobrar)
 * @param {number} [daysLeft] - si se pasa, muestra el badge flotante de días (usado en Pagar)
 * @param {() => void} onUpdate
 * @param {() => void} onDetails
 * @param {() => void} onDelete
 */
const AccountCard = ({
  client,
  image,
  amount,
  pendingBalance,
  status,
  dueDate,
  showProducts = false,
  daysLeft,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const isPending = status === "Pendiente";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cierra el menú si el usuario hace click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pillClass = isPending
    ? "bg-rose-800/40 text-white"
    : "bg-white/60 text-gray-800";

  const handleAction = (action) => {
    setMenuOpen(false);
    action?.();
  };

  return (
    <div className={`relative rounded-2xl p-3 ${cardColors[status]}`}>
      {/* Badge de días restantes (Cuentas por Pagar) */}
      {daysLeft !== undefined && (
        <span className="absolute -top-3 -right-3 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow">
          <Clock className="h-3 w-3" /> {daysLeft} días
        </span>
      )}

      {/* Nombre del cliente */}
      <div className="mb-3 rounded-full bg-white px-4 py-1.5 text-center">
        <span className="text-sm font-medium text-gray-800">
          Cliente: {client}
        </span>
      </div>

      {/* Contenido */}
      <div className="mb-3 flex gap-3">
        <img
          src={image}
          alt={client}
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />
        <div className="flex flex-col gap-1.5">
          <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${pillClass}`}>
            <Banknote className="h-3 w-3" /> Monto: ${amount}
          </span>

          {pendingBalance !== undefined && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${pillClass}`}>
              <Clock className="h-3 w-3" /> Saldo pendiente: ${pendingBalance}
            </span>
          )}

          <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusColors[status]}`}>
            <CheckCircle2 className="h-3 w-3" /> Estado: {status}
          </span>

          {showProducts && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${pillClass}`}>
              <Package className="h-3 w-3" /> Productos
            </span>
          )}
        </div>
      </div>

      {/* Fecha */}
      <div className={`mb-2 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs ${pillClass}`}>
        <Clock className="h-3 w-3" /> Fecha de vencimiento: {dueDate}
      </div>

      {/* Botón de menú (kebab) */}
      <div className="relative flex justify-end" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir acciones"
          aria-expanded={menuOpen}
          className={`rounded-full p-1.5 transition-colors ${
            isPending ? "hover:bg-rose-800/40 text-white" : "hover:bg-white/60 text-gray-700"
          }`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {/* Popup de acciones */}
        {menuOpen && (
          <div className="absolute bottom-8 right-0 z-10 flex w-32 flex-col gap-1.5 rounded-xl bg-white/10 p-1.5 shadow-lg backdrop-blur-sm">
            <button
              onClick={() => handleAction(onUpdate)}
              className="rounded-full bg-sky-500 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-600"
            >
              Actualizar
            </button>
            <button
              onClick={() => handleAction(onDetails)}
              className="rounded-full bg-sky-500 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-600"
            >
              Detalles
            </button>
            <button
              onClick={() => handleAction(onDelete)}
              className="rounded-full bg-rose-600 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountCard;
