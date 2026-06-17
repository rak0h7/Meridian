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

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/tfcplpxcorcqbjqbukem/sql/new)
2. Paste and run `supabase/schema.sql`
3. In **Authentication → Providers**, enable Email
4. Copy **Project URL** and **anon public key** into `.env.local`

## Deploy (Vercel + GitHub)

1. Push this repo to `https://github.com/rak0h7/Meridian`
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js

## Cloud sync

- Works without an account (local storage only)
- Sign in via **Settings → Account & cloud sync** to back up data to Supabase
- Modules synced: labs, cycle, gym, nutrition, settings