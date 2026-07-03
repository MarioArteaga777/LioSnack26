import { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Convierte una fecha (ISO de Mongo) al formato que espera
// un input datetime-local: "YYYY-MM-DDTHH:mm" en hora local.
const toDatetimeLocal = (fecha) => {
  if (!fecha) return "";

  const date = new Date(fecha);
  if (isNaN(date)) return "";

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const emptyItem = {
  sku: "",
  producto: "",
  cantidad_solicitada: 1,
  precio_unitario: 0,
};

const OrderForm = ({ id, isOpen, onClose, onSubmit: onSave, initialData }) => {
  const dialogRef = useRef(null);

  const schema = yup.object().shape({
    fecha_pedido: yup.string().required("La fecha del pedido es requerida"),

    cliente: yup.string().required("El cliente es requerido"),

    punto_de_venta: yup.string().required("El punto de venta es requerido"),

    vendedor_asignado: yup.string().required("El vendedor es requerido"),

    items: yup
      .array()
      .of(
        yup.object().shape({
          sku: yup.string(),
          producto: yup.string().required("El producto es requerido"),
          cantidad_solicitada: yup
            .number()
            .typeError("Debe ser un número")
            .min(1, "Mínimo 1")
            .required("Campo requerido"),
          precio_unitario: yup
            .number()
            .typeError("Debe ser un número")
            .min(0, "No puede ser negativo")
            .required("Campo requerido"),
        })
      )
      .min(1, "Agrega al menos un producto"),

    estado_pedido: yup.string().required("Seleccione un estado"),

    observaciones: yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { items: [emptyItem] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Total calculado en vivo a partir de los items.
  const watchedItems = watch("items");
  const total = (watchedItems || []).reduce(
    (sum, item) =>
      sum +
      (Number(item?.cantidad_solicitada) || 0) *
        (Number(item?.precio_unitario) || 0),
    0
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen) {
      reset({
        fecha_pedido: toDatetimeLocal(initialData?.fecha_pedido) ||
          toDatetimeLocal(new Date()),
        cliente: initialData?.cliente ?? "",
        punto_de_venta: initialData?.punto_de_venta ?? "",
        vendedor_asignado: initialData?.vendedor_asignado ?? "",
        items:
          initialData?.items?.length > 0
            ? initialData.items.map((item) => ({
                sku: item.sku ?? "",
                producto: item.producto ?? "",
                cantidad_solicitada: item.cantidad_solicitada ?? 1,
                precio_unitario: item.precio_unitario ?? 0,
              }))
            : [emptyItem],
        estado_pedido: initialData?.estado_pedido ?? "Pendiente",
        observaciones: initialData?.observaciones ?? "",
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
    // El total se calcula aquí para que el backend siempre
    // reciba un valor consistente con los items.
    const total_pedido = data.items.reduce(
      (sum, item) =>
        sum + item.cantidad_solicitada * item.precio_unitario,
      0
    );

    onSave({
      ...data,
      fecha_pedido: new Date(data.fecha_pedido).toISOString(),
      total_pedido,
    });

    reset();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60"
    >
      <div className="w-[560px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#1B022C] p-6">

        <h2 className="text-2xl font-semibold text-white mb-6">
          {initialData ? "Actualizar Pedido" : "Nuevo Pedido"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >

          <div>
            <label className="text-white text-sm">
              Fecha y hora del pedido
            </label>

            <input
              type="datetime-local"
              {...register("fecha_pedido")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2"
            />

            <p className="text-red-400 text-sm">
              {errors.fecha_pedido?.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <input
                {...register("cliente")}
                placeholder="Cliente"
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              />

              <p className="text-red-400 text-sm">
                {errors.cliente?.message}
              </p>
            </div>

            <div>
              <input
                {...register("punto_de_venta")}
                placeholder="Punto de venta"
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              />

              <p className="text-red-400 text-sm">
                {errors.punto_de_venta?.message}
              </p>
            </div>

          </div>

          <div>
            <input
              {...register("vendedor_asignado")}
              placeholder="Vendedor asignado"
              className="w-full rounded-lg bg-gray-300 px-3 py-2"
            />

            <p className="text-red-400 text-sm">
              {errors.vendedor_asignado?.message}
            </p>
          </div>

          {/* Items del pedido */}
          <div className="rounded-xl bg-white/5 p-4">

            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-semibold">
                Productos del pedido
              </p>

              <button
                type="button"
                onClick={() => append(emptyItem)}
                className="rounded-lg bg-sky-500 px-3 py-1 text-xs text-white hover:bg-sky-600 transition"
              >
                + Agregar producto
              </button>
            </div>

            <div className="flex flex-col gap-3">

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-2 items-start"
                >
                  <input
                    {...register(`items.${index}.sku`)}
                    placeholder="SKU"
                    className="rounded-lg bg-gray-300 px-2 py-2 text-sm"
                  />

                  <div>
                    <input
                      {...register(`items.${index}.producto`)}
                      placeholder="Producto"
                      className="w-full rounded-lg bg-gray-300 px-2 py-2 text-sm"
                    />
                    <p className="text-red-400 text-xs">
                      {errors.items?.[index]?.producto?.message}
                    </p>
                  </div>

                  <div>
                    <input
                      type="number"
                      {...register(`items.${index}.cantidad_solicitada`)}
                      placeholder="Cant."
                      className="w-full rounded-lg bg-gray-300 px-2 py-2 text-sm"
                    />
                    <p className="text-red-400 text-xs">
                      {errors.items?.[index]?.cantidad_solicitada?.message}
                    </p>
                  </div>

                  <div>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.precio_unitario`)}
                      placeholder="Precio"
                      className="w-full rounded-lg bg-gray-300 px-2 py-2 text-sm"
                    />
                    <p className="text-red-400 text-xs">
                      {errors.items?.[index]?.precio_unitario?.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="rounded-lg bg-rose-600 px-2 py-2 text-xs text-white hover:bg-rose-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </div>
              ))}

            </div>

            <p className="text-red-400 text-sm">
              {errors.items?.message}
            </p>

            <div className="flex justify-end mt-3 text-white font-semibold">
              Total: ${total.toFixed(2)}
            </div>

          </div>

          <div>
            <select
              {...register("estado_pedido")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <p className="text-red-400 text-sm">
              {errors.estado_pedido?.message}
            </p>
          </div>

          <div>
            <textarea
              rows="3"
              placeholder="Observaciones"
              {...register("observaciones")}
              className="w-full rounded-lg bg-gray-300 px-3 py-2 resize-none"
            />
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
              {initialData ? "Guardar Cambios" : "Guardar Pedido"}
            </button>

          </div>

        </form>

      </div>
    </dialog>
  );
};

export default OrderForm;
