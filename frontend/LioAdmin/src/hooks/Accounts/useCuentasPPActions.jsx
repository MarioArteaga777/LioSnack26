import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useCuentasPPActions = () => {
  const createCuentaPP = async (data) => {
    try {
      const response = await fetch(`${url}/cuentasPorPagar/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al crear la cuenta por pagar");
        return { ok: false };
      }

      toast.success("Cuenta por pagar creada exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al crear la cuenta");
      return { ok: false };
    }
  };

  const updateCuentaPP = async (id, data) => {
    try {
      const response = await fetch(`${url}/cuentasPorPagar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al actualizar la cuenta por pagar");
        return { ok: false };
      }

      toast.success("Cuenta por pagar actualizada exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al actualizar la cuenta");
      return { ok: false };
    }
  };

  const deleteCuentaPP = async (id) => {
    try {
      const response = await fetch(`${url}/cuentasPorPagar/${id}`, {
        method: "DELETE",
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al eliminar la cuenta por pagar");
        return { ok: false };
      }

      toast.success("Cuenta por pagar eliminada exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al eliminar la cuenta");
      return { ok: false };
    }
  };

  return {
    createCuentaPP,
    updateCuentaPP,
    deleteCuentaPP,
  };
};

export default useCuentasPPActions;
