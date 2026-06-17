import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { ui } from "@/lib/ui";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-semibold text-gradient">
            Meridian
          </Link>
          <h1 className={`${ui.pageTitle} mt-3`}>Create account</h1>
          <p className={ui.pageSub}>Your data stays private — secured with row-level access in Supabase.</p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}