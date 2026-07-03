import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "../components/Button";
import InventoryCard from "../components/Cards/InventoryCard";
import InventoryForm from "../forms/InventoryForm";
import InventoryDetailsModal from "../components/InventoryDetailsModal";

import confirmToast from "../utils/confirmToast";

import useFetchInventory from "../hooks/Inventory/useFetchInventory";
import useInventoryActions from "../hooks/Inventory/useInventoryActions";

const Inventory = () => {
  const { inventory, getInventory, loading } = useFetchInventory();

  const {
    createInventory,
    updateInventory,
    deleteInventory,
  } = useInventoryActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);

  const openCreateForm = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openUpdateForm = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append("stock", data.stock);
    formData.append("location", data.location);
    formData.append("expirationDate", data.expirationDate);

    if (data.image) {
      formData.append("image", data.image);
    }

    const result = editingItem
      ? await updateInventory(editingItem._id, formData)
      : await createInventory(formData);

    if (result.ok) {
      await getInventory();
      closeForm();
    }
  };

  const handleDelete = async (item) => {
    const confirmed = await confirmToast(
      `Delete "${item.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const result = await deleteInventory(item._id);

    if (result.ok) {
      await getInventory();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-white">
          Loading inventory...
        </p>
      </div>
    );
  }

  return (
    <div>
      <InventoryForm
        id="inventory-form"
        isOpen={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSave}
        initialData={editingItem}
      />

      <InventoryDetailsModal
        id="inventory-details"
        inventory={detailsItem}
        onClose={() => setDetailsItem(null)}
      />

      <div className="mb-20 flex items-center justify-between">
        <h1 className="mt-6 mb-12 text-3xl font-semibold text-white">
          Inventory
        </h1>

        <Button
          text="New Product"
          icon={Plus}
          onClick={openCreateForm}
        />
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <InventoryCard
                key={item._id}
                image={item.image}
                name={item.name}
                sku={item.sku}
                stock={item.stock}
                location={item.location}
                expirationDate={
                  item.expirationDate
                    ? new Date(item.expirationDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onUpdate={() => openUpdateForm(item)}
                onDetails={() => setDetailsItem(item)}
                onDelete={() => handleDelete(item)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-center text-white text-lg">
                No inventory records found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;