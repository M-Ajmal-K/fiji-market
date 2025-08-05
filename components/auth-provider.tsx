"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, location: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount, fetch session & profile
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (sessionUser) {
        // fetch profile row
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, location")
          .eq("id", sessionUser.id)
          .single();
        setUser({
          id: sessionUser.id,
          email: sessionUser.email || "",
          name: profile?.full_name || undefined,
          location: profile?.location || undefined,
        });
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user;
        if (sessionUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, location")
            .eq("id", sessionUser.id)
            .single();
          setUser({
            id: sessionUser.id,
            email: sessionUser.email || "",
            name: profile?.full_name || undefined,
            location: profile?.location || undefined,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    // once signed in, fetch profile
    const sessionUser = data.user;
    if (sessionUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, location")
        .eq("id", sessionUser.id)
        .single();
      setUser({
        id: sessionUser.id,
        email: sessionUser.email || "",
        name: profile?.full_name || undefined,
        location: profile?.location || undefined,
      });
    }

    router.push("/");
  };

  const signUp = async (
    name: string,
    location: string,
    email: string,
    password: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, location },
      },
    });
    if (error) throw new Error(error.message);
    // user must confirm via email; onAuthStateChange will pick up the user & profile row later
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
