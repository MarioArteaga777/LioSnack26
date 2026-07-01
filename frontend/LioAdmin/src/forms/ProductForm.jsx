import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ProductForm = ({ id }) => {
  const schema = yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    price: yup.number().required("El precio es requerido"),
    description: yup.string().required("La descripción es requerida"),
    image: yup.mixed().required("La imagen es requerida"),
  });

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <dialog id={id} className="rounded-2xl bg-transparent backdrop:bg-black/50">
      <div className="w-[450px] rounded-2xl bg-[#1B022C] p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Nuevo Producto
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("name")}
            placeholder="Nombre"
            className="w-full rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              {...register("price")}
              placeholder="Precio"
              className="rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />

            <input
              type="file"
              {...register("image")}
              placeholder="Imagen"
              className="rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
            />
          </div>

          <textarea
            {...register("description")}
            placeholder="Descripción"
            rows={4}
            className="rounded-lg bg-gray-300 px-3 py-2 outline-none placeholder:text-gray-500"
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-6 py-2 text-white transition hover:bg-sky-600"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ProductForm;
