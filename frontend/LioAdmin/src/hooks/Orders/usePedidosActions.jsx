import url from "../../utils/apiUrl";
import { toast } from "sonner";

const usePedidosActions = () => {
  const createPedido = async (data) => {
    try {
      const response = await fetch(`${url}/pedidos/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al crear el pedido");
        return { ok: false };
      }

      toast.success("Pedido creado exitosamente");

      return { ok: true };
    } catch (error) {
      console.log(error);
      toast.error("Error al crear el pedido");
      return { ok: false };
    }
  };

  const updatePedido = async (id, data) => {
    try {
      const response = await fetch(`${url}/pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al actualizar el pedido");
        return { ok: false };
      }

      toast.success("Pedido actualizado");

      return { ok: true };
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el pedido");
      return { ok: false };
    }
  };

  const deletePedido = async (id) => {
    try {
      const response = await fetch(`${url}/pedidos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al eliminar el pedido");
        return { ok: false };
      }

      toast.success("Pedido eliminado");

      return { ok: true };
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el pedido");
      return { ok: false };
    }
  };

  return {
    createPedido,
    updatePedido,
    deletePedido,
  };
};

export default usePedidosActions;
