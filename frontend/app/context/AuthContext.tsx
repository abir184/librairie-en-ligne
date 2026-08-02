'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Client {
  id: number;
  nom: string;
  email: string;
}

interface AuthContextType {
  client: Client | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedClient = localStorage.getItem('client');
    if (savedToken && savedClient) {
      setToken(savedToken);
      setClient(JSON.parse(savedClient));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const data = await res.json();
    setToken(data.access_token);
    setClient(data.client);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('client', JSON.stringify(data.client));
  };

  const logout = () => {
    setToken(null);
    setClient(null);
    localStorage.removeItem('token');
    localStorage.removeItem('client');
  };

  return (
    <AuthContext.Provider value={{ client, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}