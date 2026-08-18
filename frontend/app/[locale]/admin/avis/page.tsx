'use client';

import { useEffect, useState } from 'react';

interface Avis {
  id: number;
  note: number;
  commentaire: string | null;
  createdAt: string;
  client: { nom: string };
  livre: { titre: string };
}

export default function AdminAvisPage() {
  const [avisEnAttente, setAvisEnAttente] = useState<Avis[]>([]);
  const [chargement, setChargement] = useState(true);
  const [enTraitement, setEnTraitement] = useState<number | null>(null);
  const charger = () => {
    setChargement(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/avis/en-attente`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setAvisEnAttente(Array.isArray(data) ? data : []))
      .catch(() => setAvisEnAttente([]))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    charger();
  }, []);

  const handleApprouver = async (id: number) => {
  if (enTraitement) return;
  setEnTraitement(id);
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avis/${id}/approuver`, {
    method: 'PATCH',
  });
  await charger();
  setEnTraitement(null);
};

const handleRejeter = async (id: number) => {
  if (enTraitement) return;
  if (!confirm('Rejeter et supprimer cet avis ?')) return;
  setEnTraitement(id);
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avis/${id}`, {
    method: 'DELETE',
  });
  await charger();
  setEnTraitement(null);
};

  if (chargement) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="font-semibold text-xl text-slate-900 mb-6">Avis en attente de modération</h2>

      {avisEnAttente.length === 0 ? (
        <p className="text-slate-500">Aucun avis en attente.</p>
      ) : (
        <div className="space-y-3">
          {avisEnAttente.map((avis) => (
            <div key={avis.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-slate-900">{avis.client.nom}</p>
                  <p className="text-sm text-slate-500">sur "{avis.livre.titre}"</p>
                </div>
                <span className="text-amber-500">{'★'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}</span>
              </div>
              {avis.commentaire && (
                <p className="text-slate-700 text-sm mb-3">{avis.commentaire}</p>
              )}
              <button
  onClick={() => handleApprouver(avis.id)}
  disabled={enTraitement === avis.id}
  className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white px-4 py-1.5 rounded-md text-sm font-medium"
>
  {enTraitement === avis.id ? '...' : 'Approuver'}
</button>
<button
  onClick={() => handleRejeter(avis.id)}
  disabled={enTraitement === avis.id}
  className="bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white px-4 py-1.5 rounded-md text-sm font-medium"
>
  {enTraitement === avis.id ? '...' : 'Rejeter'}
</button>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}