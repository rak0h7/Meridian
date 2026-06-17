"use client";

import Link from "next/link";
import { Cloud, LogIn, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function AccountSettings() {
  const { configured, user, loading, signOut, syncNow } = useAuth();
  const { toast } = useToast();

  const handleSync = async () => {
    const { error } = await syncNow();
    if (error) toast({ type: "error", title: "Sync failed", description: error });
    else toast({ type: "success", title: "Cloud backup saved" });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ type: "info", title: "Signed out" });
  };

  return (
    <div className={cn(ui.card, ui.cardPad)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--intel)]/30 bg-[var(--intel-dim)]">
          <Cloud className="h-5 w-5 text-[var(--intel)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={ui.sectionTitle}>Account & cloud sync</h3>
          <p className={`${ui.sectionSub} mt-1`}>
            {configured
              ? "Your Meridian data is backed up and synced to your account."
              : "Add Supabase keys to enable accounts."}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Checking session…</p>
        ) : user ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--foreground)]">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleSync} className={cn(ui.btnSecondary, "text-xs")}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Sync now
              </button>
              <button type="button" onClick={handleSignOut} className={cn(ui.btnGhost, "text-xs text-[var(--danger)]")}>
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
            <p className="text-[11px] text-[var(--muted)]">Auto-sync runs every 45 seconds while signed in.</p>
          </div>
        ) : (
          <Link href="/auth/login" className={cn(ui.btnPrimary, "inline-flex text-xs")}>
            <LogIn className="mr-1.5 h-3.5 w-3.5" />
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}