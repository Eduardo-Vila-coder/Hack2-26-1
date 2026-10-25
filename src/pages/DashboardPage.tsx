import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { DashboardSummary } from '../types/api';

export const DashboardPage = () => {
  const { logout, user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<DashboardSummary>('/dashboard/summary');
      setSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="flex justify-between items-center pb-6 mb-8 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">TropelCare Control Room</h1>
          {user && <p className="text-xs text-slate-400 mt-1">Operador: {user.email} ({user.teamCode})</p>}
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded text-sm transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {loading && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg">
          <p className="animate-pulse text-slate-400">Cargando métricas del servidor...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-950/40 border border-red-500/50 rounded-lg mb-4">
          <p className="text-red-300 font-semibold mb-1">Error de conexión</p>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={loadDashboard} className="px-3 py-1 bg-red-600 text-white rounded text-sm">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && !summary && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
          No existen métricas disponibles para este workspace.
        </div>
      )}

      {!loading && !error && summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-sm text-slate-400 uppercase font-mono">Señales Abiertas</span>
            <p className="text-5xl font-extrabold text-amber-400 mt-2">{summary.openSignals}</p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-sm text-slate-400 uppercase font-mono">Carga Actual</span>
            <p className="text-5xl font-extrabold text-cyan-400 mt-2">{summary.currentLoad}</p>
          </div>
        </div>
      )}
    </div>
  );
};