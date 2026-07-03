import { Package, Boxes, Truck, ClipboardList } from "lucide-react";
import KpiCard from "../components/Cards/KpiCard";
import OrderItem from "../components/OrderItem";

const kpis = [
  { icon: Package, label: "Último stock", value: "16/04/2026 — Banana" },
  { icon: Boxes, label: "Productos disponibles", value: "3/8" },
  { icon: Truck, label: "Repartidor", value: "No Disponible" },
  { icon: ClipboardList, label: "Pedidos pendientes", value: "1/4" },
];

const recentOrders = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  product: "Snack liofilizado de manzana",
  status: "Finalizado",
}));

const Home = () => {
  return (
    <div>
      <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
        Bienvenido, administrador
      </h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentOrders.map((order) => (
            <OrderItem
              key={order.id}
              product={order.product}
              status={order.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;