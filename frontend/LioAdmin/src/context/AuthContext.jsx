import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext();

const API_URL = "http://localhost:3000/api/auth"; // <-- Cambia por la URL de tu backend
const SESSION_STORAGE_KEY = "lio_auth";

function readStoredSession() {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (storedSession?.user) {
      setUser(storedSession.user);
    }

    setLoading(false);
  }, []);

  const persistSession = useCallback((nextUser) => {
    if (!nextUser) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setUser(null);
      return;
    }

    const session = {
      user: nextUser,
      authenticatedAt: new Date().toISOString(), // <-- Faltaban los ()
    };

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );

    setUser(nextUser);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            ok: false,
            message: payload.message || "Error al iniciar sesión",
          };
        }

        // Si tu backend devuelve el usuario
        persistSession(payload.user || { email });

        return {
          ok: true,
          message: payload.message || "Sesión iniciada correctamente",
        };
      } catch {
        return {
          ok: false,
          message: "No se pudo conectar con el servidor",
        };
      }
    },
    [persistSession]
  );

  const register = useCallback(async (registrationData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(registrationData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          ok: false,
          message: payload.message || "Error al registrar",
        };
      }

      return {
        ok: true,
        message: payload.message || "Registro exitoso",
      };
    } catch {
      return {
        ok: false,
        message: "No se pudo conectar con el servidor",
      };
    }
  }, []);

  const verifyRegistrationCode = useCallback(
    async ({ verificationCodeRequest }) => {
      try {
        const response = await fetch(`${API_URL}/verifyRegistrationCode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ verificationCodeRequest }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            ok: false,
            message: payload.message || "Código incorrecto",
          };
        }

        return {
          ok: true,
          message: payload.message || "Código verificado",
        };
      } catch {
        return {
          ok: false,
          message: "No se pudo conectar con el servidor",
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      persistSession(null);
    }
  }, [persistSession]);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    verifyRegistrationCode,
    logout,
    clearSession: () => persistSession(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}