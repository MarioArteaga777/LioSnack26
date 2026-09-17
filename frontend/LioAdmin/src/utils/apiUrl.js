// Configuración dinámica de URL según el entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default API_URL;
