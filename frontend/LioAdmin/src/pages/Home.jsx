import { useState } from "react";
import { PackageCheck, Boxes, UserCheck, ClipboardList } from "lucide-react";
import KpiCard from "../components/Cards/KpiCard";
import OrderCard from "../components/Cards/OrderCard";
import OrderDetailsModal from "../components/Cards/OrderDetailsModal";
import useFetchPedidos from "../hooks/Orders/useFetchPedidos";
import useFetchUsuarios from "../hooks/Users/useFetchUsuarios";
import useFetchProductos from "../hooks/Products/useFetchProductos";
import useFetchProduction from "../hooks/Production/useFetchProduction";
import useAuth from "../hooks/useAuth";

// Cuántos pedidos recientes caben en el panel de inicio
const RECENT_ORDERS_LIMIT = 6;

const Home = () => {
  const { user } = useAuth();
  const { pedidos, loading } = useFetchPedidos();
  const { usuarios } = useFetchUsuarios();
  const { productos } = useFetchProductos();
  const { productions } = useFetchProduction();
  const [detailsPedido, setDetailsPedido] = useState(null);

  const verifiedUsers = usuarios.filter((usuario) => usuario.isVerified).length;

  // Solo producciones ya finalizadas, la más reciente primero
  const latestFinishedProduction = [...productions]
    .filter((production) => production.Estado === "Finalizado")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const latestProductionValue = latestFinishedProduction
    ? `${new Date(latestFinishedProduction.createdAt).toLocaleDateString("es-SV")} — ${latestFinishedProduction.SKU}`
    : "Sin producciones finalizadas";

  const pedidosPendientes = pedidos.filter(
    (pedido) => (pedido.estado_pedido || "Pendiente") === "Pendiente"
  ).length;

  const kpis = [
    { icon: PackageCheck, label: "Última producción", value: latestProductionValue },
    { icon: Boxes, label: "Productos registrados", value: String(productos.length) },
    { icon: UserCheck, label: "Usuarios verificados", value: `${verifiedUsers}/${usuarios.length}` },
    { icon: ClipboardList, label: "Pedidos pendientes", value: `${pedidosPendientes}/${pedidos.length}` },
  ];

  // Pedidos ordenados del más reciente al más antiguo, solo los que caben en el panel
  const recentOrders = [...pedidos]
    .sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido))
    .slice(0, RECENT_ORDERS_LIMIT);

  return (
    <div>
      <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
        Bienvenido, {user?.name}
      </h1>

      <OrderDetailsModal
        id="home-order-details"
        pedido={detailsPedido}
        onClose={() => setDetailsPedido(null)}
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ icon, label, value }) => (
          <KpiCard key={label} icon={icon} label={label} value={value} />
        ))}
      </div>

      {/* Recent orders panel */}
      <div className="bg-[#201D73] rounded-2xl shadow-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Pedidos recientes
        </h2>

        {loading ? (
          <p className="text-white/70">Cargando pedidos...</p>
        ) : recentOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentOrders.map((pedido) => (
              <OrderCard
                key={pedido._id}
                pedido={pedido}
                onDetails={() => setDetailsPedido(pedido)}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/70">Aún no hay pedidos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Home;