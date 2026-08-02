'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  prix: number;
  couverture: string | null;
}

interface CartItem {
  livre: Livre;
  quantite: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (livre: Livre, quantite?: number) => void;
  removeFromCart: (livreId: number) => void;
  updateQuantite: (livreId: number, quantite: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur de CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (livre: Livre, quantite = 1) => {
    setItems((prev) => {
      const existant = prev.find((item) => item.livre.id === livre.id);
      if (existant) {
        return prev.map((item) =>
          item.livre.id === livre.id
            ? { ...item, quantite: item.quantite + quantite }
            : item,
        );
      }
      return [...prev, { livre, quantite }];
    });
  };

  const removeFromCart = (livreId: number) => {
    setItems((prev) => prev.filter((item) => item.livre.id !== livreId));
  };

  const updateQuantite = (livreId: number, quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(livreId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.livre.id === livreId ? { ...item, quantite } : item)),
    );
  };

  const clearCart = () => setItems([]);

  const getTotal = () =>
    items.reduce((total, item) => total + item.livre.prix * item.quantite, 0);

  const getItemCount = () =>
    items.reduce((count, item) => count + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantite, clearCart, getTotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}