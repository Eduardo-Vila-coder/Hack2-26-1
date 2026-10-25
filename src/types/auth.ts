export interface LoginRequest {
  teamCode: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Ajusta los campos a lo que devuelva GET /auth/me en Swagger.
export interface AuthUser {
  email: string;
  teamCode?: string;
  role?: string;
}