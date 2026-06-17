import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { ui } from "@/lib/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-semibold text-gradient">
            Meridian
          </Link>
          <h1 className={`${ui.pageTitle} mt-3`}>Sign in</h1>
          <p className={ui.pageSub}>Sync labs, protocol, training, and nutrition across devices.</p>
        </div>
        <AuthForm mode="login" />
        <p className="text-center text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--foreground)]">Continue without an account →</Link>
        </p>
      </div>
    </div>
  );
}