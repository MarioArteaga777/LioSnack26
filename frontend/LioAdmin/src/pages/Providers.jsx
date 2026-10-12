import { Plus, Truck } from "lucide-react";
import { useState } from "react";
import ProviderCard from "../components/Cards/ProviderCard";
import ProviderDetailsModal from "../components/Cards/ProviderDetailsModal";
import Button from "../components/Button";
import ProviderForm from "../forms/ProviderForm";
import confirmToast from "../utils/confirmToast";
import useFetchProveedores from "../hooks/Providers/useFetchProveedores";
import useProveedoresActions from "../hooks/Providers/useProveedoresActions";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useGlobalSearch } from "../context/SearchContext";
import filterItems from "../utils/filterItems";
import EmptyState from "../components/EmptyState";

const Providers = () => {
  const { proveedores, getProveedores, loading } = useFetchProveedores();
  const { createProveedor, updateProveedor, deleteProveedor } = useProveedoresActions();
  const { query } = useGlobalSearch();
  const filteredProviders = filterItems(proveedores, query, (provider) => [
    provider.name,
    provider.lastName,
    provider.type,
    provider.email,
    provider.phone,
    provider.address,
  ]);
  const { currentPage, setCurrentPage, totalPages, pageItems } = usePagination(filteredProviders, 12, query);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [detailsProvider, setDetailsProvider] = useState(null);

  const openCreateForm = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };

  const openUpdateForm = (provider) => {
    setEditingProvider(provider);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingProvider(null);
  };

  const handleSaveProvider = async (data) => {
    const { image, ...fields } = data;

    let payload = fields;

    if (image) {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) =>
        formData.append(key, value ?? ""),
      );
      formData.append("image", image);
      payload = formData;
    }

    const result = editingProvider
      ? await updateProveedor(editingProvider._id, payload)
      : await createProveedor(payload);

    if (result.ok) {
      await getProveedores();
      closeForm();
    }
  };

  const handleDelete = async (provider) => {
    const confirmed = await confirmToast(
      `¿Eliminar a "${provider.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    const result = await deleteProveedor(provider._id);
    if (result.ok) {
      await getProveedores();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Cargando proveedores...</p>
      </div>
    );
  }

  return (
    <div>
      <ProviderForm
        id="provider-form"
        isOpen={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSaveProvider}
        initialData={editingProvider}
      />

      <ProviderDetailsModal
        id="provider-details"
        provider={detailsProvider}
        onClose={() => setDetailsProvider(null)}
      />

      <div className="flex items-center justify-between mb-20">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
          Proveedores
        </h1>

        <Button text="Nuevo Proveedor" icon={Plus} onClick={openCreateForm} />
      </div>

      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {pageItems.map((provider) => (
            <ProviderCard
              key={provider._id}
              name={provider.name}
              type={provider.type}
              address={provider.address}
              phone={provider.phone}
              email={provider.email}
              image={provider.image}
              onUpdate={() => openUpdateForm(provider)}
              onDetails={() => setDetailsProvider(provider)}
              onDelete={() => handleDelete(provider)}
            />
          ))}
        </div>
      ) : proveedores.length > 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-5 py-10 text-center text-white/70">
          No se encontraron proveedores con esa búsqueda.
        </p>
      ) : (
        <EmptyState
          icon={Truck}
          title="Aún no hay proveedores registrados"
          description="Cuando registres un proveedor, empresa o persona, aparecerá aquí con sus datos de contacto."
          actionLabel="Registrar proveedor"
          onAction={openCreateForm}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Providers;
