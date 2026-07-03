import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import UserCard from "../components/Cards/UserCard";
import UserDetailsModal from "../components/Cards/UserDetailsModal";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import UserForm from "../forms/UserForm";
import confirmToast from "../utils/confirmToast";
import useFetchUsuarios from "../hooks/Users/useFetchUsuarios";
import useUsuariosActions from "../hooks/Users/useUsuariosActions";

const USERS_PER_PAGE = 8;

const Users = () => {
  const { usuarios, getUsuarios, loading } = useFetchUsuarios();
  const { createUsuario, updateUsuario, deleteUsuario } = useUsuariosActions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(usuarios.length / USERS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return usuarios.slice(start, start + USERS_PER_PAGE);
  }, [usuarios, currentPage]);

  const openCreateForm = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openUpdateForm = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (data) => {
    if (editingUser) {
      const result = await updateUsuario(editingUser._id, data);
      if (result.ok) {
        await getUsuarios();
        closeForm();
      }
    } else {
      const result = await createUsuario(data);
      if (result.ok) {
        await getUsuarios();
        closeForm();
      }
    }
  };

  const handleDelete = async (user) => {
    const confirmed = await confirmToast(
      `¿Eliminar a "${user.name} ${user.lastName}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    const result = await deleteUsuario(user._id);
    if (result.ok) {
      await getUsuarios();
      setCurrentPage((prev) => {
        const remaining = usuarios.length - 1;
        const newTotalPages = Math.max(1, Math.ceil(remaining / USERS_PER_PAGE));
        return Math.min(prev, newTotalPages);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div>
      <UserForm
        id="user-form"
        isOpen={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSaveUser}
        initialData={editingUser}
      />

      <UserDetailsModal
        id="user-details"
        user={detailsUser}
        onClose={() => setDetailsUser(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="mb-2 mt-6 text-2xl md:text-3xl font-semibold text-white">
          Usuarios
        </h1>

        <Button text="Nuevo Usuario" icon={Plus} onClick={openCreateForm} />
      </div>
      <button
        onClick={() => toast.info("Mostrando todos los usuarios")}
        className="mb-4 block text-sm text-blue-400 hover:underline"
      >
        ver todo
      </button>

      {/* Panel de usuarios */}
      <div className="rounded-3xl bg-[#3b2d7a]/60 p-6">
        <h2 className="mb-4 border-b border-white/10 pb-3 text-xl font-semibold text-white">
          Usuarios
        </h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <UserCard
                  key={user._id}
                  name={user.name}
                  lastName={user.lastName}
                  isVerified={user.isVerified}
                  onUpdate={() => openUpdateForm(user)}
                  onDetails={() => setDetailsUser(user)}
                  onDelete={() => handleDelete(user)}
                />
              ))
            ) : (
              <p className="text-white">No hay usuarios disponibles</p>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Users;
