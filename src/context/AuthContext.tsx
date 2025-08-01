'use client'; // Important for client-side functionality in App Router

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // For App Router

interface User {
  id: string;
  email: string;
  name?: string; // Or whatever user data you get from your backend
}

interface AuthContextType {
  user: User | null;
  token: string | null; // Add token to context for client-side access
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean; // To indicate if auth state is still being loaded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Attempt to load auth state from localStorage on initial render
    const storedToken = localStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken && storedUserData) {
      try {
        setUser(JSON.parse(storedUserData));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Clear invalid data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false); // Authentication state loaded
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    router.push('/login'); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}