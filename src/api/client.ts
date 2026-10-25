import axios from "axios";

export const TOKEN_KEY = "tropelcare_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    ) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "No se pudo conectar con el servidor.";
    const status = error.response.status;
    if (status === 401) return "Credenciales inválidas.";
    if (status === 400) return "Datos inválidos. Revisa los campos.";
    if (status === 429) {
      const retry = error.response.headers["retry-after"];
      return `Demasiados intentos. Reintenta en ${retry ?? "unos"} segundos.`;
    }
    return "Error del servidor. Intenta de nuevo.";
  }
  return "Ocurrió un error inesperado.";
}