import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMe, login as loginRequest } from "../api/auth";
import { TOKEN_KEY, setUnauthorizedHandler } from "../api/client";
import type { AuthUser, LoginRequest } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean; // true mientras se restaura la sesión
  login: (body: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(
    () => localStorage.getItem(TOKEN_KEY) !== null,
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Restaurar sesión al recargar
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    let cancelled = false;
    getMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  // Si cualquier request devuelve 401, cerrar sesión
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (body: LoginRequest) => {
    const { token } = await loginRequest(body);
    localStorage.setItem(TOKEN_KEY, token);
    try {
      setUser(await getMe());
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      throw e;
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}