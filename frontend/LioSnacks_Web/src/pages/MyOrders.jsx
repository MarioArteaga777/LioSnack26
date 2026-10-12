import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { pedidosApi } from "../services/api";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha pendiente";
  return date.toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(value) {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await pedidosApi.getMine());
    } catch (loadError) {
      setError(loadError.message || "No pudimos cargar tus pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadOrders();
  }, [isAuthenticated, loadOrders]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/mis-pedidos" }} replace />;
  }

  return (
    <section className="mx-auto min-h-[60vh] max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-end justify-between gap-4 border-b border-nebula-border pb-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-teal">
            <Package className="h-5 w-5" />
            <span className="font-body text-xs font-semibold uppercase tracking-widest">
              Cuenta
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-stardust sm:text-3xl">
            Mis pedidos
          </h1>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="rounded-lg border border-nebula-border px-3 py-2 font-body text-sm text-mist hover:text-stardust disabled:opacity-50"
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center font-body text-sm text-mist">Cargando pedidos...</p>
      ) : error ? (
        <div className="py-12 text-center" role="alert">
          <p className="font-body text-sm text-coral">{error}</p>
          <button onClick={loadOrders} className="mt-4 text-sm text-bloom underline">
            Reintentar
          </button>
          {error.toLowerCase().includes("sesión") && (
            <Link to="/login" className="ml-4 text-sm text-bloom underline">
              Iniciar sesión
            </Link>
          )}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <ShoppingBag className="h-9 w-9 text-mist-dim" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-lg font-semibold text-stardust">
            Aún no tienes pedidos
          </h2>
          <p className="mt-1 font-body text-sm text-mist">
            Tus compras aparecerán aquí cuando completes un pedido.
          </p>
          <Link to="/catalogo" className="mt-5 text-sm text-bloom underline">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-nebula-border">
          {orders.map((order) => (
            <article key={order._id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs text-mist-dim">
                    Pedido #{String(order._id).slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-1 font-body text-sm font-medium text-stardust">
                    {formatDate(order.fecha_pedido || order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-md border border-teal/30 bg-teal/10 px-2 py-1 font-body text-xs text-teal">
                    {order.estado_pedido || "Pendiente"}
                  </span>
                  <p className="mt-2 font-display text-lg font-semibold text-stardust">
                    {formatPrice(order.total_pedido)}
                  </p>
                </div>
              </div>

              <ul className="mt-4 flex flex-col gap-2">
                {(order.items || []).map((item, index) => (
                  <li
                    key={`${item.sku || item.producto}-${index}`}
                    className="flex justify-between gap-4 font-body text-sm text-mist"
                  >
                    <span>{item.cantidad_solicitada || 1} × {item.producto || "Producto"}</span>
                    <span className="shrink-0 text-stardust">
                      {formatPrice((item.cantidad_solicitada || 1) * (item.precio_unitario || 0))}
                    </span>
                  </li>
                ))}
              </ul>

              {order.direccion_entrega && (
                <p className="mt-3 font-body text-xs text-mist-dim">
                  Entrega: {order.direccion_entrega}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}