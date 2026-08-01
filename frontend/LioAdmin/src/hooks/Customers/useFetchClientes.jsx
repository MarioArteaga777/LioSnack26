import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useFetchClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getClientes = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/clientes`);
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al obtener los clientes");
        return;
      }

      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClientes();
  }, []);

  return {
    clientes,
    setClientes,
    getClientes,
    loading,
  };
};

export default useFetchClientes;
