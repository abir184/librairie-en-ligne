'use client';

import { useEffect, useState } from 'react';

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  createdAt: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/client`)
      .then((res) => res.json())
      .then(setClients)
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="font-semibold text-xl text-slate-900 mb-6">Clients</h2>

      <div className="space-y-2">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
          >
            <div>
              <p className="font-medium text-slate-900">{client.nom}</p>
              <p className="text-sm text-slate-500">{client.email}</p>
            </div>
            <p className="text-sm text-slate-500">
              Inscrit le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}