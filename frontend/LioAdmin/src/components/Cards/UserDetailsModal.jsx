import { useEffect, useRef } from "react";

const UserDetailsModal = ({ id, user, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (user) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [user]);

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
      {user && (
        <div className="w-[400px] rounded-2xl bg-[#1B022C] p-6 text-white">
          <h2 className="mb-6 text-xl font-semibold">Detalles del usuario</h2>

          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Nombre</dt>
              <dd className="font-medium text-right">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Apellido</dt>
              <dd className="font-medium text-right">{user.lastName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Correo</dt>
              <dd className="font-medium text-right">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Estado</dt>
              <dd className="font-medium text-right">
                {user.isVerified ? "Verificado" : "No verificado"}
              </dd>
            </div>
            {user.loginAttempts !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Intentos de acceso</dt>
                <dd className="font-medium text-right">{user.loginAttempts}</dd>
              </div>
            )}
            {user.createdAt && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Registrado</dt>
                <dd className="font-medium text-right">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
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

export default UserDetailsModal;
