import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'child' | 'parent';
  parentId?: string;
}

interface Session {
  token: string;
  expiresAt: string;
}

interface ChildProgress {
  id: string;
  displayName: string;
  createdAt: string;
  progress: {
    completed_mysteries: string[];
    word_families_mastered: string[];
    total_stars: number;
  };
  badges: { badge_id: string; earned_at: string }[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, displayName: string, role?: 'child' | 'parent', parentId?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getChildren: () => Promise<ChildProgress[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'wordWhiskerUser',
  SESSION: 'wordWhiskerSession',
  CHILDREN: 'wordWhiskerChildren'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
        
        if (storedUser && storedSession) {
          const session: Session = JSON.parse(storedSession);
          const sessionExpiry = new Date(session.expiresAt);
          
          // Check if session is still valid
          if (sessionExpiry > new Date()) {
            const userData: User = JSON.parse(storedUser);
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.SESSION);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: 'child' | 'parent' = 'child',
    parentId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Try to call the edge function
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { 
          action: 'signup', 
          email: email.toLowerCase(), 
          password, 
          name: displayName
        }
      });

      if (error) {
        console.warn('Edge function error, using local mode:', error);
        return createLocalUser(email, displayName, role, parentId);
      }

      if (data && data.success) {
        // Server signup successful
        const newUser: User = {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.name || displayName,
          role,
          parentId
        };

        const session: Session = {
          token: data.session.token,
          expiresAt: data.session.expiresAt
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        setUser(newUser);
        return { success: true };
      }

      // Server returned an error
      if (data && data.error) {
        console.warn('Server signup error:', data.error);
      }
      
      // Fallback to local mode
      return createLocalUser(email, displayName, role, parentId);
    } catch (error) {
      console.error('Sign up error, falling back to local mode:', error);
      return createLocalUser(email, displayName, role, parentId);
    }
  };

  const createLocalUser = (
    email: string, 
    displayName: string, 
    role: 'child' | 'parent',
    parentId?: string
  ): { success: boolean; error?: string } => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      displayName,
      role,
      parentId
    };

    const session: Session = {
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    setUser(newUser);
    return { success: true };
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Try to call the edge function
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { 
          action: 'login', 
          email: email.toLowerCase(), 
          password 
        }
      });

      if (error) {
        console.warn('Edge function error:', error);
        // For demo purposes, allow local sign in
        return signInLocal(email);
      }

      if (data && data.success) {
        const signedInUser: User = {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.name,
          role: 'parent' // Default to parent for sign in
        };

        const session: Session = {
          token: data.session.token,
          expiresAt: data.session.expiresAt
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(signedInUser));
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        setUser(signedInUser);
        return { success: true };
      }

      if (data && data.error) {
        return { success: false, error: data.error };
      }

      // Fallback to local sign in for demo
      return signInLocal(email);
    } catch (error) {
      console.error('Sign in error:', error);
      return signInLocal(email);
    }
  };

  const signInLocal = (email: string): { success: boolean; error?: string } => {
    // Check if user exists in local storage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const userData: User = JSON.parse(storedUser);
      if (userData.email.toLowerCase() === email.toLowerCase()) {
        // Refresh session
        const session: Session = {
          token: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        setUser(userData);
        return { success: true };
      }
    }

    // For demo, create a new user on sign in
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      displayName: email.split('@')[0],
      role: 'parent'
    };

    const session: Session = {
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    setUser(newUser);
    return { success: true };
  };

  const signOut = async () => {
    try {
      await supabase.functions.invoke('auth', {
        body: { action: 'logout' }
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
    
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
  };

  const getChildren = async (): Promise<ChildProgress[]> => {
    if (user?.role !== 'parent') return [];

    // Get children from local storage
    const storedChildren = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    if (storedChildren) {
      return JSON.parse(storedChildren);
    }

    return [];
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
      getChildren
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
