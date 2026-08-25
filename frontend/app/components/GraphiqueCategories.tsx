'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatCategorie {
  nom: string;
  nombreLivres: number;
}

export function GraphiqueCategories() {
  const [stats, setStats] = useState<StatCategorie[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/livre/stats-categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setStats(Array.isArray(data) ? data : []));
  }, []);

  if (stats.length === 0) return null;

  const data = {
    labels: stats.map((s) => s.nom),
    datasets: [
      {
        label: 'Nombre de livres',
        data: stats.map((s) => s.nombreLivres),
        backgroundColor: '#4338ca',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="border border-slate-200 rounded-lg p-6">
      <h2 className="font-semibold text-slate-900 mb-4">Répartition des livres par catégorie</h2>
      <Bar data={data} options={options} />
    </div>
  );
}