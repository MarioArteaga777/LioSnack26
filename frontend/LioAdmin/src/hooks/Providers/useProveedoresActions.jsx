import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useProveedoresActions = () => {
  // Acepta objeto plano (JSON) o FormData (cuando incluye foto)
  const createProveedor = async (data) => {
    try {
      const isFormData = data instanceof FormData;

      const response = await fetch(`${url}/proveedores`, {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al crear proveedor");
        return { ok: false };
      }

      toast.success("Proveedor creado exitosamente");
      return { ok: true, provider: result?.provider };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexión al crear proveedor");
      return { ok: false };
    }
  };

  const updateProveedor = async (id, data) => {
    try {
      const isFormData = data instanceof FormData;

      const response = await fetch(`${url}/proveedores/${id}`, {
        method: "PUT",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al actualizar proveedor");
        return { ok: false };
      }

      toast.success("Proveedor actualizado exitosamente");
      return { ok: true, provider: result?.provider };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexión al actualizar proveedor");
      return { ok: false };
    }
  };

  const deleteProveedor = async (id) => {
    try {
      const response = await fetch(`${url}/proveedores/${id}`, {
        method: "DELETE",
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        toast.error(result?.message || "Error al eliminar proveedor");
        return { ok: false };
      }

      toast.success("Proveedor eliminado exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexión al eliminar proveedor");
      return { ok: false };
    }
  };

  return {
    createProveedor,
    updateProveedor,
    deleteProveedor,
  };
};

export default useProveedoresActions;
