import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useCuentasPCActions = () => {
  const createCuentaPC = async (data) => {
    try {
      const response = await fetch(`${url}/cuentasPorCobrar/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al crear la cuenta por cobrar");
        return { ok: false };
      }

      toast.success("Cuenta por cobrar creada exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al crear la cuenta");
      return { ok: false };
    }
  };

  const updateCuentaPC = async (id, data) => {
    try {
      const response = await fetch(`${url}/cuentasPorCobrar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al actualizar la cuenta por cobrar");
        return { ok: false };
      }

      toast.success("Cuenta por cobrar actualizada exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al actualizar la cuenta");
      return { ok: false };
    }
  };

  const deleteCuentaPC = async (id) => {
    try {
      const response = await fetch(`${url}/cuentasPorCobrar/${id}`, {
        method: "DELETE",
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al eliminar la cuenta por cobrar");
        return { ok: false };
      }

      toast.success("Cuenta por cobrar eliminada exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al eliminar la cuenta");
      return { ok: false };
    }
  };

  return {
    createCuentaPC,
    updateCuentaPC,
    deleteCuentaPC,
  };
};

export default useCuentasPCActions;
