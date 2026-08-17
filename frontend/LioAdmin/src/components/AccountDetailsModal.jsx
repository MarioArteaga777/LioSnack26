import { useEffect, useRef } from "react";

const AccountDetailsModal = ({ id, account, onClose, clientLabel = "Cliente" }) => {
  const dialogRef = useRef(null);

  // Abre/cierra el <dialog> nativo según haya o no una cuenta seleccionada
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (account) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [account]);

  const handleNativeClose = () => {
    onClose?.();
  };

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={handleNativeClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/50"
    >
      {account && (
        <div className="w-[400px] rounded-2xl bg-[#1B022C] p-6 text-white">
          <h2 className="mb-6 text-xl font-semibold">Detalles de la cuenta</h2>

          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">{clientLabel}</dt>
              <dd className="font-medium text-right">{account.client}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Monto</dt>
              <dd className="font-medium">${account.amount}</dd>
            </div>
            {account.pendingBalance !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Saldo pendiente</dt>
                <dd className="font-medium">${account.pendingBalance}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Estado</dt>
              <dd className="font-medium">{account.status}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Fecha de vencimiento</dt>
              <dd className="font-medium">{account.dueDate}</dd>
            </div>
            {account.daysLeft !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Días restantes</dt>
                <dd className="font-medium">{account.daysLeft}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default AccountDetailsModal;
