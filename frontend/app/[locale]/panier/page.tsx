'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '../../context/CartContext';

export default function PanierPage() {
  const t = useTranslations();
  const { items, removeFromCart, updateQuantite, getTotal, getItemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 bg-white min-h-screen text-center">
        <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-4">
          {t('panier.vide')}
        </h1>
        <p className="text-slate-600 mb-8">
          {t('panier.videTexte')}
        </p>
        <Link
          href="/catalogue"
          className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          {t('panier.continuerAchats')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-8">
        {t('panier.titre')} ({getItemCount()} {getItemCount() > 1 ? 'articles' : 'article'})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.livre.id} className="flex gap-4 border border-slate-200 rounded-lg p-4">
              <div className="bg-slate-100 w-20 h-28 flex-shrink-0 rounded flex items-center justify-center text-slate-400 text-xs">
                {item.livre.couverture ? (
                  <img
                    src={`http://localhost:3001${item.livre.couverture}`}
                    alt={item.livre.titre}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  t('catalogue.pasDeCouverture')
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{item.livre.titre}</h3>
                <p className="text-sm text-slate-500">{t('fiche.par')} {item.livre.auteur}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-300 rounded-md">
                    <button
                      onClick={() => updateQuantite(item.livre.id, item.quantite - 1)}
                      className="px-3 py-1 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantite}</span>
                    <button
                      onClick={() => updateQuantite(item.livre.id, item.quantite + 1)}
                      className="px-3 py-1 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-indigo-950">
                      {(item.livre.prix * item.quantite).toFixed(2)} DT
                    </span>
                    <button
                      onClick={() => removeFromCart(item.livre.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      {t('panier.supprimer')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-slate-200 rounded-lg p-6 h-fit space-y-4">
          <h2 className="font-semibold text-lg text-slate-900">{t('panier.resume')}</h2>
          <div className="flex justify-between text-slate-600">
            <span>{t('panier.sousTotal')}</span>
            <span>{getTotal().toFixed(2)} DT</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t('panier.livraison')}</span>
            <span className="text-green-700">{t('panier.gratuite')}</span>
          </div>
          <div className="border-t border-slate-200 pt-4 flex justify-between font-semibold text-lg text-indigo-950">
            <span>{t('panier.total')}</span>
            <span>{getTotal().toFixed(2)} DT</span>
          </div>
          <Link
            href="/commande"
            className="block text-center bg-indigo-900 hover:bg-indigo-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {t('panier.passerCommande')}
          </Link>
        </div>
      </div>
    </div>
  );
}