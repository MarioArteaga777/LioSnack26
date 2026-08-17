import { useEffect, useMemo, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Camera, UserRound } from "lucide-react";

const CustomerForm = ({ id, isOpen, onClose, onSubmit: onSave, initialData }) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object({
    name: yup.string().required("El nombre es requerido"),
    type: yup
      .string()
      .oneOf(["empresa", "persona"], "Selecciona un tipo válido")
      .required("El tipo de cliente es requerido"),
    address: yup.string().notRequired(),
    phone: yup.string().notRequired(),
    email: yup.string().email("Correo inválido").notRequired(),
    // La foto es opcional tanto al crear como al editar
    image: yup.mixed().notRequired(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { ref: imageFieldRef, ...imageField } = register("image");
  const fileInputRef = useRef(null);
  const selectedType = watch("type");
  const selectedFile = watch("image")?.[0];

  // Genera (y libera) una vista previa del archivo recién seleccionado
  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const avatarSrc = previewUrl ?? (isEditing ? initialData?.image : null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset({
        name: initialData?.name ?? "",
        type: initialData?.type ?? "persona",
        address: initialData?.address ?? "",
        phone: initialData?.phone ?? "",
        email: initialData?.email ?? "",
      });
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, initialData, reset]);

  const handleNativeClose = () => {
    onClose?.();
  };

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      type: data.type,
      address: data.address,
      phone: data.phone,
      email: data.email,
    };

    const file = data.image?.[0];

    if (file) {
      payload.image = file;
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
      <div className="w-[700px] rounded-2xl bg-[#1B022C] p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          {isEditing ? "Actualizar Cliente" : "Nuevo Cliente"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8">
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <input
                type="text"
                {...register("name")}
                placeholder="Nombre del cliente"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <select
                {...register("type")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
              >
                <option value="persona">Persona</option>
                <option value="empresa">Empresa</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("address")}
                placeholder="Dirección"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("phone")}
                placeholder="Número telefónico"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="Correo electrónico"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
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
                {isEditing ? "Guardar Cambios" : "Guardar Cliente"}
              </button>
            </div>
          </div>

          {/* Foto del cliente: click en el círculo para elegirla (opcional) */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Elegir foto del cliente"
              className="group relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-full bg-white/10"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Foto del cliente"
                  className="h-full w-full object-cover"
                />
              ) : selectedType === "empresa" ? (
                <Building2 className="h-20 w-20 text-white/70" />
              ) : (
                <UserRound className="h-20 w-20 text-white/70" />
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-9 w-9 text-white" />
              </div>
            </button>

            <p className="max-w-[12rem] text-center text-xs text-white/60">
              {isEditing
                ? "Deja vacío para conservar la foto actual."
                : "Haz click para agregar una foto (opcional)."}
            </p>

            {errors.image && (
              <p className="text-sm text-red-400">{errors.image.message}</p>
            )}

            <input
              {...imageField}
              ref={(element) => {
                imageFieldRef(element);
                fileInputRef.current = element;
              }}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CustomerForm;
