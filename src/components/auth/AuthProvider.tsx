
import React, { useEffect, useState, createContext } from "react";
// @ts-ignore
import { createClient } from "@supabase/supabase-js";

// You should replace these with your actual Supabase values,
// but for local dev, Lovable automatically injects the correct keys.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface UserType {
  id: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? "",
        });
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, sess) => {
        if (sess?.user) {
          setUser({
            id: sess.user.id,
            email: sess.user.email ?? "",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const value = { user, loading, signIn, signUp, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
