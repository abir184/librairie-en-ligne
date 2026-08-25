'use client';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-serif font-semibold mb-2">Librairie en ligne</h3>
          <p className="text-slate-300 text-sm">
            Votre destination pour découvrir des livres, avec résumés et traductions générés par IA.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Service client</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>Contactez-nous</li>
            <li>Modes de livraison</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm text-slate-300" dir="ltr">+216 71 000 000</p>
          <p className="text-sm text-slate-300">Tunis, Tunisie</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        © 2026 Librairie en ligne. Tous droits réservés.
      </div>
    </footer>
  );
}