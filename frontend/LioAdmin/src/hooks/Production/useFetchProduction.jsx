import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../../utils/apiUrl";

const useFetchProduction = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProductions = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/produccion`);

      if (!response.ok) {
        toast.error("Error al obtener la producción");
        throw new Error("Error al obtener la producción");
      }

      const data = await response.json();

      setProductions(data);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener la producción");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductions();
  }, []);

  return {
    productions,
    setProductions,
    getProductions,
    loading,
  };
};

export default useFetchProduction;