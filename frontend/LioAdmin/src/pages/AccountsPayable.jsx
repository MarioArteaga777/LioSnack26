import { useState } from "react";
import { Plus, Wallet, AlertTriangle, DollarSign, Receipt } from "lucide-react";
import Button from "../components/Button";
import StatsPanel from "../components/StatPanel";
import AccountCard from "../components/Cards/AccountCard";
import PayableForm from "../forms/PayableForm";
import AccountDetailsModal from "../components/AccountDetailsModal";
import confirmToast from "../utils/confirmToast";
import { formatFechaCuenta } from "../utils/cuentaFormat";
import useFetchCuentasPP from "../hooks/Accounts/useFetchCuentasPP";
import useCuentasPPActions from "../hooks/Accounts/useCuentasPPActions";

// Convierte una cuenta por pagar real (backend) al formato que ya
// entienden AccountCard / AccountDetailsModal (client, amount, status...).
const toDisplayAccount = (cuenta) => ({
  _id: cuenta._id,
  client: cuenta.proveedor || "Sin proveedor",
  amount: Number(cuenta.monto_total || 0).toFixed(2),
  pendingBalance: Number(
    cuenta.saldo_pendiente ?? Math.max((cuenta.monto_total || 0) - (cuenta.pagos_realizados || 0), 0)
  ).toFixed(2),
  status: cuenta.estado || "Pendiente",
  dueDate: formatFechaCuenta(cuenta.fecha_vencimiento),
  daysLeft: cuenta.dias_para_vencer,
  raw: cuenta,
});

const AccountsPayable = () => {
  const { cuentasPP, getCuentasPP, loading } = useFetchCuentasPP();
  const { createCuentaPP, updateCuentaPP, deleteCuentaPP } = useCuentasPPActions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [detailsAccount, setDetailsAccount] = useState(null);

  const displayAccounts = cuentasPP.map(toDisplayAccount);
  const pagadas = displayAccounts.filter((acc) => acc.status === "Pagado").length;
  const pendientes = displayAccounts.length - pagadas;

  const stats = [
    { icon: Wallet, label: "Cuentas", value: String(displayAccounts.length) },
    { icon: AlertTriangle, label: "Cuentas pendientes", value: `${pendientes}/${displayAccounts.length}` },
    { icon: DollarSign, label: "Cuentas pagadas", value: `${pagadas}/${displayAccounts.length}` },
  ];

  const openCreateForm = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const openUpdateForm = (cuenta) => {
    setEditingAccount(cuenta);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
  };

  const handleSaveAccount = async (data) => {
    const result = editingAccount
      ? await updateCuentaPP(editingAccount._id, data)
      : await createCuentaPP(data);

    if (result.ok) {
      await getCuentasPP();
      closeForm();
    }
  };

  const handleDelete = async (cuenta) => {
    const confirmed = await confirmToast(
      `¿Eliminar la cuenta de "${cuenta.proveedor || "proveedor sin nombre"}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    const result = await deleteCuentaPP(cuenta._id);
    if (result.ok) {
      await getCuentasPP();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-white">Cargando cuentas por pagar...</p>
      </div>
    );
  }

  return (
    <div>
      <PayableForm
        id="payable-account-form"
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSaveAccount}
        initialData={editingAccount}
      />

      <AccountDetailsModal
        id="payable-account-details"
        account={detailsAccount}
        onClose={() => setDetailsAccount(null)}
        clientLabel="Proveedor"
      />

      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">Cuentas por Pagar</h1>
        <Button text="Nueva cuenta" icon={Plus} onClick={openCreateForm} />
      </div>

      {/* Stats */}
      <StatsPanel stats={stats} />

      {/* Cards de cuentas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayAccounts.length > 0 ? (
          displayAccounts.map((acc) => (
            <AccountCard
              key={acc._id}
              client={acc.client}
              clientLabel="Proveedor"
              amount={acc.amount}
              pendingBalance={acc.pendingBalance}
              status={acc.status}
              dueDate={acc.dueDate}
              daysLeft={acc.daysLeft}
              onUpdate={() => openUpdateForm(acc.raw)}
              onDetails={() => setDetailsAccount(acc)}
              onDelete={() => handleDelete(acc.raw)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <Receipt className="h-10 w-10 text-white/60" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">
                Aún no hay cuentas por pagar
              </h2>
              <p className="max-w-sm text-sm text-white/60">
                Cuando registres una factura pendiente de pago a un proveedor, aparecerá aquí con su monto y estado.
              </p>
            </div>

            <Button text="Nueva Cuenta" icon={Plus} size="md" onClick={openCreateForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPayable;
