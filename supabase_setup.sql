-- 1. Create a table for storing general settings (profile, links, etc.)
create table if not exists settings (
  id text primary key,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for settings
alter table settings enable row level security;

-- Policy: Everyone can read settings
create policy "Everyone can read settings"
  on settings for select
  using (true);

-- Policy: Only authenticated users can insert/update settings
create policy "Authenticated users can update settings"
  on settings for all
  using (auth.role() = 'authenticated');

-- 2. Create a table for analytics
create table if not exists analytics (
  id bigserial primary key,
  path text,
  source text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for analytics
alter table analytics enable row level security;

-- Policy: Everyone can insert analytics (tracking visits)
create policy "Everyone can insert analytics"
  on analytics for insert
  with check (true);

-- Policy: Only authenticated users (admins) can view analytics
create policy "Admins can view analytics"
  on analytics for select
  using (auth.role() = 'authenticated');

-- 3. Storage Bucket for images
-- Go to Storage > Create a new bucket named 'images'
-- Make it Public
