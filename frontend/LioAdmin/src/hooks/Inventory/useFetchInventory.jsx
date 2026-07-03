import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useFetchInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInventory = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/inventario`);
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al obtener el inventario");
        return;
      }

      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  return {
    inventory,
    setInventory,
    getInventory,
    loading,
  };
};

export default useFetchInventory;
