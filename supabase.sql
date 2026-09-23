-- AnniverCard short-link database
create table if not exists public.cards (
  id text primary key,
  template_slug text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.cards enable row level security;

drop policy if exists "public can create cards" on public.cards;
create policy "public can create cards"
on public.cards for insert
to anon
with check (char_length(id) between 6 and 12);

drop policy if exists "public can read cards" on public.cards;
create policy "public can read cards"
on public.cards for select
to anon
using (true);

-- Media bucket used by photos and voice recordings.
insert into storage.buckets (id, name, public)
values ('card-media','card-media',true)
on conflict (id) do nothing;

drop policy if exists "public can upload card media" on storage.objects;
create policy "public can upload card media"
on storage.objects for insert
to anon
with check (bucket_id = 'card-media');

drop policy if exists "public can read card media" on storage.objects;
create policy "public can read card media"
on storage.objects for select
to anon
using (bucket_id = 'card-media');
