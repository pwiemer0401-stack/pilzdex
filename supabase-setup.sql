-- ═══════════════════════════════════════════════════════════════
-- Pilzdex – Datenbank einrichten
-- In Supabase: SQL Editor → New query → alles einfügen → Run
-- ═══════════════════════════════════════════════════════════════

-- 1) Crew: wer darf mitmachen?  (E-Mail-Adressen eurer Freunde)
create table if not exists public.crew (
  email text primary key,
  name  text not null
);

-- Hilfsfunktion: Ist die angemeldete Person in der Crew?
create or replace function public.is_crew()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.crew
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 2) Funde
create table if not exists public.finds (
  id           uuid primary key default gen_random_uuid(),
  species_id   text,                                   -- null = noch unbestimmt
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  finder_email text not null default lower(auth.jwt() ->> 'email'),
  photo_path   text,
  thumb_path   text,
  lat          double precision,
  lng          double precision,
  accuracy_m   real,
  found_at     timestamptz not null default now(),
  note         text,
  created_at   timestamptz not null default now()
);
create index if not exists finds_species_idx on public.finds (species_id);

-- 3) Titelbilder im Dex (pro Art ein ausgewählter Fund)
create table if not exists public.covers (
  species_id text primary key,
  find_id    uuid not null references public.finds(id) on delete cascade,
  set_by     uuid default auth.uid(),
  updated_at timestamptz not null default now()
);

-- 4) Zugriffsregeln (Row Level Security)
alter table public.crew   enable row level security;
alter table public.finds  enable row level security;
alter table public.covers enable row level security;

drop policy if exists "crew lesen" on public.crew;
create policy "crew lesen" on public.crew for select to authenticated using (public.is_crew());

drop policy if exists "funde lesen" on public.finds;
drop policy if exists "funde anlegen" on public.finds;
drop policy if exists "funde bearbeiten" on public.finds;
drop policy if exists "eigene funde loeschen" on public.finds;
create policy "funde lesen"    on public.finds for select to authenticated using (public.is_crew());
create policy "funde anlegen"  on public.finds for insert to authenticated with check (public.is_crew() and user_id = auth.uid());
-- Alle in der Crew dürfen Art/Notiz korrigieren (z. B. unbestimmte Funde bestimmen)
create policy "funde bearbeiten" on public.finds for update to authenticated using (public.is_crew()) with check (public.is_crew());
create policy "eigene funde loeschen" on public.finds for delete to authenticated using (public.is_crew() and user_id = auth.uid());

drop policy if exists "titelbilder" on public.covers;
create policy "titelbilder" on public.covers for all to authenticated using (public.is_crew()) with check (public.is_crew());

-- 5) Foto-Speicher
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists "fotos hochladen" on storage.objects;
drop policy if exists "eigene fotos loeschen" on storage.objects;
create policy "fotos hochladen" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and public.is_crew());
create policy "eigene fotos loeschen" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and owner = auth.uid());

-- 6) Live-Aktualisierung (neue Funde erscheinen sofort bei allen)
do $$
begin
  begin alter publication supabase_realtime add table public.finds;  exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.covers; exception when duplicate_object then null; end;
end $$;

-- 7) Crew eintragen  ← HIER eure Adressen einsetzen und diese Zeilen ausführen
-- insert into public.crew (email, name) values
--   ('paul@example.com',  'Paul'),
--   ('freund@example.com', 'Max');
