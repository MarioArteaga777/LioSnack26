import { Plus, Coins, AlertCircle, Wallet, Users, UserCheck, UserX } from "lucide-react";
import Button from "../components/Button";
import StatsPanel from "../components/StatPanel";
import AccountCard from "../components/Cards/AccountCard";

const stats = [
  { icon: Coins, label: "Cuentas Cobradas", value: "15/43" },
  { icon: AlertCircle, label: "Cuentas Pendientes", value: "28/43" },
  { icon: Wallet, label: "Abonos Recibidos", value: "5" },
  { icon: Users, label: "Clientes Totales", value: "104" },
  { icon: UserCheck, label: "Clientes Cobrados", value: "54/104" },
  { icon: UserX, label: "Clientes Pendientes", value: "50/104" },
];

const accounts = [
  { id: 1, client: "Don pepito", amount: 29.55, status: "Cobrado", dueDate: "02/04/2026"},
  { id: 2, client: "Don pepito", amount: 29.55, status: "Cobrado", dueDate: "02/04/2026"},
  { id: 3, client: "Don pepito", amount: 29.55, status: "Pendiente", dueDate: "20/05/2026"},
];

const AccountsReceivable = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">Cuentas por Cobrar</h1>
        <Button text="Nueva cuenta" icon={Plus} onClick={() => {}} />
      </div>
      <button className="mb-4 block text-sm text-blue-400 hover:underline">
        ver todo
      </button>

      {/* Stats */}
      <StatsPanel stats={stats} />

      {/* Cards de clientes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <AccountCard
            key={acc.id}
            client={acc.client}
            image={acc.image}
            amount={acc.amount}
            status={acc.status}
            dueDate={acc.dueDate}
            showProducts
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
