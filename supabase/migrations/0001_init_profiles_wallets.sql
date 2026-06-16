-- BuilderDesk — initial schema: per-builder profiles + wallets, RLS-locked.
-- Run this in your new project's SQL Editor (Supabase dashboard).

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  skills       text,
  ecosystems   text,
  capacity     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are self-owned"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.wallets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  address    text not null,
  ens_name   text,
  label      text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, address)
);

alter table public.wallets enable row level security;

create policy "wallets are self-owned"
  on public.wallets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- keep profiles.updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
