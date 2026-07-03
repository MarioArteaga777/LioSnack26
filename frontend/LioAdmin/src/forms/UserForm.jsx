import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const UserForm = ({ id, isOpen, onClose, onSubmit: onSave, initialData }) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object().shape({
    name: yup.string().required("El nombre es requerido").min(3, "Mínimo 3 caracteres").max(15, "Máximo 15 caracteres"),
    lastName: yup.string().required("El apellido es requerido"),
    email: yup.string().email("Correo inválido").required("El correo es requerido"),
    // Al editar no se exige volver a definir la contraseña
    password: isEditing
      ? yup.string().notRequired()
      : yup.string().required("La contraseña es requerida").min(6, "Mínimo 6 caracteres"),
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
        name: initialData?.name ?? "",
        lastName: initialData?.lastName ?? "",
        email: initialData?.email ?? "",
        password: "",
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
      lastName: data.lastName,
      email: data.email,
    };

    if (data.password) {
      payload.password = data.password;
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
          {isEditing ? "Actualizar Usuario" : "Nuevo Usuario"}
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

          <div>
            <input
              type="text"
              {...register("lastName")}
              placeholder="Apellido"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
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

          <div>
            <input
              type="password"
              {...register("password")}
              placeholder={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
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
              {isEditing ? "Guardar Cambios" : "Guardar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UserForm;
