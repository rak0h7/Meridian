# Meridian

Labs, protocol, training, and nutrition — one health command center.

## Authentication (access key)

Meridian uses **private access keys** — no email, no verification links.

1. **Create account** → generates a key like `meridian_k7xm_9p2q_rn4w_h8tj`
2. **Save it immediately** — shown once, cannot be recovered
3. **Sign in** → paste your key

## Local development

```bash
cd /path/to/clone3
cp .env.example .env.local   # add anon + service_role keys
npm install
npm run dev                    # http://localhost:1337
```

## Supabase setup

Project: `https://tfcplpxcorcqbjqbukem.supabase.co`

1. [SQL Editor](https://supabase.com/dashboard/project/tfcplpxcorcqbjqbukem/sql/new) → run `supabase/schema.sql`
2. **Authentication → Providers** → disable email signups (optional; keys are used instead)
3. Copy keys from **Project Settings → API** into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)

## Deploy (Vercel + GitHub)

Repo: `https://github.com/rak0h7/Meridian`

1. Import at [vercel.com/new](https://vercel.com/new)
2. Environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for key auth API routes)
3. Deploy — Vercel auto-detects Next.js 16

## Cloud sync

- Sign-in required (access key)
- Data syncs automatically while signed in
- Modules: labs, cycle, gym, nutrition, settings