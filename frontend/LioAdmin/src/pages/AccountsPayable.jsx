import { Banknote, CheckCircle2, Package, Clock } from "lucide-react";

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

const ClientAccountCard = ({
  client,
  image,
  amount,
  pendingBalance,
  status,
  dueDate,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const isPending = status === "Pendiente";

  return (
    <div className={`rounded-2xl p-3 ${cardColors[status]}`}>
      {/* Nombre del cliente */}
      <div className="bg-white rounded-full px-4 py-1.5 mb-3 text-center">
        <span className="text-sm font-medium text-gray-800">
          Cliente: {client}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex gap-3 mb-3">
        <img
          src={image}
          alt={client}
          className="h-20 w-20 rounded-lg object-cover shrink-0"
        />
        <div className="flex flex-col gap-1.5">
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPending ? "bg-rose-800/40 text-white" : "bg-white/60 text-gray-800"}`}>
            <Banknote className="h-3 w-3" /> Monto: ${amount}
          </span>

          {pendingBalance !== undefined && (
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPending ? "bg-rose-800/40 text-white" : "bg-white/60 text-gray-800"}`}>
              <Clock className="h-3 w-3" /> Saldo pendiente: ${pendingBalance}
            </span>
          )}

          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusColors[status]}`}>
            <CheckCircle2 className="h-3 w-3" /> Estado: {status}
          </span>

          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPending ? "bg-rose-800/40 text-white" : "bg-white/60 text-gray-800"}`}>
            <Package className="h-3 w-3" /> Productos
          </span>
        </div>
      </div>

      {/* Fecha */}
      <div className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full mb-2 ${isPending ? "bg-rose-800/40 text-white" : "bg-white/60 text-gray-800"}`}>
        <Clock className="h-3 w-3" /> Fecha de vencimiento: {dueDate}
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onUpdate}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium py-1.5 rounded-full transition-colors"
        >
          Actualizar
        </button>
        <button
          onClick={onDetails}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium py-1.5 rounded-full transition-colors"
        >
          Detalles
        </button>
        <button
          onClick={onDelete}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium py-1.5 rounded-full transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ClientAccountCard;