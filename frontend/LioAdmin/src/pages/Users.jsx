import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import UserCard from "../components/Cards/UserCard";
import UserDetailsModal from "../components/Cards/UserDetailsModal";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import UserForm from "../forms/UserForm";
import confirmToast from "../utils/confirmToast";
import useFetchUsuarios from "../hooks/Users/useFetchUsuarios";
import useUsuariosActions from "../hooks/Users/useUsuariosActions";
import useBreakPoint from "../hooks/useBreakpoint";
import { useGlobalSearch } from "../context/SearchContext";
import filterItems from "../utils/filterItems";
import EmptyState from "../components/EmptyState";
import { Users as UsersIcon } from "lucide-react";

const ROWS_BY_BREAKPOINT = {
  base: 4,
  sm: 3,
  md: 3,
  lg: 3,
  xl: 3,
  "2xl": 2,
};

const COLUMNS_BY_BREAKPOINT = {
  base: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 5,
};

const ROLE_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "admin", label: "Administradores" },
  { value: "cliente", label: "Clientes" },
];

const Users = () => {
  const { usuarios, getUsuarios, loading } = useFetchUsuarios();
  const { createUsuario, updateUsuario, deleteUsuario } = useUsuariosActions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("todos");
  const { query } = useGlobalSearch();

  // Filtra por el rol seleccionado. Las cuentas antiguas sin rol se muestran
  // como clientes, igual que en la píldora "Rol" de cada tarjeta.
  const usersByRole = useMemo(
    () =>
      usuarios.filter((user) => {
        if (roleFilter === "admin") return user.role === "admin";
        if (roleFilter === "cliente") return user.role !== "admin";
        return true;
      }),
    [usuarios, roleFilter],
  );

  const filteredUsers = filterItems(usersByRole, query, (user) => [
    user.name,
    user.lastName,
    user.email,
    user.username,
    user.isVerified ? "verificado" : "pendiente",
  ]);

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  // Reinicia la paginación cuando cambia la búsqueda (ajuste durante el
  // render, en vez de un efecto que dispare un render en cascada).
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setCurrentPage(1);
  }

  const breakpoint = useBreakPoint();
  const columns = COLUMNS_BY_BREAKPOINT[breakpoint];
  const rows = ROWS_BY_BREAKPOINT[breakpoint];
  const USERS_PER_PAGE = columns * rows;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage, USERS_PER_PAGE]);

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

  // Decide si crea un usuario nuevo o actualiza el que se está editando.
  // Si el modal incluyó una foto, se envía todo junto como FormData.
  const handleSaveUser = async (data) => {
    const { image, ...fields } = data;

    let payload = fields;

    if (image) {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append("image", image);
      payload = formData;
    }

    if (editingUser) {
      const result = await updateUsuario(editingUser._id, payload);
      if (result.ok) {
        await getUsuarios();
        closeForm();
      }
    } else {
      const result = await createUsuario(payload);
      if (result.ok) {
        await getUsuarios();
        closeForm();
      }
    }
  };

  const handleDelete = async (user) => {
    const confirmed = await confirmToast(
      `¿Eliminar a "${user.name} ${user.lastName}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    const result = await deleteUsuario(user._id);
    if (result.ok) {
      await getUsuarios();
      // Ajusta la página actual por si la eliminación deja una página vacía
      setCurrentPage((prev) => {
        const remaining = usuarios.length - 1;
        const newTotalPages = Math.max(
          1,
          Math.ceil(remaining / USERS_PER_PAGE),
        );
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
      <div className="flex items-center justify-between mb-10">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
          Usuarios
        </h1>

        <Button text="Nuevo Usuario" icon={Plus} onClick={openCreateForm} />
      </div>

      {/* Filtro por rol */}
      <div className="mb-6 flex flex-wrap gap-2">
        {ROLE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleRoleFilter(filter.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              roleFilter === filter.value
                ? "bg-[#201D73] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Panel de usuarios */}
      <div className={filteredUsers.length > 0 ? "rounded-3xl bg-[#3b2d7a]/60 p-6" : ""}>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <UserCard
                  key={user._id}
                  name={user.name}
                  lastName={user.lastName}
                  role={user.role}
                  isVerified={user.isVerified}
                  image={user.image}
                  onUpdate={() => openUpdateForm(user)}
                  onDetails={() => setDetailsUser(user)}
                  onDelete={() => handleDelete(user)}
                />
              ))
            ) : (
              usuarios.length > 0 ? (
                <p className="text-white">
                  No se encontraron usuarios con esa búsqueda o ese filtro.
                </p>
              ) : (
                <EmptyState
                  icon={UsersIcon}
                  title="Aún no hay usuarios registrados"
                  description="Agrega un usuario para administrar sus datos y acceso desde este apartado."
                  actionLabel="Registrar usuario"
                  onAction={openCreateForm}
                />
              )
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
