'use client';

import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  livre: {
    id: number;
    titre: string;
    auteur: string;
    prix: number;
    couverture: string | null;
  };
  stock: number;
}

export function BoutonAjouterPanier({ livre, stock }: Props) {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [ajoute, setAjoute] = useState(false);

  const handleClick = () => {
    addToCart(livre);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={stock === 0}
      className="bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-md font-medium transition-colors mt-4"
    >
      {ajoute ? `${t('fiche.ajoute')} ✓` : t('fiche.ajouterPanier')}
    </button>
  );
}