import { Building2, UserRound, MoreVertical } from "lucide-react";
import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

const CustomerCard = ({
  name,
  type,
  address,
  phone,
  email,
  image,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    containerRef,
  } = useActionsMenu();
  const hasActions = onUpdate || onDetails || onDelete;
  const isEmpresa = type === "empresa";

  return (
    <div
      ref={containerRef}
      className="group relative w-72 overflow-hidden rounded-2xl bg-[#2A1F5E] p-5 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:ring-1 hover:ring-sky-400/40"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3D2F80] to-[#2A1F5E] opacity-90" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/10">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : isEmpresa ? (
              <Building2 className="h-8 w-8 text-white/70" />
            ) : (
              <UserRound className="h-8 w-8 text-white/70" />
            )}
          </div>
        </div>

        <h3 className="mb-3 text-center font-semibold text-white">{name}</h3>

        <div className="space-y-3 text-sm text-white">
          <div className="flex justify-between">
            <span className="text-white/70">Tipo</span>
            <span className="capitalize">{type}</span>
          </div>

          <div className="flex justify-between gap-2">
            <span className="shrink-0 text-white/70">Teléfono</span>
            <span className="truncate">{phone || "N/A"}</span>
          </div>

          <div className="flex justify-between gap-2">
            <span className="shrink-0 text-white/70">Correo</span>
            <span className="truncate">{email || "N/A"}</span>
          </div>

          <div className="flex justify-between gap-2">
            <span className="shrink-0 text-white/70">Dirección</span>
            <span className="truncate">{address || "N/A"}</span>
          </div>
        </div>

        {hasActions && (
          <div className="relative mt-4 flex justify-end">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Abrir acciones"
              aria-expanded={menuOpen}
              className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <EntityActionsMenu
                className="bottom-8 right-0"
                onUpdate={onUpdate}
                onDetails={onDetails}
                onDelete={onDelete}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
