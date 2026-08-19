'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface Favori {
  id: number;
  livre: {
    id: number;
    titre: string;
    auteur: string;
    prix: number;
    couverture: string | null;
  };
}

export default function FavorisPage() {
  const { client, token, isLoading } = useAuth();
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setFavoris(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }, [token]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center">Chargement...</div>;
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-20 bg-white min-h-screen text-center">
        <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-4">
          Connexion requise
        </h1>
        <Link
          href="/connexion"
          className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-8">
        Mes favoris
      </h1>

      {chargement ? (
        <p className="text-slate-500">Chargement...</p>
      ) : favoris.length === 0 ? (
        <p className="text-slate-500">Vous n'avez pas encore de favoris.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoris.map((favori) => (
            <Link
              key={favori.id}
              href={`/livre/${favori.livre.id}`}
              className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow block"
            >
              <div className="bg-slate-100 h-48 flex items-center justify-center text-slate-400 text-sm">
                {favori.livre.couverture ? (
                  <img
                    src={`http://localhost:3001${favori.livre.couverture}`}
                    alt={favori.livre.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  'Pas de couverture'
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 line-clamp-2">{favori.livre.titre}</h3>
                <p className="text-sm text-slate-500">par {favori.livre.auteur}</p>
                <p className="text-lg font-semibold text-indigo-950 mt-2">
                  {favori.livre.prix.toFixed(2)} DT
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}