import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ProductForm = ({
  id,
  isOpen,
  onClose,
  onSubmit: onSave,
  initialData,
}) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object({
    name: yup.string().required("Product name is required."),
    sku: yup.string().required("SKU is required."),
    price: yup
      .number()
      .typeError("Price must be a number.")
      .required("Price is required."),
    image: isEditing
      ? yup.mixed().notRequired()
      : yup.mixed().required("Product image is required."),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [preview, setPreview] = useState(null);
  const prevBlobRef = useRef(null);

  // Intenta detectar una URL de imagen existente en initialData
  const getExistingImageUrl = (data) => {
    if (!data) return null;
    return (
      data.imageUrl ||
      data.ImageUrl ||
      data.image ||
      data.Image ||
      data.Imagen ||
      null
    );
  };

  // Observa el input file y actualiza la preview
  useEffect(() => {
    // inicializar preview con imagen existente si existe
    if (isEditing) {
      setPreview(getExistingImageUrl(initialData));
    }

    const subscription = watch((value, { name }) => {
      if (name !== "image") return;

      const fileList = value.image;
      const file = fileList && fileList[0];

      // si hay un blob previo generado por createObjectURL, revocarlo
      if (prevBlobRef.current) {
        try {
          URL.revokeObjectURL(prevBlobRef.current);
        } catch (e) {
          /* ignore */
        }
        prevBlobRef.current = null;
      }

      if (file) {
        const url = URL.createObjectURL(file);
        prevBlobRef.current = url;
        setPreview(url);
        return;
      }

      // si no hay archivo seleccionado, restaurar imagen existente al editar
      setPreview(getExistingImageUrl(initialData));
    });

    return () => {
      subscription.unsubscribe && subscription.unsubscribe();
      if (prevBlobRef.current) {
        try {
          URL.revokeObjectURL(prevBlobRef.current);
        } catch (e) {
          /* ignore */
        }
        prevBlobRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, initialData, isEditing]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen) {
      reset({
        name: initialData?.Name ?? "",
        sku: initialData?.SKU ?? "",
        price: initialData?.Price ?? "",
      });

      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, initialData, reset]);

  const handleNativeClose = () => {
    onClose?.();
  };

  // Solo incluye la imagen en el envío si el usuario seleccionó una nueva
  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      sku: data.sku,
      price: Number(data.price),
    };

    const file = data.image?.[0];

    if (file) {
      payload.image = file;
    }

    onSave(payload);
    reset();
    onClose();
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
      <div className="w-[450px] rounded-2xl bg-[#1B022C] p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          {isEditing ? "Update Product" : "New Product"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              {...register("name")}
              placeholder="Product Name"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register("sku")}
              placeholder="SKU"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />

            {errors.sku && (
              <p className="mt-1 text-sm text-red-400">{errors.sku.message}</p>
            )}
          </div>

          <div className="relative">
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                watch("price") ? "text-gray-800" : "text-gray-500"
              }`}
            >
              $
            </span>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="Precio"
              className="w-full rounded-lg bg-gray-300 pl-6 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-400">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <div className="flex gap-4 items-start">
              <div className="w-32 h-32 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden border border-white/5">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-sm text-white/60 px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7a2 2 0 012-2h3l2 3h6l2-3h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                      />
                    </svg>
                    <span>No image</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
                />

                <div className="mt-2 flex items-center gap-3">
                  {isEditing && (
                    <p className="text-xs text-white/60">
                      Leave empty to keep current image.
                    </p>
                  )}

                  {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        // clear file input and preview
                        setValue("image", null);
                        if (prevBlobRef.current) {
                          try {
                            URL.revokeObjectURL(prevBlobRef.current);
                          } catch (e) {}
                          prevBlobRef.current = null;
                        }
                        setPreview(null);
                      }}
                      className="rounded-lg bg-white/10 px-4 py-1 text-xs text-white hover:bg-white/20 transition mt-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex justify-end gap-5 pt-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-sky-500 px-6 py-2 text-white transition hover:bg-sky-600"
                  >
                    {isEditing ? "Save Changes" : "Save Product"}
                  </button>
                </div>
              </div>
            </div>

            {isEditing && (
              <p className="mt-1 text-xs text-white/60">
                Leave empty to keep the current image.
              </p>
            )}

            {errors.image && (
              <p className="mt-1 text-sm text-red-400">
                {errors.image.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ProductForm;
