import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toDateInputValue, diasParaVencer } from "../utils/cuentaFormat";

const FORMAS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "Cheque"];
const ESTADOS = ["Pendiente", "Pagado"];

const PayableForm = ({ id, isOpen, onClose, onSubmit, initialData }) => {
  const dialogRef = useRef(null);
  const isEditing = Boolean(initialData);

  const schema = yup.object().shape({
    fecha_factura: yup.string().required("La fecha de factura es requerida"),
    proveedor: yup.string().required("El proveedor es requerido"),
    concepto_material: yup.string().notRequired(),
    monto_total: yup
      .number()
      .typeError("El monto total debe ser un número")
      .min(0, "No puede ser negativo")
      .required("El monto total es requerido"),
    pagos_realizados: yup
      .number()
      .typeError("Los pagos realizados deben ser un número")
      .min(0, "No puede ser negativo")
      .notRequired(),
    fecha_vencimiento: yup.string().required("La fecha de vencimiento es requerida"),
    forma_pago: yup
      .string()
      .oneOf(FORMAS_PAGO, "Selecciona una forma de pago válida")
      .required("La forma de pago es requerida"),
    estado: yup
      .string()
      .oneOf(ESTADOS, "Selecciona un estado válido")
      .required("El estado es requerido"),
    notas: yup.string().notRequired(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset({
        fecha_factura: toDateInputValue(initialData?.fecha_factura) || toDateInputValue(new Date()),
        proveedor: initialData?.proveedor ?? "",
        concepto_material: initialData?.concepto_material ?? "",
        monto_total: initialData?.monto_total ?? "",
        pagos_realizados: initialData?.pagos_realizados ?? 0,
        fecha_vencimiento: toDateInputValue(initialData?.fecha_vencimiento) ?? "",
        forma_pago: initialData?.forma_pago ?? FORMAS_PAGO[0],
        estado: initialData?.estado ?? ESTADOS[0],
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
    const monto_total = Number(data.monto_total);
    const pagos_realizados = Number(data.pagos_realizados || 0);

    onSubmit?.({
      ...data,
      monto_total,
      pagos_realizados,
      saldo_pendiente: Math.max(monto_total - pagos_realizados, 0),
      dias_para_vencer: diasParaVencer(data.fecha_vencimiento),
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
          {isEditing ? "Actualizar Cuenta por Pagar" : "Nueva Cuenta por Pagar"}
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
            <input
              type="text"
              {...register("proveedor")}
              placeholder="Proveedor"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
            {errors.proveedor && (
              <p className="mt-1 text-sm text-red-400">{errors.proveedor.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register("concepto_material")}
              placeholder="Concepto / Material"
              className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                step="0.01"
                {...register("monto_total")}
                placeholder="Monto total"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.monto_total && (
                <p className="mt-1 text-sm text-red-400">{errors.monto_total.message}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                step="0.01"
                {...register("pagos_realizados")}
                placeholder="Pagos realizados"
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
              />
              {errors.pagos_realizados && (
                <p className="mt-1 text-sm text-red-400">{errors.pagos_realizados.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                {...register("forma_pago")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
              >
                {FORMAS_PAGO.map((forma) => (
                  <option key={forma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
              {errors.forma_pago && (
                <p className="mt-1 text-sm text-red-400">{errors.forma_pago.message}</p>
              )}
            </div>

            <div>
              <select
                {...register("estado")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-400">{errors.estado.message}</p>
              )}
            </div>
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

export default PayableForm;
