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

import useFetchProductos from "../hooks/Products/useFetchProductos";

const OrderForm = ({
  id,
  isOpen,
  onClose,
  onSubmit: onSave,
  initialData,
  clientes = [],
  productos = [],
  vendedorAsignado = "",
}) => {
  const dialogRef = useRef(null);

  const ESTADOS = ["Pendiente", "Finalizado", "Cancelado"];
  const isEditing = Boolean(initialData);

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
        }),
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { items: [emptyItem] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Al elegir un producto real, autocompleta su SKU y precio en esa fila
  const handleProductSelect = (index, nombre) => {
    const producto = productos.find((item) => item.Nombre === nombre);

    setValue(`items.${index}.sku`, producto?.SKU ?? "", {
      shouldValidate: true,
    });
    setValue(
      `items.${index}.precio_unitario`,
      producto ? Number(producto.Precio) : 0,
      { shouldValidate: true },
    );
  };

  // Hook para obtener productos desde el backend si no se pasan por props
  const { productos: productosBackend, loading: productosLoading } =
    useFetchProductos();

  // Preferir los productos pasados por props; si no, usar los del hook
  const productosFinal = productos.length > 0 ? productos : productosBackend;

  // Total calculado en vivo a partir de los items.
  const watchedItems = watch("items");
  const total = (watchedItems || []).reduce(
    (sum, item) =>
      sum +
      (Number(item?.cantidad_solicitada) || 0) *
        (Number(item?.precio_unitario) || 0),
    0,
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen) {
      reset({
        fecha_pedido:
          toDatetimeLocal(initialData?.fecha_pedido) ||
          toDatetimeLocal(new Date()),
        cliente: initialData?.cliente ?? "",
        punto_de_venta: initialData?.punto_de_venta ?? "",
        vendedor_asignado: initialData?.vendedor_asignado ?? vendedorAsignado,
        items:
          initialData?.items?.length > 0
            ? initialData.items.map((item) => ({
                sku: item.sku ?? "",
                producto: item.producto ?? "",
                cantidad_solicitada: item.cantidad_solicitada ?? 1,
                precio_unitario: item.precio_unitario ?? 0,
              }))
            : [emptyItem],
          estado_pedido: initialData?.estado_pedido ?? ESTADOS[0],
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
      (sum, item) => sum + item.cantidad_solicitada * item.precio_unitario,
      0,
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              <select
                {...register("cliente")}
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              >
                <option value="">Selecciona un cliente</option>

                {/* Preserva el valor guardado aunque ya no exista en la lista de clientes */}
                {initialData?.cliente &&
                  !clientes.some(
                    (cliente) => cliente.name === initialData.cliente,
                  ) && (
                    <option value={initialData.cliente}>
                      {initialData.cliente}
                    </option>
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

              <p className="text-red-400 text-sm">{errors.cliente?.message}</p>
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
              readOnly
              placeholder="Vendedor asignado"
              className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-3 py-2 opacity-80"
            />

            <p className="mt-1 text-xs text-white/60">
              Se asigna automáticamente según tu sesión.
            </p>

            <p className="text-red-400 text-sm">
              {errors.vendedor_asignado?.message}
            </p>
          </div>

          {/* Items del pedido */}
          <div className="rounded-xl bg-white/5 p-4">
            <button
              type="button"
              onClick={() => append(emptyItem)}
              className="rounded-lg bg-sky-500 px-3 py-1 text-xs text-white hover:bg-sky-600 transition mb-5"
            >
              + Agregar producto
            </button>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const selectedProducts = (watch("items") || [])
                  .map((it) => it.producto)
                  .filter(Boolean);

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-6">
                      <label className="text-white text-sm">Producto</label>
                      <select
                        {...register(`items.${index}.producto`)}
                        onChange={(e) => handleProductSelect(index, e.target.value)}
                        className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none"
                      >
                        <option value="">Selecciona un producto</option>
                        {productosFinal.map((p) => (
                          <option
                            key={p._id || p.SKU}
                            value={p.Nombre}
                            disabled={
                              selectedProducts.includes(p.Nombre) &&
                              // permitir que la opción actual del campo no esté deshabilitada
                              watch(`items.${index}.producto`) !== p.Nombre
                            }
                          >
                            {p.Nombre}
                          </option>
                        ))}
                      </select>

                      <p className="text-red-400 text-sm">
                        {errors.items?.[index]?.producto?.message}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <label className="text-white text-sm">Cant.</label>
                      <input
                        type="number"
                        {...register(`items.${index}.cantidad_solicitada`, {
                          valueAsNumber: true,
                        })}
                        className="w-full rounded-lg bg-gray-300 px-3 py-2"
                        min={1}
                      />
                      <p className="text-red-400 text-sm">
                        {errors.items?.[index]?.cantidad_solicitada?.message}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <label className="text-white text-sm">Precio</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.precio_unitario`, {
                          valueAsNumber: true,
                        })}
                        className="w-full rounded-lg bg-gray-300 px-3 py-2"
                      />
                      <p className="text-red-400 text-sm">
                        {errors.items?.[index]?.precio_unitario?.message}
                      </p>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}

              <p className="text-red-400 text-sm">{errors.items?.message}</p>

              <div className="flex justify-end mt-3 text-white font-semibold">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
              <select
                {...register("estado_pedido")}
                disabled={!isEditing}
                className="w-full rounded-lg bg-gray-300 px-3 py-2"
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
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
