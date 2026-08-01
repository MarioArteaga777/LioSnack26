import { useEffect, useRef } from "react";
import { Building2, UserRound } from "lucide-react";

const CustomerDetailsModal = ({ id, client, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (client) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [client]);

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
      {client && (
        <div className="w-[400px] rounded-2xl bg-[#1B022C] p-6 text-white">
          <h2 className="mb-6 text-xl font-semibold">Detalles del cliente</h2>

          <div className="mb-4 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/10">
              {client.image ? (
                <img
                  src={client.image}
                  alt={client.name}
                  className="h-full w-full object-cover"
                />
              ) : client.type === "empresa" ? (
                <Building2 className="h-10 w-10 text-white/70" />
              ) : (
                <UserRound className="h-10 w-10 text-white/70" />
              )}
            </div>
          </div>

          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Nombre</dt>
              <dd className="text-right font-medium">{client.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Tipo</dt>
              <dd className="text-right font-medium capitalize">{client.type}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Dirección</dt>
              <dd className="text-right font-medium">{client.address || "N/A"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Teléfono</dt>
              <dd className="text-right font-medium">{client.phone || "N/A"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Correo</dt>
              <dd className="text-right font-medium">{client.email || "N/A"}</dd>
            </div>
            {client.createdAt && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Fecha de creación</dt>
                <dd className="text-right font-medium">
                  {new Date(client.createdAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default CustomerDetailsModal;
