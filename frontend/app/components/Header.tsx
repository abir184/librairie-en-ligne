'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="bg-indigo-900 text-white text-sm py-2 px-4 text-center">
        {t('bandeau.paiement')}
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-indigo-900">
          <span className="text-2xl font-serif font-semibold tracking-tight">
            Librairie <span className="text-orange-600">en ligne</span>
          </span>
        </Link>

        <div className="flex-1 max-w-xl mx-8">
          <input
            type="text"
            placeholder={t('nav.rechercher')}
            className="w-full px-4 py-2 rounded-md border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/compte" className="hover:text-indigo-900">{t('nav.compte')}</Link>
          <Link href="/panier" className="hover:text-indigo-900">{t('nav.panier')}</Link>
        </nav>
      </div>

      <nav className="border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-4 py-3 flex gap-6 text-sm text-slate-700">
          <Link href="/catalogue" className="hover:text-indigo-900">{t('nav.catalogue')}</Link>
          <Link href="/catalogue?tri=meilleures-ventes" className="hover:text-indigo-900">{t('nav.meilleuresVentes')}</Link>
          <Link href="/catalogue?tri=nouveautes" className="hover:text-indigo-900">{t('nav.nouveautes')}</Link>
        </div>
      </nav>
    </header>
  );
}