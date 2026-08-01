import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  prix: number;
  stock: number;
  description: string | null;
  couverture: string | null;
  categorie: { id: number; nom: string } | null;
}

async function getLivre(id: string): Promise<Livre | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function FicheLivrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const livre = await getLivre(id);

  if (!livre) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <Link href="/catalogue" className="text-indigo-700 hover:underline text-sm mb-6 inline-block">
        ← Retour au catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center text-slate-400">
          {livre.couverture ? (
            <img
              src={`http://localhost:3001${livre.couverture}`}
              alt={livre.titre}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            'Pas de couverture'
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-indigo-950">
            {livre.titre}
          </h1>
          <p className="text-lg text-slate-600">par {livre.auteur}</p>

          {livre.categorie && (
            <span className="inline-block text-sm bg-indigo-50 text-indigo-800 px-3 py-1 rounded">
              {livre.categorie.nom}
            </span>
          )}

          <p className="text-3xl font-semibold text-indigo-950">
            {livre.prix.toFixed(2)} DT
          </p>

          <p className={livre.stock > 0 ? 'text-green-700' : 'text-red-600'}>
            {livre.stock > 0 ? `En stock (${livre.stock} disponibles)` : 'Rupture de stock'}
          </p>

          {livre.description && (
            <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200">
              {livre.description}
            </p>
          )}

          <button
            disabled={livre.stock === 0}
            className="bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-md font-medium transition-colors mt-4"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}