'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Props {
  livreId: number;
}

export function BoutonFavori({ livreId }: Props) {
  const { client, token } = useAuth();
  const router = useRouter();
  const [estFavori, setEstFavori] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!token) {
      setChargement(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((favoris) => {
        setEstFavori(favoris.some((f: any) => f.livreId === livreId));
      })
      .finally(() => setChargement(false));
  }, [token, livreId]);

  const handleClick = async () => {
    if (!client || !token) {
      router.push('/connexion');
      return;
    }

    const methode = estFavori ? 'DELETE' : 'POST';
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoris/${livreId}`, {
      method: methode,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setEstFavori(!estFavori);
    }
  };

  if (chargement) return null;

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-md border transition-colors ${
        estFavori
          ? 'bg-red-50 border-red-300 text-red-600'
          : 'bg-white border-slate-300 text-slate-600 hover:border-red-300 hover:text-red-600'
      }`}
      title={estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {estFavori ? '♥' : '♡'}
    </button>
  );
}