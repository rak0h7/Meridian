"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { pullUserData, pushUserData } from "@/lib/cloudSync";
import { accountLabel } from "@/lib/accessKey.shared";

interface AuthResult {
  error: string | null;
  accessKey?: string;
}

interface SessionPayload {
  access_token: string;
  refresh_token: string;
}

interface AuthContextValue {
  configured: boolean;
  user: User | null;
  accountName: string | null;
  loading: boolean;
  signIn: (accessKey: string) => Promise<AuthResult>;
  createAccount: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function applySession(
  supabase: ReturnType<typeof createClient>,
  session: SessionPayload
): Promise<string | null> {
  const { error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  return error?.message ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const accountName = useMemo(() => {
    if (!user) return null;
    const fingerprint = user.user_metadata?.key_fingerprint as string | undefined;
    if (fingerprint) return accountLabel(fingerprint);
    return "Account";
  }, [user]);

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
    async (accessKey: string) => {
      if (!supabase) return { error: "Auth is not configured" };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey }),
      });

      const data = (await res.json()) as SessionPayload & { error?: string };
      if (!res.ok) return { error: data.error ?? "Sign in failed" };

      const sessionError = await applySession(supabase, data);
      return { error: sessionError };
    },
    [supabase]
  );

  const createAccount = useCallback(async () => {
    if (!supabase) return { error: "Auth is not configured" };

    const res = await fetch("/api/auth/register", { method: "POST" });
    const data = (await res.json()) as SessionPayload & { accessKey?: string; error?: string };

    if (!res.ok) return { error: data.error ?? "Account creation failed" };

    const sessionError = await applySession(supabase, data);
    if (sessionError) return { error: sessionError };

    return { error: null, accessKey: data.accessKey };
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    if (user) await pushUserData(supabase, user.id);
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/auth/login";
  }, [supabase, user]);

  return (
    <AuthContext.Provider
      value={{ configured, user, accountName, loading, signIn, createAccount, signOut, syncNow }}
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