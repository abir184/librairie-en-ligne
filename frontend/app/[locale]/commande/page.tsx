'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CommandePage() {
  const { items, getTotal, clearCart } = useCart();
  const { client, token, isLoading } = useAuth();
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [confirmee, setConfirmee] = useState(false);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center">Chargement...</div>;
  }

  if (!client || !token) {
    return (
      <div className="container mx-auto px-4 py-20 bg-white min-h-screen text-center">
        <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-4">
          Connexion requise
        </h1>
        <p className="text-slate-600 mb-8">
          Vous devez être connecté(e) pour passer une commande.
        </p>
        <Link
          href="/connexion"
          className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (confirmee) {
    return (
      <div className="container mx-auto px-4 py-20 bg-white min-h-screen text-center">
        <h1 className="text-3xl font-serif font-semibold text-green-700 mb-4">
          Commande confirmée !
        </h1>
        <p className="text-slate-600 mb-8">
          Merci {client.nom}, votre commande a bien été enregistrée. Vous paierez en espèces à la livraison.
        </p>
        <Link
          href="/catalogue"
          className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          Continuer les achats
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 bg-white min-h-screen text-center">
        <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-4">
          Votre panier est vide
        </h1>
        <Link
          href="/catalogue"
          className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          Parcourir le catalogue
        </Link>
      </div>
    );
  }

  const handleConfirmer = async () => {
    setEnvoi(true);
    setErreur('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commande`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lignes: items.map((item) => ({
            livreId: item.livre.id,
            quantite: item.quantite,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la création de la commande');
      }

      clearCart();
      setConfirmee(true);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen max-w-2xl">
      <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-8">
        Finaliser la commande
      </h1>

      <div className="border border-slate-200 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Récapitulatif</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.livre.id} className="flex justify-between text-sm">
              <span className="text-slate-700">
                {item.livre.titre} × {item.quantite}
              </span>
              <span className="font-medium text-slate-900">
                {(item.livre.prix * item.quantite).toFixed(2)} DT
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-semibold text-lg text-indigo-950">
          <span>Total à payer à la livraison</span>
          <span>{getTotal().toFixed(2)} DT</span>
        </div>
      </div>

      <div className="bg-indigo-50 text-indigo-900 text-sm rounded-md p-4 mb-6">
        Paiement en espèces directement auprès du livreur, à la réception de votre commande.
      </div>

      {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}

      <button
        onClick={handleConfirmer}
        disabled={envoi}
        className="w-full bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        {envoi ? 'Envoi en cours...' : 'Confirmer la commande'}
      </button>
    </div>
  );
}