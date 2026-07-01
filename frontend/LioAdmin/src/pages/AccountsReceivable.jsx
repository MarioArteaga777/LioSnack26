import { Plus, Coins, AlertCircle, Wallet, Users, UserCheck, UserX } from "lucide-react";
import Button from "../components/Button";
import StatsPanel from "../components/StatsPanel";
import ClientAccountCard from "../components/ClientAccountCard";
import snackImg from "../assets/snack-manzana.jpg";

const stats = [
  { icon: Coins, label: "Cuentas Cobradas", value: "15/43" },
  { icon: AlertCircle, label: "Cuentas Pendientes", value: "28/43" },
  { icon: Wallet, label: "Abonos Recibidos", value: "5" },
  { icon: Users, label: "Clientes Totales", value: "104" },
  { icon: UserCheck, label: "Clientes Cobrados", value: "54/104" },
  { icon: UserX, label: "Clientes Pendientes", value: "50/104" },
];

const accounts = [
  { id: 1, client: "Don pepito", amount: 29.55, status: "Cobrado", dueDate: "02/04/2026", image: snackImg },
  { id: 2, client: "Don pepito", amount: 29.55, status: "Cobrado", dueDate: "02/04/2026", image: snackImg },
  { id: 3, client: "Don pepito", amount: 29.55, status: "Pendiente", dueDate: "20/05/2026", image: snackImg },
];

const AccountsReceivable = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-white">Cuentas por Cobrar</h1>
        <Button text="Nueva cuenta" icon={Plus} onClick={() => {}} />
      </div>
      <button className="text-sm text-blue-400 hover:underline mb-4 block">
        ver todo
      </button>

      {/* Stats */}
      <StatsPanel stats={stats} />

      {/* Cards de clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <ClientAccountCard
            key={acc.id}
            client={acc.client}
            image={acc.image}
            amount={acc.amount}
            status={acc.status}
            dueDate={acc.dueDate}
            onUpdate={() => console.log("actualizar", acc.id)}
            onDetails={() => console.log("detalles", acc.id)}
            onDelete={() => console.log("eliminar", acc.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountsReceivable;