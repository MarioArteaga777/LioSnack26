import { Plus, Users } from "lucide-react";
import { useState } from "react";
import CustomerCard from "../components/Cards/CustomerCard";
import CustomerDetailsModal from "../components/Cards/CustomerDetailsModal";
import Button from "../components/Button";
import CustomerForm from "../forms/CustomerForm";
import confirmToast from "../utils/confirmToast";
import useFetchClientes from "../hooks/Customers/useFetchClientes";
import useClientesActions from "../hooks/Customers/useClientesActions";

const Customers = () => {
  const { clientes, getClientes, loading } = useFetchClientes();
  const { createCliente, updateCliente, deleteCliente } = useClientesActions();
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
      Object.entries(fields).forEach(([key, value]) => formData.append(key, value ?? ""));
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
      `¿Eliminar a "${client.name}"? Esta acción no se puede deshacer.`
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

      {clientes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-7">
          {clientes.map((client) => (
            <CustomerCard
              key={client._id}
              name={client.name}
              type={client.type}
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
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <Users className="h-10 w-10 text-white/60" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">
              Aún no hay clientes registrados
            </h2>
            <p className="max-w-sm text-sm text-white/60">
              Cuando registres un cliente, empresa o persona, aparecerá aquí con sus datos de contacto.
            </p>
          </div>

          <Button text="Registrar Cliente" icon={Plus} size="md" onClick={openCreateForm} />
        </div>
      )}
    </div>
  );
};

export default Customers;
