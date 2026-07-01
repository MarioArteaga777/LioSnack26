import { Plus, Wallet, AlertTriangle, DollarSign } from "lucide-react";
import Button from "../components/Button";
import StatsPanel from "../components/StatPanel";
import AccountCard from "../components/Cards/AccountCard";

const stats = [
  { icon: Wallet, label: "Cuentas", value: "43" },
  { icon: AlertTriangle, label: "Cuentas pendientes", value: "28/43" },
  { icon: DollarSign, label: "Cuentas pagadas", value: "15/43" },
];

const accounts = [
  {
    id: 1,
    client: "Don pepito",
    amount: 29.55,
    pendingBalance: 0,
    status: "Pagado",
    dueDate: "02/04/2026",
  },
  {
    id: 2,
    client: "Don pepito",
    amount: 29.55,
    pendingBalance: 0,
    status: "Pagado",
    dueDate: "02/04/2026",
  },
  {
    id: 3,
    client: "Don pepito",
    amount: 29.55,
    pendingBalance: 10.5,
    status: "Pendiente",
    dueDate: "20/05/2026",
    daysLeft: 30,
  },
];

const AccountsPayable = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">Cuentas por Pagar</h1>
        <Button text="Nueva cuenta" icon={Plus} onClick={() => {}} />
      </div>
      <button className="mb-4 block text-sm text-blue-400 hover:underline">
        ver todo
      </button>

      {/* Stats */}
      <StatsPanel stats={stats} />

      {/* Cards de cuentas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <AccountCard
            key={acc.id}
            client={acc.client}
            image={acc.image}
            amount={acc.amount}
            pendingBalance={acc.pendingBalance}
            status={acc.status}
            dueDate={acc.dueDate}
            daysLeft={acc.daysLeft}
            onUpdate={() => console.log("actualizar", acc.id)}
            onDetails={() => console.log("detalles", acc.id)}
            onDelete={() => console.log("eliminar", acc.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountsPayable;
