import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useInventoryActions = () => {
  const createInventory = async (formData) => {
    try {
      const response = await fetch(`${url}/inventario`, {
        method: "POST",
        body: formData,
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al crear inventario");
        return { ok: false };
      }

      toast.success("Inventario creado exitosamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al crear inventario");
      return { ok: false };
    }
  };

  const updateInventory = async (id, formData) => {
    try {
      const response = await fetch(`${url}/inventario/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al actualizar inventario");
        return { ok: false };
      }

      toast.success("Inventario actualizado correctamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al actualizar inventario");
      return { ok: false };
    }
  };

  const deleteInventory = async (id) => {
    try {
      const response = await fetch(`${url}/inventario/${id}`, {
        method: "DELETE",
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al eliminar inventario");
        return { ok: false };
      }

      toast.success("Inventario eliminado correctamente");
      return { ok: true };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion al eliminar inventario");
      return { ok: false };
    }
  };

  return {
    createInventory,
    updateInventory,
    deleteInventory,
  };
};

export default useInventoryActions;
