import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('accueil');

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>{t('titre')}</h1>
      <p>{t('accroche')}</p>
      <p>{t('sousTitre')}</p>
      <button>{t('bouton')}</button>
    </main>
  );
}