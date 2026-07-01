import { useEffect, useState } from "react";
import url from "../../utils/apiUrl";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useFetchCodes from "./useFetchCodes";


const getDataCodes = () => {
    const [dataCode, setDataCode] = useState([]);
    const {id} = useParams();
    
    useEffect(() => {
        getCodes();
    }, [])
    
    const navigate = useNavigate();
}