import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <h1 className="text-3xl font-serif font-semibold text-indigo-950 mb-8">
        Back-office administrateur
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="border border-slate-200 rounded-lg p-2 space-y-1">
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/livres"
              className="block px-4 py-3 rounded-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
            >
              Livres
            </Link>
            <Link
              href="/admin/commandes"
              className="block px-4 py-3 rounded-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
            >
              Commandes
            </Link>
            <Link
              href="/admin/clients"
              className="block px-4 py-3 rounded-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
            >
              Clients
            </Link>
            <Link
              href="/admin/avis"
              className="block px-4 py-3 rounded-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
            >
              Avis
            </Link>
          </nav>
        </div>

        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}