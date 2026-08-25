'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  prix: number;
  stock: number;
  categorie: { nom: string } | null;
}

export default function AdminLivresPage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [chargement, setChargement] = useState(true);

  const chargerLivres = () => {
    setChargement(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre?limit=100`)
      .then((res) => res.json())
      .then((data) => setLivres(data))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    chargerLivres();
  }, []);

  const handleSupprimer = async (id: number) => {
    if (!confirm('Supprimer ce livre définitivement ?')) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      chargerLivres();
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  if (chargement) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-xl text-slate-900">Gestion des livres</h2>
        <div className="flex items-center">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/livre/export-csv`}
            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 mr-3"
          >
            Exporter en CSV
          </a>
          <Link
            href="/admin/livres/nouveau"
            className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Ajouter un livre
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {livres.map((livre) => (
          <div
            key={livre.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
          >
            <div>
              <p className="font-medium text-slate-900">{livre.titre}</p>
              <p className="text-sm text-slate-500">
                par {livre.auteur} {livre.categorie && `· ${livre.categorie.nom}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{livre.prix.toFixed(2)} DT</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  livre.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {livre.stock} en stock
              </span>
              <Link
                href={`/admin/livres/${livre.id}`}
                className="text-indigo-700 hover:underline text-sm"
              >
                Modifier
              </Link>
              <button
                onClick={() => handleSupprimer(livre.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}