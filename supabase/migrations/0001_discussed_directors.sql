-- Editable mention counts for the "Most Discussed Directors This Week" section.
-- The director roster (name, photo, currently-discussed film) stays static in
-- src/data/directors.ts; this table only overlays each director's numeric count.
-- Apply once in the Supabase SQL editor / Studio.

create table if not exists public.discussed_directors (
  id          text primary key,         -- matches discussedDirectors[].id, e.g. 'denis-villeneuve'
  mentions    integer not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.discussed_directors enable row level security;

create policy "public read" on public.discussed_directors
  for select using (true);
-- Writes go through the service-role key (bypasses RLS); no write policy needed.

insert into public.discussed_directors (id, mentions) values
  ('paul-thomas-anderson', 1800),
  ('denis-villeneuve',     2400),
  ('david-lynch',          1500)
on conflict (id) do nothing;
