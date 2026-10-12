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
import useFetchProveedores from "../hooks/Providers/useFetchProveedores";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useGlobalSearch } from "../context/SearchContext";
import filterItems from "../utils/filterItems";
import EmptyState from "../components/EmptyState";

// Convierte una cuenta por pagar real (backend) al formato que ya
// entienden AccountCard / AccountDetailsModal (client, amount, status...).
const toDisplayAccount = (cuenta, proveedores) => {
  const proveedorInfo = proveedores.find(
    (proveedor) => proveedor.name === cuenta.proveedor,
  );

  return {
    _id: cuenta._id,
    client: cuenta.proveedor || "Sin proveedor",
    image: proveedorInfo?.image,
    amount: Number(cuenta.monto_total || 0).toFixed(2),
    pendingBalance: Number(
      cuenta.saldo_pendiente ??
        Math.max((cuenta.monto_total || 0) - (cuenta.pagos_realizados || 0), 0),
    ).toFixed(2),
    status: cuenta.estado || "Pendiente",
    dueDate: formatFechaCuenta(cuenta.fecha_vencimiento),
    daysLeft: cuenta.dias_para_vencer,
    raw: cuenta,
  };
};

const AccountsPayable = () => {
  const { cuentasPP, getCuentasPP, loading } = useFetchCuentasPP();
  const { createCuentaPP, updateCuentaPP, deleteCuentaPP } =
    useCuentasPPActions();
  const { proveedores } = useFetchProveedores();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [detailsAccount, setDetailsAccount] = useState(null);

  const displayAccounts = cuentasPP.map((cuenta) =>
    toDisplayAccount(cuenta, proveedores),
  );
  const { query } = useGlobalSearch();
  const filteredAccounts = filterItems(displayAccounts, query, (account) => [
    account.client,
    account.amount,
    account.pendingBalance,
    account.status,
    account.dueDate,
    account.raw.numero_factura,
    account.raw.descripcion,
  ]);
  const { currentPage, setCurrentPage, totalPages, pageItems } = usePagination(filteredAccounts, 9, query);
  const pagadas = displayAccounts.filter(
    (acc) => acc.status === "Pagado",
  ).length;
  const pendientes = displayAccounts.length - pagadas;

  const stats = [
    { icon: Wallet, label: "Cuentas", value: String(displayAccounts.length) },
    {
      icon: AlertTriangle,
      label: "Cuentas pendientes",
      value: `${pendientes}/${displayAccounts.length}`,
    },
    {
      icon: DollarSign,
      label: "Cuentas pagadas",
      value: `${pagadas}/${displayAccounts.length}`,
    },
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
      `¿Eliminar la cuenta de "${cuenta.proveedor || "proveedor sin nombre"}"? Esta acción no se puede deshacer.`,
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
        proveedores={proveedores}
      />

      <AccountDetailsModal
        id="payable-account-details"
        account={detailsAccount}
        onClose={() => setDetailsAccount(null)}
        clientLabel="Proveedor"
      />

      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
          Cuentas por Pagar
        </h1>
        <Button text="Nueva cuenta" icon={Plus} onClick={openCreateForm} />
      </div>

      {/* Stats */}
      <StatsPanel stats={stats} />

      {/* Cards de cuentas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAccounts.length > 0 ? (
          pageItems.map((acc) => (
            <AccountCard
              key={acc._id}
              client={acc.client}
              clientLabel="Proveedor"
              image={acc.image}
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
        ) : displayAccounts.length > 0 ? (
          <p className="col-span-full rounded-xl border border-white/10 bg-white/5 px-5 py-10 text-center text-white/70">
            No se encontraron cuentas con esa búsqueda.
          </p>
        ) : (
          <EmptyState
            icon={Receipt}
            title="Aún no hay cuentas por pagar"
            description="Registra una cuenta para consultar el saldo, vencimiento y proveedor desde aquí."
            actionLabel="Registrar cuenta"
            onAction={openCreateForm}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AccountsPayable;
