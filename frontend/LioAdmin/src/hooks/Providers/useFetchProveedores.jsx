import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useFetchProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProveedores = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/proveedores`);
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al obtener los proveedores");
        return;
      }

      setProveedores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProveedores();
  }, []);

  return {
    proveedores,
    setProveedores,
    getProveedores,
    loading,
  };
};

export default useFetchProveedores;
