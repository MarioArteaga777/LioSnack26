import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useClientesActions = () => {
  // Acepta un objeto plano (JSON) o un FormData (cuando incluye la foto)
  const createCliente = async (data) => {
    try {
      const isFormData = data instanceof FormData;

      const response = await fetch(`${url}/clientes`, {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al crear cliente");
        return { ok: false };
      }

      toast.success("Cliente creado exitosamente");
      return { ok: true, client: result?.client };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al crear cliente");
      return { ok: false };
    }
  };

  const updateCliente = async (id, data) => {
    try {
      const isFormData = data instanceof FormData;

      const response = await fetch(`${url}/clientes/${id}`, {
        method: "PUT",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al actualizar cliente");
        return { ok: false };
      }

      toast.success("Cliente actualizado exitosamente");
      return { ok: true, client: result?.client };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al actualizar cliente");
      return { ok: false };
    }
  };

  const deleteCliente = async (id) => {
    try {
      const response = await fetch(`${url}/clientes/${id}`, {
        method: "DELETE",
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al eliminar cliente");
        return { ok: false };
      }

      toast.success("Cliente eliminado exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al eliminar cliente");
      return { ok: false };
    }
  };

  return {
    createCliente,
    updateCliente,
    deleteCliente,
  };
};

export default useClientesActions;
