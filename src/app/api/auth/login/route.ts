import { NextResponse } from "next/server";
import {
  fingerprintAccessKey,
  internalEmail,
  normalizeAccessKey,
  verifyAccessKey,
} from "@/lib/accessKey";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAuthServerConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  if (!isAuthServerConfigured()) {
    return NextResponse.json({ error: "Auth server is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { accessKey?: string };
  const accessKey = normalizeAccessKey(body.accessKey ?? "");

  if (!accessKey.startsWith("meridian_")) {
    return NextResponse.json({ error: "Invalid access key format" }, { status: 400 });
  }

  const admin = createAdminClient();
  const keyFingerprint = fingerprintAccessKey(accessKey);

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, access_key_hash")
    .eq("key_fingerprint", keyFingerprint)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (!profile || !(await verifyAccessKey(accessKey, profile.access_key_hash))) {
    return NextResponse.json({ error: "Invalid access key" }, { status: 401 });
  }

  const { data: secretRow, error: secretError } = await admin
    .from("auth_secrets")
    .select("session_secret")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (secretError || !secretRow?.session_secret) {
    return NextResponse.json({ error: "Account credentials unavailable" }, { status: 500 });
  }

  const { data: sessionData, error: sessionError } = await admin.auth.signInWithPassword({
    email: internalEmail(profile.id),
    password: secretRow.session_secret,
  });

  if (sessionError || !sessionData.session) {
    return NextResponse.json(
      { error: sessionError?.message ?? "Sign in failed" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    expires_at: sessionData.session.expires_at,
  });
}