import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ProductForm = ({ id, isOpen, onClose, onSubmit: onSave, initialData }) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    price: yup.number().typeError("El precio debe ser un número").required("El precio es requerido"),
    description: yup.string().required("La descripción es requerida"),
    // Al editar no se exige volver a subir la imagen; se conserva la actual
    // si no se selecciona un archivo nuevo.
    image: isEditing ? yup.mixed().notRequired() : yup.mixed().required("La imagen es requerida"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Abre/cierra el <dialog> nativo y precarga los datos al editar
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // El input de imagen no se puede precargar por seguridad del navegador;
      // solo se reinician los campos de texto.
      reset({
        name: initialData?.name ?? "",
        price: initialData?.price ?? "",
        description: initialData?.description ?? "",
      });
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, initialData, reset]);

  // Si el usuario cierra con Escape (comportamiento nativo del <dialog>),
  // avisamos al padre para que isOpen quede en sync.
  const handleNativeClose = () => {
    onClose?.();
  };

  const onSubmit = (data) => {
    const payload = { name: data.name, price: Number(data.price), description: data.description };
    const file = data.image?.[0];

    if (file) {
      payload.image = URL.createObjectURL(file);
    }

    onSave?.(payload);
    reset();
    onClose?.();
  };

  const handleCancel = () => {
    reset();
    onClose?.();
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
          {isEditing ? "Actualizar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              {...register("name")}
              placeholder="Nombre"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("price")}
                placeholder="Precio"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>
              )}
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {isEditing && (
                <p className="mt-1 text-xs text-white/50">
                  Deja vacío para conservar la imagen actual.
                </p>
              )}
              {errors.image && (
                <p className="mt-1 text-sm text-red-400">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Descripción"
              rows={4}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-6 py-2 text-white transition hover:bg-sky-600"
            >
              {isEditing ? "Guardar Cambios" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ProductForm;
