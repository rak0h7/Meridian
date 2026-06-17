-- Meridian: run in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_modules (
  user_id uuid not null references auth.users (id) on delete cascade,
  module text not null check (module in ('labs', 'cycle', 'gym', 'nutrition', 'settings')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, module)
);

create index if not exists user_modules_user_id_idx on public.user_modules (user_id);

alter table public.profiles enable row level security;
alter table public.user_modules enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "user_modules_select_own" on public.user_modules
  for select using (auth.uid() = user_id);

create policy "user_modules_insert_own" on public.user_modules
  for insert with check (auth.uid() = user_id);

create policy "user_modules_update_own" on public.user_modules
  for update using (auth.uid() = user_id);

create policy "user_modules_delete_own" on public.user_modules
  for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();