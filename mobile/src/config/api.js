import { Platform } from "react-native";

// Tu IP local de la computadora en la red Wi-Fi: 192.168.1.17
// Esta IP es accesible tanto para tu celular físico como para los emuladores.
const LOCAL_HOST_IP = "192.168.1.17"; 

const rawUrl = process.env.EXPO_PUBLIC_API_URL || `http://${LOCAL_HOST_IP}:4000/api`;

export function getApiUrl() {
  // Si por alguna razón la URL configurada usa 'localhost', la reemplazamos con la IP de tu PC
  if (rawUrl.includes("localhost")) {
    return rawUrl.replace("localhost", LOCAL_HOST_IP);
  }
  return rawUrl;
}

export const API_URL = getApiUrl();
