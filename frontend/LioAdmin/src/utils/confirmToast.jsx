import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

/**
 * Muestra un toast de confirmación con botones Cancelar/Confirmar.
 * Resuelve `true` si el usuario confirma, `false` si cancela o lo descarta.
 */
export function confirmToast(
  message,
  { confirmText = "Eliminar", cancelText = "Cancelar" } = {}
) {
  return new Promise((resolve) => {
    const resolveAndDismiss = (id, result) => {
      toast.dismiss(id);
      resolve(result);
    };

    toast.custom(
      (id) => (
        <div className="flex w-80 flex-col gap-3 rounded-2xl border border-white/10 bg-[#1B022C] p-4 shadow-xl shadow-black/40">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600/20 text-rose-500">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <p className="text-sm text-white">{message}</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => resolveAndDismiss(id, false)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
            >
              {cancelText}
            </button>
            <button
              onClick={() => resolveAndDismiss(id, true)}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  });
}

export default confirmToast;
