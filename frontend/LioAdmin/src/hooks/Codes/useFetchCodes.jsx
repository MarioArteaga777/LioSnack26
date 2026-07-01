import { useEffect, useState } from "react";
import url from "../../utils/apiUrl"
import toast from "react-hot-toast";


const fetchCodes = () => {
    const [dataCodes, setDataCodes] = useState([]);

    const getCodes = async () => {
        try {
            const response = await fetch(`${url}/codes`)
            if (!response.ok) {
                toast.error("Error al obtener los códigos")
                throw new Error("Error al obtener los códigos")
            }
            const data = await response.json()
            setDataCodes(data)
        } catch (error) {
            toast.error("Error al obtener los códigos")
        }
    }

    useEffect(() => {
        getCodes();
    }, [])

    return {
        dataCodes,
        setDataCodes,
        getCodes
    }
}

export default fetchCodes;
