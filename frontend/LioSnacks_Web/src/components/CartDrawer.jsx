import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose, items, onIncrement, onDecrement, onRemove }) {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-nebula-border bg-void-soft/95 backdrop-blur-md transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de compras"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-nebula-border px-6 py-5">
          <h2 className="font-display text-lg font-semibold text-stardust">
            Tu carrito
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="rounded-full p-1.5 text-mist hover:bg-nebula-light hover:text-stardust"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="h-9 w-9 text-mist-dim" strokeWidth={1.5} />
              <p className="font-body text-sm text-mist">
                Tu carrito está vacío. Añade snacks del catálogo para empezar tu misión.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-nebula-border bg-nebula p-3"
                >
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-stardust">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-mist">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-nebula-border px-1.5 py-1">
                    <button
                      onClick={() => onDecrement(item.id)}
                      aria-label={`Quitar una unidad de ${item.name}`}
                      className="rounded-full p-1 text-mist hover:text-stardust"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center font-body text-sm text-stardust">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onIncrement(item.id)}
                      aria-label={`Añadir una unidad de ${item.name}`}
                      className="rounded-full p-1 text-mist hover:text-stardust"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                    className="rounded-full p-1.5 text-mist-dim hover:text-coral"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-nebula-border px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-body text-sm text-mist">Total</span>
            <span className="font-display text-xl font-semibold text-stardust">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalizar misión de compra
          </button>
        </div>
      </aside>
    </>
  );
}
