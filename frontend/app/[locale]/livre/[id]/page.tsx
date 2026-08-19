import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BoutonAjouterPanier } from '../../../components/BoutonAjouterPanier';
import { getTranslations } from 'next-intl/server';
import { BoutonFavori } from '../../../components/BoutonFavori';
interface Avis {
  id: number;
  note: number;
  commentaire: string | null;
  createdAt: string;
  client: { nom: string };
}

async function getAvis(livreId: string): Promise<Avis[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avis/livre/${livreId}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

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
  const t = await getTranslations();
  const { id } = await params;
  const livre = await getLivre(id);
  const avis = await getAvis(id);

  if (!livre) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <Link href="/catalogue" className="text-indigo-700 hover:underline text-sm mb-6 inline-block">
        ← {t('fiche.retour')}
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
            t('catalogue.pasDeCouverture')
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-indigo-950">
            {livre.titre}
          </h1>
          <p className="text-lg text-slate-600">{t('fiche.par')} {livre.auteur}</p>

          {livre.categorie && (
            <span className="inline-block text-sm bg-indigo-50 text-indigo-800 px-3 py-1 rounded">
              {livre.categorie.nom}
            </span>
          )}

          <p className="text-3xl font-semibold text-indigo-950">
            {livre.prix.toFixed(2)} DT
          </p>

          <p className={livre.stock > 0 ? 'text-green-700' : 'text-red-600'}>
            {livre.stock > 0
              ? `${t('fiche.enStock')} (${livre.stock} ${t('fiche.disponibles')})`
              : t('fiche.ruptureStock')}
          </p>

          {livre.description && (
            <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200">
              {livre.description}
            </p>
          )}

          <div className="flex gap-3">
  <BoutonAjouterPanier
    livre={{
      id: livre.id,
      titre: livre.titre,
      auteur: livre.auteur,
      prix: livre.prix,
      couverture: livre.couverture,
    }}
    stock={livre.stock}
  />
  <BoutonFavori livreId={livre.id} />
</div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-serif font-semibold text-indigo-950 mb-6">Avis clients</h2>
        {avis.length === 0 ? (
          <p className="text-slate-500">Aucun avis pour le moment.</p>
        ) : (
          <div className="space-y-4">
            
            {avis.map((a) => (
              <div key={a.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{a.client.nom}</span>
                  <span className="text-amber-500">{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span>
                </div>
                {a.commentaire && <p className="text-slate-600 text-sm">{a.commentaire}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}