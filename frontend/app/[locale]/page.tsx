import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';

export default function Home() {
  const t = useTranslations('accueil');

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-orange-50">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <span className="inline-block text-orange-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Nouvelle collection
          </span>
          <h1 className="text-5xl font-serif font-semibold text-indigo-950 leading-tight mb-4">
            {t('titre')}
          </h1>
          <p className="text-2xl text-orange-600 font-serif mb-6">
            {t('accroche')}
          </p>
          <p className="text-lg text-slate-600 mb-8">
            {t('sousTitre')}
          </p>
          <Link
            href="/catalogue"
            className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            {t('bouton')}
          </Link>
        </div>
      </section>
    </div>
  );
}