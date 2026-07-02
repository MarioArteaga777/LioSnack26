import { useEffect, useState } from "react";
import url from "../../utils/apiUrl";
import { toast } from "sonner";

const useFetchProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const getProductos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/productos`);
            if (!response.ok) {
                toast.error("Error al obtener los productos");
                throw new Error("Error al obtener los productos");
            }
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProductos();
    }, []);

    return {
        productos,
        setProductos,
        getProductos,
        loading
    };
};

export default useFetchProductos;
