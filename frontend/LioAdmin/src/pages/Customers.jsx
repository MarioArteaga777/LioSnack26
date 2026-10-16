import { Plus, Users } from "lucide-react";
import { useState } from "react";
import CustomerCard from "../components/Cards/CustomerCard";
import CustomerDetailsModal from "../components/Cards/CustomerDetailsModal";
import Button from "../components/Button";
import CustomerForm from "../forms/CustomerForm";
import confirmToast from "../utils/confirmToast";
import useFetchClientes from "../hooks/Customers/useFetchClientes";
import useClientesActions from "../hooks/Customers/useClientesActions";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useGlobalSearch } from "../context/SearchContext";
import filterItems from "../utils/filterItems";
import EmptyState from "../components/EmptyState";

const Customers = () => {
  const { clientes, getClientes, loading } = useFetchClientes();
  const { createCliente, updateCliente, deleteCliente } = useClientesActions();
  const { query } = useGlobalSearch();
  const filteredCustomers = filterItems(clientes, query, (client) => [
    client.name,
    client.lastName,
    client.email,
    client.phone,
    client.address,
  ]);
  const { currentPage, setCurrentPage, totalPages, pageItems } = usePagination(filteredCustomers, 12, query);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [detailsClient, setDetailsClient] = useState(null);

  const openCreateForm = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const openUpdateForm = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  // Si el modal incluyó una foto, se envía todo junto como FormData
  const handleSaveClient = async (data) => {
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

    const result = editingClient
      ? await updateCliente(editingClient._id, payload)
      : await createCliente(payload);

    if (result.ok) {
      await getClientes();
      closeForm();
    }
  };

  const handleDelete = async (client) => {
    const confirmed = await confirmToast(
      `¿Eliminar a "${client.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    const result = await deleteCliente(client._id);
    if (result.ok) {
      await getClientes();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div>
      <CustomerForm
        id="customer-form"
        isOpen={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSaveClient}
        initialData={editingClient}
      />

      <CustomerDetailsModal
        id="customer-details"
        client={detailsClient}
        onClose={() => setDetailsClient(null)}
      />

      <div className="flex items-center justify-between mb-20">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
          Clientes
        </h1>

        <Button text="Nuevo Cliente" icon={Plus} onClick={openCreateForm} />
      </div>

      {filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {pageItems.map((client) => (
            <CustomerCard
              key={client._id}
              name={client.name}
              lastName={client.lastName}
              address={client.address}
              phone={client.phone}
              email={client.email}
              image={client.image}
              onUpdate={() => openUpdateForm(client)}
              onDetails={() => setDetailsClient(client)}
              onDelete={() => handleDelete(client)}
            />
          ))}
        </div>
      ) : clientes.length > 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-5 py-10 text-center text-white/70">
          No se encontraron clientes con esa búsqueda.
        </p>
      ) : (
        <EmptyState
          icon={Users}
          title="Aún no hay clientes registrados"
          description="Los clientes que se registren en LioSnacks_Web o en la app móvil aparecerán aquí; también puedes agregarlos manualmente."
          actionLabel="Registrar cliente"
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

export default Customers;
