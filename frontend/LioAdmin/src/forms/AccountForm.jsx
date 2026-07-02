import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const AccountForm = ({
  id,
  isOpen,
  onClose,
  onSubmit,
  initialData,
  statusOptions,
  showPendingBalance = false,
}) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object().shape({
    client: yup.string().required("El cliente es requerido"),
    amount: yup
      .number()
      .typeError("El monto debe ser un número")
      .positive("El monto debe ser mayor a 0")
      .required("El monto es requerido"),
    pendingBalance: showPendingBalance
      ? yup
          .number()
          .typeError("El saldo pendiente debe ser un número")
          .min(0, "No puede ser negativo")
          .required("El saldo pendiente es requerido")
      : yup.number().notRequired(),
    status: yup
      .string()
      .oneOf(statusOptions, "Selecciona un estado válido")
      .required("El estado es requerido"),
    dueDate: yup.string().required("La fecha de vencimiento es requerida"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Abre/cierra el <dialog> nativo y precarga los datos al editar
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset(
        initialData ?? {
          client: "",
          amount: "",
          pendingBalance: "",
          status: statusOptions[0],
          dueDate: "",
        }
      );
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, initialData, reset, statusOptions]);

  const handleNativeClose = () => {
    onClose?.();
  };

  const submitForm = (data) => {
    onSubmit?.({
      ...data,
      amount: Number(data.amount),
      pendingBalance: showPendingBalance ? Number(data.pendingBalance) : undefined,
    });
    reset();
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
          {isEditing ? "Actualizar Cuenta" : "Nueva Cuenta"}
        </h2>

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              {...register("client")}
              placeholder="Cliente"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.client && (
              <p className="mt-1 text-sm text-red-400">{errors.client.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                step="0.01"
                {...register("amount")}
                placeholder="Monto"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
              )}
            </div>

            {showPendingBalance && (
              <div>
                <input
                  type="number"
                  step="0.01"
                  {...register("pendingBalance")}
                  placeholder="Saldo pendiente"
                  className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
                />
                {errors.pendingBalance && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.pendingBalance.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                {...register("status")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("dueDate")}
                placeholder="dd/mm/aaaa"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-400">{errors.dueDate.message}</p>
              )}
            </div>
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
              {isEditing ? "Guardar Cambios" : "Crear Cuenta"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AccountForm;
