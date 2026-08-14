import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PackageCheck, ShoppingBag } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { pedidosApi } from "../services/api";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { cart, cartTotal, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    direccion: "",
    telefono: "",
    metodoPago: "Contra entrega",
    observaciones: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sin sesión, mandamos al login y luego regresamos aquí mismo.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  }

  // Con sesión pero sin nada en el carrito, no tiene sentido mostrar el checkout.
  if (cart.length === 0 && !success) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-5 text-center">
        <ShoppingBag className="h-10 w-10 text-mist-dim" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-semibold text-stardust">
          Tu carrito está vacío
        </h1>
        <p className="font-body text-sm text-mist">
          Añade snacks del catálogo antes de continuar con la compra.
        </p>
        <button
          onClick={() => navigate("/catalogo")}
          className="rounded-full bg-bloom px-6 py-2.5 font-body text-sm font-semibold text-bloom-ink hover:bg-bloom-dark"
        >
          Ir al catálogo
        </button>
      </section>
    );
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.direccion || !form.telefono) {
      setError("Ingresa tu dirección y teléfono para la entrega.");
      return;
    }

    setSubmitting(true);
    try {
      await pedidosApi.create({
        fecha_pedido: new Date().toISOString(),
        cliente: `${user.name} ${user.lastName}`,
        cliente_email: user.email,
        punto_de_venta: "Tienda en línea",
        vendedor_asignado: "Web",
        items: cart.map((item) => ({
          sku: item.id,
          producto: item.name,
          cantidad_solicitada: item.qty,
          precio_unitario: item.price,
        })),
        total_pedido: cartTotal,
        estado_pedido: "Pendiente",
        direccion_entrega: form.direccion,
        telefono: form.telefono,
        metodo_pago: form.metodoPago,
        observaciones: form.observaciones,
      });

      clear();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-5 text-center">
        <PackageCheck className="h-12 w-12 text-teal" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-semibold text-stardust">
          ¡Pedido recibido!
        </h1>
        <p className="font-body text-sm text-mist">
          Gracias, {user.name}. Tu pedido quedó registrado y pronto será preparado para envío.
        </p>
        <button
          onClick={() => navigate("/catalogo")}
          className="rounded-full bg-bloom px-6 py-2.5 font-body text-sm font-semibold text-bloom-ink hover:bg-bloom-dark"
        >
          Seguir explorando
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="animate-rise max-w-lg">
        <h1 className="font-display text-3xl font-semibold text-stardust sm:text-4xl">
          Finalizar compra
        </h1>
        <p className="mt-3 font-body text-sm text-mist">
          Confirma tus datos de entrega para completar tu pedido.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">
              Dirección de entrega
            </span>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle, número, colonia, ciudad"
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">Teléfono</span>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">
              Método de pago
            </span>
            <select
              name="metodoPago"
              value={form.metodoPago}
              onChange={handleChange}
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
            >
              <option>Contra entrega</option>
              <option>Transferencia bancaria</option>
              <option>Tarjeta</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">
              Observaciones (opcional)
            </span>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
            />
          </label>

          {error && <p className="font-body text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {submitting ? "Enviando pedido..." : "Confirmar pedido"}
          </button>
        </form>

        <aside className="h-fit rounded-xl border border-nebula-border bg-void-soft/80 p-5">
          <h2 className="font-display text-lg font-semibold text-stardust">Resumen</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between font-body text-sm text-mist">
                <span>
                  {item.qty} × {item.name}
                </span>
                <span className="text-stardust">${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-nebula-border pt-4 font-body text-sm">
            <span className="text-mist">Total</span>
            <span className="font-display text-lg font-semibold text-stardust">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
