"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
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

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;

      if (sessionUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, location")
          .eq("id", sessionUser.id)
          .single();

        setUser({
          id: sessionUser.id,
          email: sessionUser.email || "",
          name: profile?.full_name || "",
          location: profile?.location || "",
        });
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
          name: profile?.full_name || "",
          location: profile?.location || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    // Fetch user profile after sign in
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
        name: profile?.full_name || "",
        location: profile?.location || "",
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
    });

    if (error) throw new Error(error.message);

    const userId = data.user?.id;
    if (!userId) throw new Error("Account created but no user ID returned.");

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name: name,
        location,
      },
    ]);

    if (profileError) {
      console.error("Error inserting profile:", profileError);
      throw new Error("Signup succeeded but failed to save profile info.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
