"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { configured, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace("/auth/login");
    }
  }, [loading, configured, user, router]);

  if (!configured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className={cn(ui.card, ui.cardPad, "w-full max-w-md text-center")}>
          <h1 className={ui.pageTitle}>Authentication required</h1>
          <p className={`${ui.pageSub} mt-2`}>
            Add Supabase environment variables to enable sign-in. Copy{" "}
            <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-xs">.env.example</code>{" "}
            to <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-xs">.env.local</code>{" "}
            and set your project URL and anon key.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--labs)]"
            aria-hidden
          />
          <p className="text-sm text-[var(--muted)]">Checking session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}