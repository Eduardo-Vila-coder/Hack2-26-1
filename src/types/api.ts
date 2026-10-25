export interface User {
  id: string;
  email: string;
  teamCode: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardSummary {
  openSignals: number;
  currentLoad: number;
  signalsBySeverity?: Record<string, number>;
}