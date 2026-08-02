'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface Commande {
  id: number;
  statut: string;
  createdAt: string;
  lignes: { quantite: number; prixUnitaire: number; livre: { titre: string } }[];
}

const statutStyles: Record<string, string> = {
  en_attente: 'bg-amber-100 text-amber-800',
  validee: 'bg-blue-100 text-blue-800',
  livree: 'bg-green-100 text-green-800',
  annulee: 'bg-slate-200 text-slate-600',
};

const statutLabels: Record<string, string> = {
  en_attente: 'En attente',
  validee: 'Validée',
  livree: 'Livrée',
  annulee: 'Annulée',
};

export default function ComptePage() {
  const { client, token, logout, isLoading } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargementCommandes, setChargementCommandes] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/commande/mes-commandes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCommandes(data))
      .finally(() => setChargementCommandes(false));
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-semibold text-indigo-950">
          Mon espace client
        </h1>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Se déconnecter
        </button>
      </div>

      <div className="border border-slate-200 rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-2">Mon profil</h2>
        <p className="text-slate-600">{client.nom}</p>
        <p className="text-slate-600">{client.email}</p>
      </div>

      <div className="border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Mes commandes</h2>

        {chargementCommandes ? (
          <p className="text-slate-500">Chargement...</p>
        ) : commandes.length === 0 ? (
          <p className="text-slate-500">Vous n'avez pas encore passé de commande.</p>
        ) : (
          <div className="space-y-3">
            {commandes.map((commande) => {
              const total = commande.lignes.reduce(
                (sum, l) => sum + l.prixUnitaire * l.quantite,
                0,
              );
              return (
                <div
                  key={commande.id}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-md"
                >
                  <div>
                    <p className="font-medium text-slate-900">Commande #{commande.id}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(commande.createdAt).toLocaleDateString('fr-FR')} ·{' '}
                      {commande.lignes.length} article{commande.lignes.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-3 py-1 rounded ${statutStyles[commande.statut] || ''}`}
                    >
                      {statutLabels[commande.statut] || commande.statut}
                    </span>
                    <span className="font-semibold text-indigo-950">
                      {total.toFixed(2)} DT
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}