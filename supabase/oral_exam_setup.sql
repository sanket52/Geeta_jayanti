-- Run this in the Supabase SQL editor before enabling video submissions.
-- Students and staff must sign in through Supabase Auth. The app's current
-- localStorage demo login is not an identity provider and cannot satisfy RLS.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  registration_number text unique,
  role text not null check (role in ('student', 'teacher', 'admin')) default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.oral_exam_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  registration_number text not null,
  student_name text not null,
  subject text not null,
  question text not null,
  storage_path text not null unique,
  content_type text not null,
  file_size bigint not null check (file_size > 0),
  status text not null default 'Submitted' check (status in ('Submitted', 'Evaluated')),
  uploaded_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.oral_exam_submissions enable row level security;

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create policy "Profiles readable by owner and staff" on public.profiles
  for select to authenticated using (
    id = (select auth.uid()) or public.current_user_role() in ('teacher', 'admin')
  );

create policy "Students can add their own submissions" on public.oral_exam_submissions
  for insert to authenticated with check (
    student_id = (select auth.uid()) and exists (
      select 1 from public.profiles p where p.id = (select auth.uid())
        and p.role = 'student' and p.registration_number = registration_number
    )
  );

create policy "Students and staff can read permitted submissions" on public.oral_exam_submissions
  for select to authenticated using (
    student_id = (select auth.uid()) or public.current_user_role() in ('teacher', 'admin')
  );

create policy "Staff can update submissions" on public.oral_exam_submissions
  for update to authenticated using (public.current_user_role() in ('teacher', 'admin'))
  with check (public.current_user_role() in ('teacher', 'admin'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('oral-exam-videos', 'oral-exam-videos', false, 524288000, array['video/webm', 'video/mp4', 'video/quicktime'])
on conflict (id) do update set public = false, file_size_limit = 524288000,
  allowed_mime_types = array['video/webm', 'video/mp4', 'video/quicktime'];

create policy "Students upload into their own folder" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'oral-exam-videos' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Students and staff read permitted video files" on storage.objects
  for select to authenticated using (
    bucket_id = 'oral-exam-videos' and (
      (storage.foldername(name))[1] = (select auth.uid())::text or public.current_user_role() in ('teacher', 'admin')
    )
  );
