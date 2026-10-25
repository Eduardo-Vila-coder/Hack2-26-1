import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../api/client";

interface LocationState {
  from?: { pathname: string; search?: string };
}

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ""}` : "/dashboard";

  const [teamCode, setTeamCode] = useState("");
  const [email, setEmail] = useState("operator@tuckersoft.com");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) return <Navigate to={redirectTo} replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ teamCode: teamCode.trim(), email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-xl font-semibold">TropelCare Control Room</h1>

        <div className="space-y-1">
          <label htmlFor="teamCode" className="text-sm font-medium">
            Código de equipo
          </label>
          <input
            id="teamCode"
            className={inputClass}
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            placeholder="TEAM-001"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}