import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { authService } from "../services/authService";
import { getApiUrl } from "../config/api";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "liosnack:auth-session";
// SecureStore (iOS Keychain) solo acepta claves alfanuméricas + . - _
// Los dos puntos ":" lanzan "Invalid key provided to SecureStore" y rompen el login.
const AUTH_TOKEN_KEY = "liosnack_access_token";
const LEGACY_TOKEN_KEYS = ["liosnack:access-token"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [loading, setLoading] = useState(false);

  // Inicializa la sesión guardada en el dispositivo
  const initializeSession = useCallback(async () => {
    try {
      // Limpieza: si quedó una clave vieja inválida con ":", la borramos
      // usando AsyncStorage (que sí la acepta) para no volver a crashear.
      for (const legacyKey of LEGACY_TOKEN_KEYS) {
        try {
          const junk = await SecureStore.getItemAsync(legacyKey).catch(() => null);
          if (junk !== null) {
            await SecureStore.deleteItemAsync(legacyKey).catch(() => null);
          }
        } catch {
          // La clave vieja es inválida por ":", la ignoramos
        }
      }

      const [raw, accessToken] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        SecureStore.getItemAsync(AUTH_TOKEN_KEY),
      ]);

      if (raw && accessToken) {
        setUser(JSON.parse(raw));
        authService.setAccessToken(accessToken);
      } else {
        setUser(null);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY).catch(() => null);
      }
    } catch (error) {
      console.log("Error al cargar sesión de LioSnack:", error);
    } finally {
      setIsBooting(false);
    }
  }, []);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const register = useCallback(async ({ name, lastName, email, password }) => {
    setLoading(true);
    try {
      // El backend usa upload.single("image") (multipart). Si mandamos JSON puro,
      // multer no lo procesa y req.body llega vacío -> 400 "Todos los campos son requeridos".
      // Por eso mandamos FormData, que funciona con y sin foto.
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);

      const url = `${getApiUrl()}/register`;
      const response = await fetch(url, { method: "POST", body: formData });
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      if (!response.ok) {
        throw new Error(data?.message || "Ocurrió un error al conectar con el servidor.");
      }
      return { ok: true, message: data?.message || "Código enviado a tu correo." };
    } catch (error) {
      if (error.message === "Network request failed") {
        return { ok: false, message: "No se pudo conectar con el servidor. Verifica tu conexión." };
      }
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async ({ email, code }) => {
    setLoading(true);
    try {
      const data = await authService.verifyCode({ email, code });
      return { ok: true, message: data?.message || "Cuenta verificada con éxito." };
    } catch (error) {
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendCode = useCallback(async (email) => {
    try {
      const data = await authService.resendCode(email);
      return { ok: true, message: data?.message || "Código reenviado." };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (!data.accessToken) {
        throw new Error("El servidor no entregó la sesión segura. Actualiza el backend e inténtalo de nuevo.");
      }

      const sessionUser = data.user || { email: email.trim().toLowerCase(), name: "Cliente" };
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, data.accessToken);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { ok: true, message: data?.message || "Bienvenido", user: sessionUser };
    } catch (error) {
      authService.setAccessToken(null);
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    authService.setAccessToken(null);
    setUser(null);
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEY),
        SecureStore.deleteItemAsync(AUTH_TOKEN_KEY).catch(() => null),
      ]);
    } catch (error) {
      console.log("Error al eliminar sesión:", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBooting,
      loading,
      login,
      register,
      verifyCode,
      resendCode,
      logout,
    }),
    [user, isBooting, loading, login, register, verifyCode, resendCode, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
