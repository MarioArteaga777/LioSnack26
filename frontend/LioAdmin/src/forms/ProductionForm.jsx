import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ProductionForm = ({
  id,
  isOpen,
  onClose,
  onSubmit: onSave,
  initialData,
}) => {

  const dialogRef = useRef(null);

  const schema = yup.object().shape({
    SKU: yup.string().required("El SKU es requerido"),

    HoraInicio: yup.string().required("La hora de inicio es requerida"),

    HoraFinalizacion: yup
      .string()
      .required("La hora de finalización es requerida"),

    BolsasEsperadas: yup
      .number()
      .typeError("Debe ser un número")
      .required("Campo requerido"),

    HorasReales: yup
      .number()
      .typeError("Debe ser un número")
      .required("Campo requerido"),

    KG: yup
      .number()
      .typeError("Debe ser un número")
      .required("Campo requerido"),

    Observaciones: yup.string(),

    Estado: yup.string().required("Seleccione un estado"),
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
        SKU: initialData?.SKU ?? "",
        HoraInicio: initialData?.HoraInicio ?? "",
        HoraFinalizacion: initialData?.HoraFinalizacion ?? "",
        BolsasEsperadas: initialData?.BolsasEsperadas ?? "",
        HorasReales: initialData?.HorasReales ?? "",
        KG: initialData?.KG ?? "",
        Observaciones: initialData?.Observaciones ?? "",
        Estado: initialData?.Estado ?? "En proceso",
      });

      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, initialData]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60"
    >
      <div className="w-[520px] rounded-2xl bg-[#1B022C] p-6">

        <h2 className="text-2xl font-semibold text-white mb-6">
          {initialData ? "Actualizar Producción" : "Nueva Producción"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >

          <div>
            <input
              {...register("SKU")}
              placeholder="SKU"
              className="w-full rounded-lg bg-gray-300 px-4 py-3 outline-none"
            />
            <p className="text-red-400 text-sm">
              {errors.SKU?.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-white text-sm">
                Hora Inicio
              </label>

              <input
                type="time"
                {...register("HoraInicio")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              />

              <p className="text-red-400 text-sm">
                {errors.HoraInicio?.message}
              </p>
            </div>

            <div>
              <label className="text-white text-sm">
                Hora Finalización
              </label>

              <input
                type="time"
                {...register("HoraFinalizacion")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              />

              <p className="text-red-400 text-sm">
                {errors.HoraFinalizacion?.message}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <input
                type="number"
                placeholder="Bolsas Esperadas"
                {...register("BolsasEsperadas")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              />

              <p className="text-red-400 text-sm">
                {errors.BolsasEsperadas?.message}
              </p>

            </div>

            <div>

              <input
                type="number"
                placeholder="Horas Reales"
                {...register("HorasReales")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              />

              <p className="text-red-400 text-sm">
                {errors.HorasReales?.message}
              </p>

            </div>

          </div>

          <div>

            <input
              type="number"
              placeholder="Kilogramos"
              {...register("KG")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2"
            />

            <p className="text-red-400 text-sm">
              {errors.KG?.message}
            </p>

          </div>

          <div>

            <textarea
              rows="4"
              placeholder="Observaciones"
              {...register("Observaciones")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 resize-none"
            />

          </div>

          <div>

            <select
              {...register("Estado")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2"
            >
              <option value="En proceso">
                En proceso
              </option>

              <option value="Finalizado">
                Finalizado
              </option>

              <option value="Cancelado">
                Cancelado
              </option>

            </select>

          </div>

          <div className="flex justify-end gap-3 mt-3">

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-white/10 px-6 py-2 text-white hover:bg-white/20 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-6 py-2 text-white hover:bg-sky-600 transition"
            >
              {initialData ? "Guardar Cambios" : "Guardar Producción"}
            </button>

          </div>

        </form>

      </div>
    </dialog>
  );
};

export default ProductionForm;