import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toDateInputValue } from "../utils/cuentaFormat";

const FORMAS_COBRO = ["Efectivo", "Transferencia", "Tarjeta", "Cheque"];

const ReceivableForm = ({
  id,
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clientes = [],
}) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object().shape({
    fecha_factura: yup.string().required("La fecha de factura es requerida"),
    cliente: yup.string().required("El cliente es requerido"),
    sku_descripcion: yup.string().notRequired(),
    fecha_vencimiento: yup.string().required("La fecha de vencimiento es requerida"),
    monto_facturado: yup
      .number()
      .typeError("El monto facturado debe ser un número")
      .min(0, "No puede ser negativo")
      .required("El monto facturado es requerido"),
    abono: yup
      .number()
      .typeError("El abono debe ser un número")
      .min(0, "No puede ser negativo")
      .notRequired(),
    forma_cobro: yup
      .string()
      .oneOf(FORMAS_COBRO, "Selecciona una forma de cobro válida")
      .required("La forma de cobro es requerida"),
    notas: yup.string().notRequired(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset({
        fecha_factura: toDateInputValue(initialData?.fecha_factura) || toDateInputValue(new Date()),
        cliente: initialData?.cliente ?? "",
        sku_descripcion: initialData?.sku_descripcion ?? "",
        fecha_vencimiento: toDateInputValue(initialData?.fecha_vencimiento) ?? "",
        monto_facturado: initialData?.monto_facturado ?? "",
        abono: initialData?.abono ?? 0,
        forma_cobro: initialData?.forma_cobro ?? FORMAS_COBRO[0],
        notas: initialData?.notas ?? "",
      });
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, initialData, reset]);

  const handleNativeClose = () => {
    onClose?.();
  };

  const handleCancel = () => {
    reset();
    onClose?.();
  };

  const submitForm = (data) => {
    onSubmit?.({
      ...data,
      monto_facturado: Number(data.monto_facturado),
      abono: Number(data.abono || 0),
    });
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
      <div className="w-[500px] rounded-2xl bg-[#1B022C] p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          {isEditing ? "Actualizar Cuenta por Cobrar" : "Nueva Cuenta por Cobrar"}
        </h2>

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-white/70">Fecha de factura</label>
              <input
                type="date"
                {...register("fecha_factura")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
              />
              {errors.fecha_factura && (
                <p className="mt-1 text-sm text-red-400">{errors.fecha_factura.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-white/70">Fecha de vencimiento</label>
              <input
                type="date"
                {...register("fecha_vencimiento")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
              />
              {errors.fecha_vencimiento && (
                <p className="mt-1 text-sm text-red-400">{errors.fecha_vencimiento.message}</p>
              )}
            </div>
          </div>

          <div>
            <select
              {...register("cliente")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            >
              <option value="">Selecciona un cliente</option>

              {initialData?.cliente &&
                !clientes.some((cliente) => cliente.name === initialData.cliente) && (
                  <option value={initialData.cliente}>{initialData.cliente}</option>
                )}

              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente.name}>
                  {cliente.name}
                </option>
              ))}
            </select>

            {clientes.length === 0 && (
              <p className="mt-1 text-xs text-white/60">
                No hay clientes registrados. Créalos en la sección Clientes.
              </p>
            )}

            {errors.cliente && (
              <p className="mt-1 text-sm text-red-400">{errors.cliente.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register("sku_descripcion")}
              placeholder="SKU / Descripción"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
          </div>

          <div>
            <div className="relative">
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  watch("monto_facturado") ? "text-gray-800" : "text-gray-500"
                }`}
              >
                $
              </span>
              <input
                type="number"
                step="0.01"
                {...register("monto_facturado")}
                placeholder="Monto facturado"
                className="w-full rounded-lg bg-gray-300 pl-6 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.monto_facturado && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.monto_facturado.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <select
              {...register("forma_cobro")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
            >
              {FORMAS_COBRO.map((forma) => (
                <option key={forma} value={forma}>
                  {forma}
                </option>
              ))}
            </select>
            {errors.forma_cobro && (
              <p className="mt-1 text-sm text-red-400">{errors.forma_cobro.message}</p>
            )}
          </div>

          <div>
            <textarea
              rows="3"
              {...register("notas")}
              placeholder="Notas"
              className="w-full resize-none rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
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

export default ReceivableForm;
