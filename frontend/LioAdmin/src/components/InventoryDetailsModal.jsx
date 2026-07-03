import { useEffect, useRef } from "react";

const InventoryDetailsModal = ({ id, inventory, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (inventory && !dialog.open) {
      dialog.showModal();
    }

    if (!inventory && dialog.open) {
      dialog.close();
    }
  }, [inventory]);

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  if (!inventory) return null;

  const getStockColor = () => {
    const stock = Number(inventory.stock);

    if (stock <= 5) return "bg-red-500/20 text-red-300";
    if (stock <= 15) return "bg-yellow-500/20 text-yellow-300";

    return "bg-green-500/20 text-green-300";
  };

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={onClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60"
    >
      <div className="w-[550px] rounded-2xl bg-[#1B022C] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Inventory Details
          </h2>

          <button
            type="button"
            onClick={closeDialog}
            className="text-xl text-white transition hover:text-red-400"
          >
            X
          </button>
        </div>

        {inventory.image && (
          <div className="mb-6 flex h-40 items-center justify-center">
            <img
              src={inventory.image}
              alt={inventory.name}
              className="h-full object-contain"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 text-sm">
          <div>
            <p className="text-gray-400">Name</p>
            <p className="text-white">{inventory.name}</p>
          </div>

          <div>
            <p className="text-gray-400">SKU</p>
            <p className="text-white">{inventory.sku}</p>
          </div>

          <div>
            <p className="text-gray-400">Stock</p>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStockColor()}`}
            >
              {inventory.stock}
            </span>
          </div>

          <div>
            <p className="text-gray-400">Location</p>
            <p className="text-white">{inventory.location}</p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-400">Expiration Date</p>
            <p className="text-white">
              {new Date(inventory.expirationDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-lg bg-sky-500 px-6 py-2 text-white transition hover:bg-sky-600"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default InventoryDetailsModal;
