"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn, signUp, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    const result = mode === "login"
      ? await signIn(email, password)
      : await signUp(email, password);

    setBusy(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === "signup") {
      setMessage("Account created. Check your email if confirmation is required, then sign in.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  if (!configured) {
    return (
      <div className={cn(ui.card, ui.cardPad, "text-center")}>
        <p className="text-sm text-[var(--muted)]">
          Supabase environment variables are not set. Add them to deploy with cloud sync.
        </p>
        <Link href="/" className={cn(ui.btnSecondary, "mt-4 inline-flex")}>
          Back to app
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn(ui.card, ui.cardPad, "space-y-4")}>
      <div>
        <label className={ui.label} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(ui.input, "mt-1.5")}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(ui.input, "mt-1.5")}
        />
      </div>

      {error && (
        <p className="rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-[var(--radius-md)] border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-2 text-sm text-[var(--success)]">
          {message}
        </p>
      )}

      <button type="submit" disabled={busy} className={cn(ui.btnPrimary, "w-full")}>
        {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        {mode === "login" ? (
          <>No account? <Link href="/auth/signup" className="text-[var(--labs)] hover:underline">Sign up</Link></>
        ) : (
          <>Have an account? <Link href="/auth/login" className="text-[var(--labs)] hover:underline">Sign in</Link></>
        )}
      </p>
    </form>
  );
}