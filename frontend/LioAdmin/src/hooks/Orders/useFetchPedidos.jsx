import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";

const useFetchPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPedidos = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/pedidos`);

      if (!response.ok) {
        toast.error("Error al obtener los pedidos");
        throw new Error("Error al obtener los pedidos");
      }

      const data = await response.json();

      setPedidos(data);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPedidos();
  }, []);

  return {
    pedidos,
    setPedidos,
    getPedidos,
    loading,
  };
};

export default useFetchPedidos;
