
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string | null;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real application, you would use Supabase or another auth provider
  // For demo purposes, we'll simulate authentication
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      const mockUser = {
        id: '123',
        email: 'demo@example.com',
        user_metadata: {
          name: 'Demo User',
          avatar_url: '/public/placeholder-user.jpg',
        },
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 500);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate sign in
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser = {
            id: '123',
            email,
            user_metadata: {
              name: 'Demo User',
              avatar_url: '/public/placeholder-user.jpg',
            },
          };
          setUser(mockUser);
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate sign up
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signOut = async () => {
    // Simulate signout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        resolve();
      }, 300);
    });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
