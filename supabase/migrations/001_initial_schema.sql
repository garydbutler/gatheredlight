-- GatheredLight Database Schema
-- A memorial tribute platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TRIBUTES
-- ============================================
create table public.tributes (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references auth.users(id) on delete set null,
  name text not null,
  born_date date,
  passed_date date,
  cover_photo_url text,
  bio text,
  privacy text not null default 'private' check (privacy in ('public', 'private', 'family')),
  invite_code text unique default substr(replace(uuid_generate_v4()::text, '-', ''), 1, 8),
  theme_config jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CONTRIBUTORS
-- ============================================
create table public.contributors (
  id uuid primary key default uuid_generate_v4(),
  tribute_id uuid not null references public.tributes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  relationship text,
  invited_by uuid references auth.users(id) on delete set null,
  status text not null default 'invited' check (status in ('invited', 'active', 'removed')),
  created_at timestamptz default now()
);

-- ============================================
-- MEMORIES
-- ============================================
create table public.memories (
  id uuid primary key default uuid_generate_v4(),
  tribute_id uuid not null references public.tributes(id) on delete cascade,
  contributor_id uuid references public.contributors(id) on delete set null,
  type text not null check (type in ('story', 'photo', 'voice', 'video')),
  title text,
  content text,
  media_url text,
  memory_date date,
  location text,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- SLIDESHOWS
-- ============================================
create table public.slideshows (
  id uuid primary key default uuid_generate_v4(),
  tribute_id uuid not null references public.tributes(id) on delete cascade,
  title text not null,
  config_json jsonb default '{}',
  generated_url text,
  status text default 'draft' check (status in ('draft', 'generating', 'ready')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- REACTIONS
-- ============================================
create table public.reactions (
  id uuid primary key default uuid_generate_v4(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique(memory_id, user_id, emoji)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.tributes enable row level security;
alter table public.contributors enable row level security;
alter table public.memories enable row level security;
alter table public.slideshows enable row level security;
alter table public.reactions enable row level security;

-- Tributes: creator can do anything, public tributes readable by all
create policy "tributes_select" on public.tributes for select using (
  privacy = 'public' or creator_id = auth.uid() or
  exists (select 1 from public.contributors where tribute_id = id and user_id = auth.uid() and status = 'active')
);
create policy "tributes_insert" on public.tributes for insert with check (creator_id = auth.uid());
create policy "tributes_update" on public.tributes for update using (creator_id = auth.uid());
create policy "tributes_delete" on public.tributes for delete using (creator_id = auth.uid());

-- Contributors: tribute creator and active contributors can view
create policy "contributors_select" on public.contributors for select using (
  exists (select 1 from public.tributes where id = tribute_id and (creator_id = auth.uid() or privacy = 'public'))
  or user_id = auth.uid()
);
create policy "contributors_insert" on public.contributors for insert with check (
  exists (select 1 from public.tributes where id = tribute_id and creator_id = auth.uid())
);

-- Memories: viewable by tribute participants
create policy "memories_select" on public.memories for select using (
  exists (select 1 from public.tributes where id = tribute_id and (
    privacy = 'public' or creator_id = auth.uid() or
    exists (select 1 from public.contributors where tribute_id = memories.tribute_id and user_id = auth.uid() and status = 'active')
  ))
);
create policy "memories_insert" on public.memories for insert with check (
  exists (select 1 from public.contributors where id = contributor_id and user_id = auth.uid() and status = 'active')
  or exists (select 1 from public.tributes where id = tribute_id and creator_id = auth.uid())
);

-- Slideshows: tribute creator only
create policy "slideshows_select" on public.slideshows for select using (
  exists (select 1 from public.tributes where id = tribute_id and (creator_id = auth.uid() or privacy = 'public'))
);
create policy "slideshows_manage" on public.slideshows for all using (
  exists (select 1 from public.tributes where id = tribute_id and creator_id = auth.uid())
);

-- Reactions: authenticated users on accessible memories
create policy "reactions_select" on public.reactions for select using (true);
create policy "reactions_insert" on public.reactions for insert with check (auth.uid() = user_id);
create policy "reactions_delete" on public.reactions for delete using (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public) values ('tribute-media', 'tribute-media', true);

create policy "tribute_media_upload" on storage.objects for insert with check (
  bucket_id = 'tribute-media' and auth.role() = 'authenticated'
);
create policy "tribute_media_read" on storage.objects for select using (
  bucket_id = 'tribute-media'
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_memories_tribute on public.memories(tribute_id);
create index idx_memories_date on public.memories(memory_date);
create index idx_contributors_tribute on public.contributors(tribute_id);
create index idx_tributes_invite_code on public.tributes(invite_code);
create index idx_reactions_memory on public.reactions(memory_id);
