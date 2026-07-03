import { useEffect, useRef } from "react";

const ProductDetailsModal = ({ id, product, onClose }) => {
  const dialogRef = useRef(null);

  // Abre/cierra el <dialog> nativo según haya o no un producto seleccionado
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (product) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [product]);

  const handleNativeClose = () => {
    onClose?.();
  };

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={handleNativeClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/50"
    >
      {product && (
        <div className="w-[400px] rounded-2xl bg-[#1B022C] p-6 text-white">
          <h2 className="mb-6 text-xl font-semibold">Detalles del producto</h2>

          {product.Image && (
            <div className="mb-4 flex h-32 items-center justify-center">
              <img
                src={product.Image}
                alt={product.Nombre}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Nombre</dt>
              <dd className="font-medium text-right">{product.Nombre}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">SKU</dt>
              <dd className="font-medium">{product.SKU}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">Precio</dt>
              <dd className="font-medium">${product.Precio}</dd>
            </div>
          </dl>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ProductDetailsModal;
