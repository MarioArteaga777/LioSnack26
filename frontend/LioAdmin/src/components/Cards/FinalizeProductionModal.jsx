import { useEffect, useRef, useState } from "react";

// Formulario para finalizar una producción.
// Se reinicia cada vez que cambia la producción.
const FinalizeProductionForm = ({ production, onCancel, onConfirm }) => {
  // Valor inicial del input.
  const [bolsasFinales, setBolsasFinales] = useState(
    production.BolsasObtenidas || production.BolsasEsperadas || "",
  );

  // Guarda el mensaje de error.
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(bolsasFinales);

    // Valida que la cantidad ingresada sea correcta.
    if (bolsasFinales === "" || Number.isNaN(value) || value < 0) {
      setError("Ingrese una cantidad válida de bolsas");
      return;
    }

    // Envía la cantidad final al componente padre.
    onConfirm(value);
  };

  return (
    <div className="w-[420px] rounded-2xl bg-[#1B022C] p-6">
      <h2 className="text-2xl font-semibold text-white mb-2">
        Finalizar Producción
      </h2>

      {/* Datos de la producción seleccionada */}
      <p className="text-white/70 text-sm mb-6">
        SKU: {production.SKU} — Bolsas Esperadas: {production.BolsasEsperadas}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-white text-sm">Bolsas Finales</label>

          <input
            type="number"
            min="0"
            autoFocus
            value={bolsasFinales}
            onChange={(e) => setBolsasFinales(e.target.value)}
            placeholder="Cantidad final de bolsas"
            className="w-full rounded-lg bg-gray-300 px-3 py-2 mt-1 outline-none"
          />

          {/* Muestra el error si existe */}
          <p className="text-red-400 text-sm">{error}</p>
        </div>

        <div className="flex justify-end gap-3 mt-3">
          {/* Cierra el modal sin guardar */}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-white/10 px-6 py-2 text-white hover:bg-white/20 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600 transition"
          >
            Finalizar Producción
          </button>
        </div>
      </form>
    </div>
  );
};

const FinalizeProductionModal = ({ id, production, onClose, onConfirm }) => {
  // Referencia al dialog para abrirlo y cerrarlo.
  const dialogRef = useRef(null);

  // Abre o cierra el modal dependiendo de si hay una producción.
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

  // Si no hay producción seleccionada, no muestra el modal.
  if (!production) return null;

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClose={handleClose}
      className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60"
    >
      <FinalizeProductionForm
        // Reinicia el formulario cuando cambia la producción.
        key={production._id}
        production={production}
        onCancel={() => dialogRef.current.close()}
        onConfirm={onConfirm}
      />
    </dialog>
  );
};

export default FinalizeProductionModal;
