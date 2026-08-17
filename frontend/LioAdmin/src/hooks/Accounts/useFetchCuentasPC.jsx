import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useFetchCuentasPC = () => {
  const [cuentasPC, setCuentasPC] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCuentasPC = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/cuentasPorCobrar`);
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al obtener las cuentas por cobrar");
        return;
      }

      setCuentasPC(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCuentasPC();
  }, []);

  return {
    cuentasPC,
    setCuentasPC,
    getCuentasPC,
    loading,
  };
};

export default useFetchCuentasPC;
