import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pedidosApi } from "../services/api";
import { useCart } from "../context/CartContext";

export default function PaymentStatus() {
  const { id } = useParams();
  const { clear } = useCart();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let timer;
    async function refresh() {
      try {
        const result = await pedidosApi.get(id);
        if (!active) return;
        setOrder(result);
        if (result.pago_estado === "Pagado" || result.pago_estado === "Prueba") clear();
        else timer = setTimeout(refresh, 4000);
      } catch (err) { if (active) setError(err.message); }
    }
    refresh();
    return () => { active = false; clearTimeout(timer); };
  }, [id]);
  return <section className="mx-auto max-w-lg px-5 py-20 text-center text-stardust">
    <h1 className="font-display text-3xl">Estado de tu pago</h1>
    {error && <p role="alert" className="mt-4 text-coral">{error}</p>}
    {order && <><p className="mt-4">Pedido {id} · ${order.total_pedido.toFixed(2)}</p>
      <p className="mt-2">{order.pago_estado === "Pagado" ? "Pago confirmado. ¡Gracias por tu compra!" : order.pago_estado === "Prueba" ? "Pago de prueba registrado; no se realizó un cobro real." : "Esperando la confirmación segura de Wompi. Puedes volver a esta página más tarde."}</p>
      {order.pago_estado === "Pendiente" && order.wompi_url && <a className="mt-4 block text-bloom underline" href={order.wompi_url}>Volver al pago</a>}</>}
    <Link to="/catalogo" className="mt-6 inline-block text-bloom underline">Volver al catálogo</Link>
  </section>;
}
