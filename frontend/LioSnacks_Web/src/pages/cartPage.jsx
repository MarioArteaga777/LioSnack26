import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import useProducts from "../hooks/useProducts";

export default function CartPage() {
  const {
    cart,
    cartTotal,
    increment,
    decrement,
    remove,
    addToCart,
    setCartOpen,
  } = useCart();

  const { products } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    setCartOpen(false);
  }, [setCartOpen]);

  function agregarSugerencia(product) {
    addToCart(product);
    setCartOpen(false);
  }

  const productosEnCarrito = new Set(cart.map((item) => item.id));
  const sugerencias = products
    .filter((product) => !productosEnCarrito.has(product.id))
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 text-stardust sm:px-8">
      <h1 className="font-display text-3xl font-bold">Tu carrito</h1>

      {cart.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-nebula-border bg-void-soft p-8 text-center">
          <p>Tu carrito está vacío.</p>
          <Link
            to="/catalogo"
            className="mt-4 inline-block text-bloom underline"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-nebula-border bg-void-soft p-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 border-b border-nebula-border py-4 last:border-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-32 flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-mist">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement(item.id)}
                      aria-label={`Quitar una unidad de ${item.name}`}
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.qty}</span>

                    <button
                      type="button"
                      onClick={() => increment(item.id)}
                      aria-label={`Agregar una unidad de ${item.name}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <strong>${(item.price * item.qty).toFixed(2)}</strong>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Eliminar ${item.name}`}
                    className="text-mist hover:text-coral"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            {sugerencias.length > 0 && (
              <div className="rounded-2xl border border-nebula-border bg-void-soft p-5">
                <h2 className="font-display text-xl font-semibold">
                  También te puede interesar
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sugerencias.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-nebula-border bg-nebula p-3"
                    >
                      {product.imagePath && (
                        <img
                          src={product.imagePath}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-mist">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => agregarSugerencia(product)}
                        aria-label={`Agregar ${product.name}`}
                        className="rounded-full bg-bloom p-2 text-bloom-ink"
                      >
                        <Plus size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-nebula-border bg-void-soft p-5">
            <h2 className="font-display text-xl font-semibold">
              Resumen del pedido
            </h2>

            <div className="my-5 flex justify-between border-b border-nebula-border pb-4">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full rounded-full bg-bloom py-3 font-semibold text-bloom-ink"
            >
              Finalizar compra
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}