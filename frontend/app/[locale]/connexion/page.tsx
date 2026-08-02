'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setErreur('Email ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-white min-h-screen max-w-md">
      <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-8">
        Connexion
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Adresse e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}