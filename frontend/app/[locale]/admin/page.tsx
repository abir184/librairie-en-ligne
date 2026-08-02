interface DashboardStats {
  commandesDuJour: number;
  chiffreAffairesMois: number;
  livresStockFaible: { id: number; titre: string; stock: number }[];
}

async function getStats(): Promise<DashboardStats> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commande/dashboard-stats`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');
  return res.json();
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-500 mb-1">Commandes du jour</p>
          <p className="text-3xl font-semibold text-indigo-950">{stats.commandesDuJour}</p>
        </div>
        <div className="border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-500 mb-1">Chiffre d'affaires du mois</p>
          <p className="text-3xl font-semibold text-indigo-950">
            {stats.chiffreAffairesMois.toFixed(2)} DT
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-500 mb-1">Livres en stock faible</p>
          <p className="text-3xl font-semibold text-red-600">
            {stats.livresStockFaible.length}
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Alertes de stock (seuil : 20)</h2>
        {stats.livresStockFaible.length === 0 ? (
          <p className="text-slate-500">Aucun livre en stock faible.</p>
        ) : (
          <div className="space-y-2">
            {stats.livresStockFaible.map((livre) => (
              <div
                key={livre.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-md"
              >
                <span className="text-slate-900">{livre.titre}</span>
                <span className="text-red-700 text-sm font-medium">
                  {livre.stock} restants
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}