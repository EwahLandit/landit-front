import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, apiLogin, apiRegister, getToken, saveToken, clearToken, fetchApi } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = getToken();
      if (storedToken) {
        const res = await fetchApi<AuthUser>('/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if ('error' in res) {
          clearToken();
          setToken(null);
          setUser(null);
        } else {
          setUser(res);
          setToken(storedToken);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if ('error' in res) return { error: res.error };
    
    saveToken(res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    return {};
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiRegister(name, email, password);
    if ('error' in res) return { error: res.error };
    
    saveToken(res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    return {};
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
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
