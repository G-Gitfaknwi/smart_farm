'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { isSupabaseConfigured } from '../../lib/services/db';

type UserProfile = {
  id: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  isLocal: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient();
const LOCAL_USERS_KEY = 'sf_registered_users';
const CURRENT_USER_KEY = 'sf_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(true);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsLocal(!configured);

    if (configured) {
      // Supabase Auth Integration
      const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'Farm Owner',
          });
        }
        setLoading(false);
      };

      getSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'Farm Owner',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // LocalStorage Mock Auth System
      const localUser = localStorage.getItem(CURRENT_USER_KEY);
      if (localUser) {
        setUser(JSON.parse(localUser));
      } else {
        // Auto sign in a default mock user for convenience
        const defaultUser = { id: 'mock-user-123', email: 'admin@smartfarm.com', role: 'Farm Owner' };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
        setUser(defaultUser);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      if (!isLocal) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
      } else {
        // Local validation
        const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
        // We'll also allow the default user
        if (email === 'admin@smartfarm.com' && password === 'admin123') {
          const defaultUser = { id: 'mock-user-123', email, role: 'Farm Owner' };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
          setUser(defaultUser);
          return { error: null };
        }
        
        const matched = users.find((u: any) => u.email === email && u.password === password);
        if (!matched) {
          return { error: 'Invalid email or password. Hint: Use admin@smartfarm.com / admin123' };
        }

        const loggedInUser = { id: matched.id, email: matched.email, role: 'Farm Owner' };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      if (!isLocal) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'Farm Owner' }
          }
        });
        if (error) return { error: error.message };
        return { error: null };
      } else {
        // Local registration
        const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
        if (users.some((u: any) => u.email === email) || email === 'admin@smartfarm.com') {
          return { error: 'Email already registered' };
        }

        const newUser = { id: crypto.randomUUID(), email, password };
        users.push(newUser);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

        // Sign in immediately
        const loggedInUser = { id: newUser.id, email: newUser.email, role: 'Farm Owner' };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    if (!isLocal) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLocal, signIn, signUp, signOut }}>
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
