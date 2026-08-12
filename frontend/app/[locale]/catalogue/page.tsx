import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
interface Livre {
  id: number;
  titre: string;
  auteur: string;
  prix: number;
  stock: number;
  couverture: string | null;
  categorie: { id: number; nom: string } | null;
}

async function getLivres(searchParams: { recherche?: string; categorieId?: string; page?: string }) {
  const params = new URLSearchParams();
  if (searchParams.recherche) params.set('recherche', searchParams.recherche);
  if (searchParams.categorieId) params.set('categorieId', searchParams.categorieId);
  if (searchParams.page) params.set('page', searchParams.page);
  params.set('limit', '20');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Erreur lors du chargement du catalogue');
  return res.json() as Promise<Livre[]>;
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ recherche?: string; categorieId?: string; page?: string }>;
}) {
  const t = await getTranslations();
  const params = await searchParams;
  const livres = await getLivres(params);

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-8">
  {t('catalogue.titre')}
</h1>

      {livres.length === 0 ? (
        <p className="text-slate-600">{t('catalogue.aucunLivre')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {livres.map((livre) => (
            <Link
  key={livre.id}
  href={`/livre/${livre.id}`}
  className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow block"
>
              <div className="bg-slate-100 h-48 flex items-center justify-center text-slate-400 text-sm">
                {livre.couverture ? (
                  <img
                    src={`http://localhost:3001${livre.couverture}`}
                    alt={livre.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  t('catalogue.pasDeCouverture')
                )}
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-slate-900 line-clamp-2">{livre.titre}</h3>
                <p className="text-sm text-slate-500">par {livre.auteur}</p>
                {livre.categorie && (
                  <span className="inline-block text-xs bg-indigo-50 text-indigo-800 px-2 py-1 rounded mt-1">
                    {livre.categorie.nom}
                  </span>
                )}
                <p className="text-lg font-semibold text-indigo-950 mt-2">
                  {livre.prix.toFixed(2)} DT
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}