import url from "../../utils/apiUrl";
import { toast } from "sonner";

const useProductionActions = () => {
  // Crea un nuevo registro de producción
  const createProduction = async (data) => {
    try {
      const response = await fetch(`${url}/produccion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al crear la producción");
        return { ok: false };
      }

      toast.success("Producción creada exitosamente");

      return { ok: true };
    } catch (error) {
      console.log(error);
      toast.error("Error al crear la producción");
      return { ok: false };
    }
  };

  // Actualiza un registro de producción existente
  const updateProduction = async (id, data) => {
    try {
      const response = await fetch(`${url}/produccion/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al actualizar");
        return { ok: false };
      }

      toast.success("Producción actualizada");

      return { ok: true };
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar");
      return { ok: false };
    }
  };

  // Elimina un registro de producción por su ID
  const deleteProduction = async (id) => {
    try {
      const response = await fetch(`${url}/produccion/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al eliminar");
        return { ok: false };
      }

      toast.success("Producción eliminada");

      return { ok: true };
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar");
      return { ok: false };
    }
  };

  return {
    createProduction,
    updateProduction,
    deleteProduction,
  };
};

export default useProductionActions;