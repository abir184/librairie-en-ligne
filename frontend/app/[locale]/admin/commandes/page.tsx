'use client';

import { useEffect, useState } from 'react';

interface Commande {
  id: number;
  statut: string;
  createdAt: string;
  client: { nom: string; email: string };
  lignes: { quantite: number; prixUnitaire: number }[];
}

const statuts = ['en_attente', 'validee', 'livree', 'annulee'];

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

export default function AdminCommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);

  const chargerCommandes = () => {
  setChargement(true);
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/commande`)
    .then((res) => {
      if (!res.ok) throw new Error('Erreur de chargement');
      return res.json();
    })
    .then((data) => {
      setCommandes(Array.isArray(data) ? data : []);
    })
    .catch(() => setCommandes([]))
    .finally(() => setChargement(false));
};

  useEffect(() => {
    chargerCommandes();
  }, []);

  const handleChangerStatut = async (id: number, nouveauStatut: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commande/${id}/statut`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: nouveauStatut }),
    });

    if (res.ok) {
      chargerCommandes();
    } else {
      const data = await res.json();
      alert(data.message || 'Erreur lors du changement de statut');
    }
  };

  if (chargement) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="font-semibold text-xl text-slate-900 mb-6">Gestion des commandes</h2>

      <div className="space-y-2">
        {commandes.map((commande) => {
          const total = commande.lignes.reduce((sum, l) => sum + l.prixUnitaire * l.quantite, 0);
          return (
            <div
              key={commande.id}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-slate-900">Commande #{commande.id}</p>
                <p className="text-sm text-slate-500">
                  {commande.client.nom} · {new Date(commande.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-900">{total.toFixed(2)} DT</span>
                <select
                  value={commande.statut}
                  onChange={(e) => handleChangerStatut(commande.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded border-0 ${statutStyles[commande.statut]}`}
                >
                  {statuts.map((s) => (
                    <option key={s} value={s}>
                      {statutLabels[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}