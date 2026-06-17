# Meridian

Labs, protocol, training, and nutrition — one health command center.

## Local development

```bash
cd /path/to/clone3
cp .env.example .env.local   # add your Supabase anon key
npm install
npm run dev                    # http://localhost:1337
```

## Supabase setup

Project: `https://tfcplpxcorcqbjqbukem.supabase.co`

1. Open [SQL Editor](https://supabase.com/dashboard/project/tfcplpxcorcqbjqbukem/sql/new) → paste and run `supabase/schema.sql`
2. **Authentication → Providers** → enable **Email** (confirm email optional for dev)
3. **Authentication → URL Configuration**:
   - **Site URL**: your production URL (e.g. `https://meridian.vercel.app`) or `http://localhost:1337` for local dev
   - **Redirect URLs** (add both):
     - `http://localhost:1337/auth/callback`
     - `https://<your-vercel-domain>/auth/callback`
4. **Project Settings → API** → copy **anon public** key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tfcplpxcorcqbjqbukem.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Deploy (Vercel + GitHub)

Repo: `https://github.com/rak0h7/Meridian`

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Add environment variables (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy — Vercel auto-detects Next.js 16
4. After first deploy, update Supabase **Site URL** and add your Vercel **Redirect URL** (step 3 above)

## Cloud sync

- Works without an account (local storage only)
- Sign in via **Settings → Account & cloud sync** to back up data to Supabase
- Modules synced: labs, cycle, gym, nutrition, settings