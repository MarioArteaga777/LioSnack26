import { useEffect, useRef } from "react";

const ProductionDetailsModal = ({
  id,
  production,
  onClose,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (production) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [production]);

  const handleClose = () => {
    onClose?.();
  };

  if (!production) return null;

  const getStatusColor = () => {
    switch (production.Estado) {
      case "Finalizado":
        return "bg-green-500/20 text-green-300";

      case "Cancelado":
        return "bg-red-500/20 text-red-300";

      default:
        return "bg-yellow-500/20 text-yellow-300";
    }
  };

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={handleClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60"
    >
      <div className="w-[550px] rounded-2xl bg-[#1B022C] p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-semibold text-white">
            Detalles de Producción
          </h2>

          <button
            onClick={() => dialogRef.current.close()}
            className="text-white text-xl hover:text-red-400 transition"
          >
            ✕
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="text-gray-400 text-sm">SKU</p>
            <p className="text-white">{production.SKU}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Estado</p>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}
            >
              {production.Estado}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Hora Inicio
            </p>

            <p className="text-white">
              {production.HoraInicio}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Hora Finalización
            </p>

            <p className="text-white">
              {production.HoraFinalizacion}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Bolsas Esperadas
            </p>

            <p className="text-white">
              {production.BolsasEsperadas}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Bolsas Obtenidas
            </p>

            <p className="text-white">
              {production.BolsasObtenidas}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Horas Reales
            </p>

            <p className="text-white">
              {production.HorasReales}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Kilogramos
            </p>

            <p className="text-white">
              {production.KG}
            </p>
          </div>

        </div>

        <div className="mt-6">

          <p className="text-gray-400 text-sm mb-2">
            Observaciones
          </p>

          <div className="min-h-[120px] rounded-xl bg-[#2A1F5E] p-4 text-white whitespace-pre-wrap">
            {production.Observaciones || "Sin observaciones"}
          </div>

        </div>

        <div className="flex justify-end mt-8">

          <button
            onClick={() => dialogRef.current.close()}
            className="rounded-lg bg-sky-500 px-6 py-2 text-white transition hover:bg-sky-600"
          >
            Cerrar
          </button>

        </div>

      </div>
    </dialog>
  );
};

export default ProductionDetailsModal;