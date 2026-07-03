import { useEffect, useRef } from "react";
import {
  estadoColor,
  formatFecha,
  formatHora,
  formatTotal,
} from "../../utils/pedidoFormat";

const OrderDetailsModal = ({ id, pedido, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (pedido) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [pedido]);

  const handleClose = () => {
    onClose?.();
  };

  if (!pedido) return null;

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={handleClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60"
    >
      <div className="w-[550px] rounded-2xl bg-[#1B022C] p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-semibold text-white">
            Detalles del Pedido
          </h2>

          <button
            onClick={() => dialogRef.current.close()}
            className="text-white text-xl hover:text-red-400 transition"
          >
            ✕
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="text-gray-400 text-sm">Cliente</p>
            <p className="text-white">{pedido.cliente || "Sin cliente"}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Estado</p>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor(
                pedido.estado_pedido
              )}`}
            >
              {pedido.estado_pedido || "Pendiente"}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Fecha del pedido</p>
            <p className="text-white">{formatFecha(pedido.fecha_pedido)}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Hora del pedido</p>
            <p className="text-white">{formatHora(pedido.fecha_pedido)}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Punto de venta</p>
            <p className="text-white">
              {pedido.punto_de_venta || "No asignado"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Vendedor asignado</p>
            <p className="text-white">
              {pedido.vendedor_asignado || "No asignado"}
            </p>
          </div>

        </div>

        {/* Items del pedido */}
        <div className="mt-6">

          <p className="text-gray-400 text-sm mb-2">Productos</p>

          <div className="rounded-xl bg-[#2A1F5E] overflow-hidden">

            <div className="grid grid-cols-4 gap-2 px-4 py-2 text-xs font-semibold text-white/70 border-b border-white/10">
              <span>SKU</span>
              <span>Producto</span>
              <span className="text-right">Cantidad</span>
              <span className="text-right">Precio</span>
            </div>

            {pedido.items?.length > 0 ? (
              pedido.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 px-4 py-2 text-sm text-white"
                >
                  <span>{item.sku || "-"}</span>
                  <span>{item.producto}</span>
                  <span className="text-right">
                    {item.cantidad_solicitada}
                  </span>
                  <span className="text-right">
                    {formatTotal(item.precio_unitario)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-white/70">
                Sin productos
              </p>
            )}

            <div className="flex justify-between px-4 py-3 border-t border-white/10 text-white font-semibold">
              <span>Total del pedido</span>
              <span>{formatTotal(pedido.total_pedido)}</span>
            </div>

          </div>

        </div>

        <div className="mt-6">

          <p className="text-gray-400 text-sm mb-2">Observaciones</p>

          <div className="min-h-[80px] rounded-xl bg-[#2A1F5E] p-4 text-white whitespace-pre-wrap">
            {pedido.observaciones || "Sin observaciones"}
          </div>

        </div>

        <div className="flex justify-end mt-8">

          <button
            onClick={() => dialogRef.current.close()}
            className="rounded-lg bg-sky-500 px-6 py-2 text-white transition hover:bg-sky-600"
          >
            Cerrar
          </button>

        </div>

      </div>
    </dialog>
  );
};

export default OrderDetailsModal;
