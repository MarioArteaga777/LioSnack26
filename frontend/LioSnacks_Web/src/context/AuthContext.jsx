import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);
const SESSION_KEY = "liosnack_web_session";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const register = useCallback(async ({ name, lastName, email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.register({ name, lastName, email, password });
      return { ok: true, message: data.message };
    } catch (error) {
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async ({ email, code }) => {
    setLoading(true);
    try {
      const data = await authApi.verifyCode({ email, code });
      return { ok: true, message: data.message };
    } catch (error) {
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendCode = useCallback(async (email) => {
    try {
      const data = await authApi.resendCode({ email });
      return { ok: true, message: data.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setUser(data.user);
      return { ok: true, message: data.message, user: data.user };
    } catch (error) {
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Si el backend no responde igual limpiamos la sesión local.
    }
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    verifyCode,
    resendCode,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
