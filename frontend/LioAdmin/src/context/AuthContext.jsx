import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const API_URL = "http://localhost:4000/api"; 
const SESSION_STORAGE_KEY = "lio_auth";

// Cuando el backend de login esté listo, cambia esto a false
// y el login empezará a usar la petición real a la API automáticamente.
const USE_MOCK_LOGIN = false;

// Usuarios de prueba usados solo mientras USE_MOCK_LOGIN es true.
// No provienen de ninguna API.
const MOCK_USERS = [
  { id: 1, email: "john@gmail.com", username: "johnd", password: "12345" },
  { id: 2, email: "morrison@gmail.com", username: "mor_2314", password: "83445" },
  { id: 3, email: "kevin@gmail.com", username: "kevinryan", password: "kev02937@" },
];

function mockLoginRequest({ email, password }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        resolve({ ok: false, message: "Correo o contraseña incorrectos" });
        return;
      }

      resolve({
        ok: true,
        message: "Sesión iniciada correctamente",
        user: { id: user.id, username: user.username, email: user.email },
      });
    }, 500);
  });
}

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
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );

    setUser(nextUser);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      if (USE_MOCK_LOGIN) {
        const payload = await mockLoginRequest({ email, password });

        if (!payload.ok) {
          return payload;
        }

        persistSession(payload.user);
        return payload;
      }

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

        // Si el backend no devuelve el usuario, se guarda al menos el email
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
    if (USE_MOCK_LOGIN) {
      persistSession(null);
      return;
    }

    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      persistSession(null);
    }
  }, [persistSession]);

  const clearSession = useCallback(() => persistSession(null), [persistSession]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      verifyRegistrationCode,
      logout,
      clearSession,
    }),
    [user, loading, login, register, verifyRegistrationCode, logout, clearSession]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext