import { useEffect, useState } from "react";
import url from "../../utils/apiUrl";
import { toast } from "sonner";

const useFetchUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    // Trae todos los usuarios desde la API
    const getUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/usuarios`);
            if (!response.ok) {
                toast.error("Error al obtener los usuarios");
                throw new Error("Error al obtener los usuarios");
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    return {
        usuarios,
        setUsuarios,
        getUsuarios,
        loading
    };
};

export default useFetchUsuarios;
