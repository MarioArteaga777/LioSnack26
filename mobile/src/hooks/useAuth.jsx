import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Custom hook para acceder al contexto de autenticación
 * Proporciona acceso a: usuario, login, logout, registro, etc.
 * 
 * @returns {Object} Contexto de autenticación con métodos y estado de usuario
 * @throws {Error} Si se usa fuera de AuthProvider
 * 
 * @example
 * const { user, isAuthenticated, login } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
