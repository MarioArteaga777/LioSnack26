import { UserRound, MoreVertical } from "lucide-react";
import useActionsMenu from "../../hooks/useActionsMenu";
import EntityActionsMenu from "./EntityActionsMenu";

/**
 * Card reutilizable para el CRUD de Usuarios.
 *
 * @param {string} name
 * @param {string} lastName
 * @param {boolean} isVerified
 * @param {string} [image]
 * @param {() => void} onUpdate
 * @param {() => void} onDetails
 * @param {() => void} onDelete
 */
const UserCard = ({
  name,
  lastName,
  isVerified,
  image,
  onUpdate,
  onDetails,
  onDelete,
}) => {
  const { open: menuOpen, setOpen: setMenuOpen, containerRef } = useActionsMenu();
  const hasActions = onUpdate || onDetails || onDelete;

  return (
    <div
      ref={containerRef}
      className={`group relative w-64 rounded-2xl p-4 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:ring-1 hover:ring-sky-400/40 ${
        isVerified ? "bg-[#2a1f5e]" : "bg-rose-800"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/10">
          {image ? (
            <img
              src={image}
              alt={`${name} ${lastName}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <UserRound className="h-12 w-12 text-white/70 transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>

        {/* Pills de información */}
        <div className="flex w-full flex-col gap-1.5">
          <span className="truncate rounded-full bg-white/10 px-3 py-1.5 text-center text-xs font-medium text-white">
            Nombre: {name}
          </span>

          <span className="truncate rounded-full bg-white/10 px-3 py-1.5 text-center text-xs font-medium text-white">
            Apellido: {lastName}
          </span>

          <span className="rounded-full bg-white/10 px-3 py-1.5 text-center text-xs font-medium text-white">
            Estado: {isVerified ? "Verificado" : "No verificado"}
          </span>
        </div>
      </div>

      {/* Botón de menú (kebab) */}
      {hasActions && (
        <div className="relative mt-2 flex justify-end">
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
  );
};

export default UserCard;
