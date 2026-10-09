-- Run once in Supabase Dashboard > SQL Editor.
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    created_at timestamptz not null default now()
);

create table if not exists public.announcements (
    id bigint generated always as identity primary key,
    title text not null,
    content text not null,
    published boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists public.messages (
    id bigint generated always as identity primary key,
    sender_id uuid not null references public.profiles(id) on delete cascade,
    recipient_id uuid not null references public.profiles(id) on delete cascade,
    content text not null check (char_length(content) between 1 and 5000),
    created_at timestamptz not null default now()
);

-- Create a profile automatically when someone registers.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name')
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
    for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
    for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "announcements read published" on public.announcements;
create policy "announcements read published" on public.announcements
    for select to anon, authenticated using (published = true);

drop policy if exists "messages read own" on public.messages;
create policy "messages read own" on public.messages
    for select to authenticated
    using (auth.uid() = sender_id or auth.uid() = recipient_id);
drop policy if exists "messages send as self" on public.messages;
create policy "messages send as self" on public.messages
    for insert to authenticated with check (auth.uid() = sender_id);

-- Sample announcement
insert into public.announcements (title, content)
select 'Welcome to SMCC Connect', 'Your campus community is now online.'
where not exists (select 1 from public.announcements);
