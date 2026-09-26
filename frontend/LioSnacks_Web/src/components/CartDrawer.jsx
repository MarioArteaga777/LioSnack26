import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({
  open,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const navigate = useNavigate();

  if (!open) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const cantidad = items.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  function irA(ruta) {
    onClose();
    navigate(ruta);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className="animate-drop absolute right-0 top-full z-50 mt-2 flex max-h-[min(75vh,580px)] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-nebula-border bg-void-soft text-stardust shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-nebula-border px-4 py-3">
          <h2 className="font-display font-semibold">Tu carrito</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="rounded-full p-1 text-mist hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="flex items-center gap-2 py-8 text-sm text-mist">
              <ShoppingBag size={20} />
              Tu carrito está vacío.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-nebula p-2"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="text-xs text-mist">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDecrement(item.id)}
                    aria-label={`Quitar una unidad de ${item.name}`}
                    className="text-mist hover:text-white"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="text-sm">{item.qty}</span>

                  <button
                    type="button"
                    onClick={() => onIncrement(item.id)}
                    aria-label={`Agregar una unidad de ${item.name}`}
                    className="text-mist hover:text-white"
                  >
                    <Plus size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Eliminar ${item.name}`}
                    className="text-coral"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-nebula-border p-4">
          <p className="mb-3 flex justify-between">
            <span>Subtotal</span>
            <strong>${total.toFixed(2)}</strong>
          </p>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => irA("/carrito")}
              className="w-full rounded-full border border-nebula-border py-3 text-sm font-semibold transition-colors hover:bg-nebula-light"
            >
              Ver carrito ({cantidad})
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => irA("/checkout")}
              className="w-full rounded-full bg-bloom py-3 text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:opacity-40"
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}