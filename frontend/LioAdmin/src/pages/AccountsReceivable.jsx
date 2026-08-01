import { useState } from "react";
import { Plus, Coins, AlertCircle, Wallet, Users, Receipt } from "lucide-react";
import Button from "../components/Button";
import StatsPanel from "../components/StatPanel";
import AccountCard from "../components/Cards/AccountCard";
import ReceivableForm from "../forms/ReceivableForm";
import AccountDetailsModal from "../components/AccountDetailsModal";
import confirmToast from "../utils/confirmToast";
import { formatFechaCuenta, formatMonto } from "../utils/cuentaFormat";
import useFetchCuentasPC from "../hooks/Accounts/useFetchCuentasPC";
import useCuentasPCActions from "../hooks/Accounts/useCuentasPCActions";
import useFetchClientes from "../hooks/Customers/useFetchClientes";

// Convierte una cuenta por cobrar real (backend) al formato que ya
// entienden AccountCard / AccountDetailsModal (client, amount, status...).
const toDisplayAccount = (cuenta, clientes) => {
  const saldoPendiente = Number(cuenta.monto_facturado || 0) - Number(cuenta.abono || 0);
  const clienteInfo = clientes.find((c) => c.name === cuenta.cliente);

  return {
    _id: cuenta._id,
    client: cuenta.cliente || "Sin cliente",
    image: clienteInfo?.image,
    amount: Number(cuenta.monto_facturado || 0).toFixed(2),
    pendingBalance: Math.max(saldoPendiente, 0).toFixed(2),
    status: saldoPendiente <= 0 ? "Cobrado" : "Pendiente",
    dueDate: formatFechaCuenta(cuenta.fecha_vencimiento),
    productsLabel: cuenta.sku_descripcion || "Sin descripción",
    raw: cuenta,
  };
};

const AccountsReceivable = () => {
  const { cuentasPC, getCuentasPC, loading } = useFetchCuentasPC();
  const { createCuentaPC, updateCuentaPC, deleteCuentaPC } = useCuentasPCActions();
  const { clientes } = useFetchClientes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [detailsAccount, setDetailsAccount] = useState(null);

  const displayAccounts = cuentasPC.map((cuenta) => toDisplayAccount(cuenta, clientes));
  const cobradas = displayAccounts.filter((acc) => acc.status === "Cobrado").length;
  const pendientes = displayAccounts.length - cobradas;
  const totalAbonado = cuentasPC.reduce((sum, cuenta) => sum + Number(cuenta.abono || 0), 0);

  const stats = [
    { icon: Coins, label: "Cuentas Cobradas", value: `${cobradas}/${displayAccounts.length}` },
    { icon: AlertCircle, label: "Cuentas Pendientes", value: `${pendientes}/${displayAccounts.length}` },
    { icon: Wallet, label: "Total Abonado", value: formatMonto(totalAbonado) },
    { icon: Users, label: "Clientes Totales", value: String(clientes.length) },
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
      ? await updateCuentaPC(editingAccount._id, data)
      : await createCuentaPC(data);

    if (result.ok) {
      await getCuentasPC();
      closeForm();
    }
  };

  const handleDelete = async (cuenta) => {
    const confirmed = await confirmToast(
      `¿Eliminar la cuenta de "${cuenta.cliente || "cliente sin nombre"}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    const result = await deleteCuentaPC(cuenta._id);
    if (result.ok) {
      await getCuentasPC();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-white">Cargando cuentas por cobrar...</p>
      </div>
    );
  }

  return (
    <div>
      <ReceivableForm
        id="receivable-account-form"
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSaveAccount}
        initialData={editingAccount}
        clientes={clientes}
      />

      <AccountDetailsModal
        id="receivable-account-details"
        account={detailsAccount}
        onClose={() => setDetailsAccount(null)}
      />

      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">Cuentas por Cobrar</h1>
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
              image={acc.image}
              amount={acc.amount}
              pendingBalance={acc.pendingBalance}
              status={acc.status}
              dueDate={acc.dueDate}
              showProducts
              productsLabel={acc.productsLabel}
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
                Aún no hay cuentas por cobrar
              </h2>
              <p className="max-w-sm text-sm text-white/60">
                Cuando registres una factura pendiente de cobro, aparecerá aquí con su cliente, monto y estado.
              </p>
            </div>

            <Button text="Nueva Cuenta" icon={Plus} size="md" onClick={openCreateForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsReceivable;
