"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { pullUserData, pushUserData } from "@/lib/cloudSync";

interface AuthContextValue {
  configured: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncNow = useCallback(async () => {
    if (!supabase || !user) return { error: null };
    try {
      await pushUserData(supabase, user.id);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Sync failed" };
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        try {
          const { merged } = await pullUserData(supabase, nextUser.id);
          if (merged) window.location.reload();
        } catch {
          /* local-only fallback */
        }
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (syncTimer.current) clearInterval(syncTimer.current);
    if (!user || !supabase) return;

    syncTimer.current = setInterval(() => {
      void pushUserData(supabase, user.id);
    }, 45_000);

    return () => {
      if (syncTimer.current) clearInterval(syncTimer.current);
    };
  }, [user, supabase]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: "Cloud sync is not configured" };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: "Cloud sync is not configured" };
      const { error } = await supabase.auth.signUp({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    if (user) await pushUserData(supabase, user.id);
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase, user]);

  return (
    <AuthContext.Provider
      value={{ configured, user, loading, signIn, signUp, signOut, syncNow }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}