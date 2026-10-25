import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [teamCode, setTeamCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ teamCode, email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">TropelCare Login</h2>
        
        {error && <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded mb-4 text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block text-slate-400 text-sm font-medium mb-1">Team Code</label>
          <input
            type="text"
            required
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            placeholder="TEAM-0XX"
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-400 text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            placeholder="operator@tuckersoft.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-400 text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium py-2 rounded transition"
        >
          {loading ? 'Ingresando...' : 'Entrar a Consola'}
        </button>
      </form>
    </div>
  );
};