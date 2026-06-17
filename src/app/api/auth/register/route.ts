import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import {
  fingerprintAccessKey,
  generateAccessKey,
  hashAccessKey,
  internalEmail,
} from "@/lib/accessKey";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAuthServerConfigured } from "@/lib/supabase/env";

export async function POST() {
  if (!isAuthServerConfigured()) {
    return NextResponse.json({ error: "Auth server is not configured" }, { status: 503 });
  }

  const admin = createAdminClient();
  const accessKey = generateAccessKey();
  const keyFingerprint = fingerprintAccessKey(accessKey);
  const accessKeyHash = await hashAccessKey(accessKey);
  const sessionSecret = randomBytes(32).toString("base64url");
  const userId = crypto.randomUUID();
  const email = internalEmail(userId);

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    id: userId,
    email,
    password: sessionSecret,
    email_confirm: true,
    user_metadata: { auth_type: "access_key", key_fingerprint: keyFingerprint },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create account" },
      { status: 500 }
    );
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: created.user.id,
    key_fingerprint: keyFingerprint,
    access_key_hash: accessKeyHash,
    display_name: `Account ···${keyFingerprint.slice(-4)}`,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { error: secretError } = await admin.from("auth_secrets").upsert({
    user_id: created.user.id,
    session_secret: sessionSecret,
  });

  if (secretError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: secretError.message }, { status: 500 });
  }

  const { data: sessionData, error: sessionError } = await admin.auth.signInWithPassword({
    email,
    password: sessionSecret,
  });

  if (sessionError || !sessionData.session) {
    return NextResponse.json(
      { error: sessionError?.message ?? "Account created but session failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    accessKey,
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    expires_at: sessionData.session.expires_at,
  });
}