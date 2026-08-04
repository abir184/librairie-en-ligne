'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Categorie {
  id: number;
  nom: string;
}

export default function ModifierLivrePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [chargement, setChargement] = useState(true);

  const [form, setForm] = useState({
    titre: '',
    auteur: '',
    prix: '',
    stock: '',
    description: '',
    categorieId: '',
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie`)
      .then((res) => res.json())
      .then(setCategories);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre/${id}`)
      .then((res) => res.json())
      .then((livre) => {
        setForm({
          titre: livre.titre,
          auteur: livre.auteur,
          prix: String(livre.prix),
          stock: String(livre.stock),
          description: livre.description || '',
          categorieId: livre.categorieId ? String(livre.categorieId) : '',
        });
        setChargement(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: form.titre,
          auteur: form.auteur,
          prix: parseFloat(form.prix),
          stock: parseInt(form.stock),
          description: form.description || undefined,
          categorieId: form.categorieId ? parseInt(form.categorieId) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
      }

      router.push('/admin/livres');
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setEnvoi(false);
    }
  };

  if (chargement) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="font-semibold text-xl text-slate-900 mb-6">Modifier le livre</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
          <input
            name="titre"
            value={form.titre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Auteur</label>
          <input
            name="auteur"
            value={form.auteur}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prix (DT)</label>
            <input
              name="prix"
              type="number"
              step="0.01"
              min="0.01"
              value={form.prix}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
          <select
            name="categorieId"
            value={form.categorieId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
          >
            <option value="">Aucune</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 text-white px-6 py-3 rounded-md font-medium"
        >
          {envoi ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
