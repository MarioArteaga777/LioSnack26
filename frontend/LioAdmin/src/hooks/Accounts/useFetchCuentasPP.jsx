import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";
import readApiResponse from "../../utils/readApiResponse";

const useFetchCuentasPP = () => {
  const [cuentasPP, setCuentasPP] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCuentasPP = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/cuentasPorPagar`);
      const data = await readApiResponse(response);

      if (!response.ok) {
        toast.error(data?.message || "Error al obtener las cuentas por pagar");
        return;
      }

      setCuentasPP(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCuentasPP();
  }, []);

  return {
    cuentasPP,
    setCuentasPP,
    getCuentasPP,
    loading,
  };
};

export default useFetchCuentasPP;
