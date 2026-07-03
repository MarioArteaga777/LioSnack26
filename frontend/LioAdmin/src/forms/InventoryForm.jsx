import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const InventoryForm = ({
  id,
  isOpen,
  onClose,
  onSubmit: onSave,
  initialData,
}) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object({
    name: yup.string().required("Name is required"),
    sku: yup.string().required("SKU is required"),
    stock: yup
      .number()
      .typeError("Stock must be a number")
      .required("Stock is required"),
    location: yup.string().required("Location is required"),
    expirationDate: yup.string().required("Expiration date is required"),
    image: isEditing
      ? yup.mixed().notRequired()
      : yup
          .mixed()
          .test("required", "Image is required", (value) => value?.length > 0),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset({
        name: initialData?.name || "",
        sku: initialData?.sku || "",
        stock: initialData?.stock || "",
        location: initialData?.location || "",
        expirationDate: initialData?.expirationDate?.slice(0, 10) || "",
      });

      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen, initialData, reset]);

  const handleNativeClose = () => {
    onClose?.();
  };

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      sku: data.sku,
      stock: Number(data.stock),
      location: data.location,
      expirationDate: data.expirationDate,
    };

    const file = data.image?.[0];

    if (file) {
      payload.image = file;
    }

    onSave(payload);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={handleNativeClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/50"
    >
      <div className="w-[500px] rounded-2xl bg-[#1B022C] p-6">

        <h2 className="mb-6 text-xl font-semibold text-white">
          {isEditing ? "Update Inventory" : "New Inventory Item"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* NAME */}
          <div>
            <input
              type="text"
              {...register("name")}
              placeholder="Name"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* SKU */}
          <div>
            <input
              type="text"
              {...register("sku")}
              placeholder="SKU"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-400">
                {errors.sku.message}
              </p>
            )}
          </div>

          {/* STOCK */}
          <div>
            <input
              type="number"
              min="0"
              {...register("stock")}
              placeholder="Stock"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-400">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <input
              type="text"
              {...register("location")}
              placeholder="Location"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* EXPIRATION */}
          <div>
            <input
              type="date"
              {...register("expirationDate")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            />
            {errors.expirationDate && (
              <p className="mt-1 text-sm text-red-400">
                {errors.expirationDate.message}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            />

            {isEditing && (
              <p className="mt-1 text-xs text-white/60">
                Leave empty to keep current image
              </p>
            )}

            {errors.image && (
              <p className="mt-1 text-sm text-red-400">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-white/10 px-6 py-2 text-white hover:bg-white/20"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-6 py-2 text-white hover:bg-sky-600"
            >
              {isEditing ? "Save Changes" : "Save"}
            </button>

          </div>

        </form>

      </div>
    </dialog>
  );
};

export default InventoryForm;
