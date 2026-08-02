import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import "./globals.css";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';


export const metadata: Metadata = {
  title: "Librairie en ligne",
  description: "E-commerce de livres enrichi par l'IA",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <NextIntlClientProvider>
  <AuthProvider>
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  </AuthProvider>
</NextIntlClientProvider>
      </body>
    </html>
  );
}