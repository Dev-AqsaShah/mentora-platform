-- Mentora platform — initial schema + RLS
-- Run against a Supabase Postgres project (or `supabase db push`).

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────

create type user_role as enum ('student', 'mentor', 'admin');
create type user_status as enum ('active', 'suspended', 'banned');
create type lesson_type as enum ('live', 'recorded');
create type attachment_kind as enum ('notes', 'slides', 'pastpaper');
create type live_class_status as enum ('scheduled', 'live', 'ended', 'cancelled');
create type quiz_type as enum ('mcq', 'mock');
create type assignment_type as enum ('essay', 'precis');
create type submission_status as enum ('pending', 'ai_reviewed', 'graded');
create type doubt_status as enum ('queued', 'answered');
create type doubt_visibility as enum ('public', 'private');
create type payment_provider as enum ('easypaisa', 'jazzcash', 'payoneer');
create type payment_status as enum ('pending', 'verified', 'failed');

-- ─────────────────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'student',
  status user_status not null default 'active',
  trial_ends_at timestamptz,
  premium_until timestamptz,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, trial_ends_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    now() + interval '3 days'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create function public.has_access(uid uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid
      and ((trial_ends_at is not null and trial_ends_at > now())
           or (premium_until is not null and premium_until > now()))
  );
$$;

create function public.current_role()
returns user_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- DEVICE / SESSION LIMITS (account-sharing protection)
-- ─────────────────────────────────────────────────────────────────────────

create table devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  device_fingerprint text not null,
  label text,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, device_fingerprint)
);

create table sessions_active (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  stream_token text not null,
  lesson_id uuid,
  started_at timestamptz not null default now(),
  last_heartbeat timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- CONTENT: papers → topics → lessons → attachments
-- ─────────────────────────────────────────────────────────────────────────

create table papers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references papers (id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics (id) on delete cascade,
  title text not null,
  type lesson_type not null default 'recorded',
  video_id text,
  is_free_preview boolean not null default false,
  sort_order int not null default 0,
  published_at timestamptz,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table attachments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  kind attachment_kind not null,
  title text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- LIVE CLASSES + ATTENDANCE + IN-ROOM CHAT/POLLS
-- ─────────────────────────────────────────────────────────────────────────

create table live_classes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons (id) on delete set null,
  title text not null,
  scheduled_at timestamptz not null,
  status live_class_status not null default 'scheduled',
  room_name text not null unique,
  recording_video_id text,
  started_at timestamptz,
  ended_at timestamptz,
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  live_class_id uuid not null references live_classes (id) on delete cascade,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  minutes int not null default 0,
  unique (user_id, live_class_id)
);

create table live_chat_messages (
  id uuid primary key default gen_random_uuid(),
  live_class_id uuid not null references live_classes (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table polls (
  id uuid primary key default gen_random_uuid(),
  live_class_id uuid not null references live_classes (id) on delete cascade,
  question text not null,
  options jsonb not null,
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  option_index int not null,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create table raised_hands (
  id uuid primary key default gen_random_uuid(),
  live_class_id uuid not null references live_classes (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  raised_at timestamptz not null default now(),
  cleared_at timestamptz,
  unique (live_class_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- TESTS & ASSIGNMENTS
-- ─────────────────────────────────────────────────────────────────────────

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons (id) on delete cascade,
  title text not null,
  type quiz_type not null default 'mcq',
  time_limit_minutes int,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes (id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  correct_index int not null,
  explanation text,
  sort_order int not null default 0
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  quiz_id uuid not null references quizzes (id) on delete cascade,
  score numeric,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create table assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons (id) on delete set null,
  title text not null,
  prompt text not null,
  type assignment_type not null default 'essay',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  text text not null,
  ai_feedback jsonb,
  mentor_marks numeric,
  mentor_feedback text,
  status submission_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- PROGRESS
-- ─────────────────────────────────────────────────────────────────────────

create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  watched_pct numeric not null default 0,
  last_position int not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- DOUBT DESK
-- ─────────────────────────────────────────────────────────────────────────

create table office_hours (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references profiles (id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null
);

create table doubts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  paper_id uuid references papers (id) on delete set null,
  lesson_id uuid references lessons (id) on delete set null,
  question text not null,
  status doubt_status not null default 'queued',
  visibility doubt_visibility not null default 'public',
  created_at timestamptz not null default now()
);

create table doubt_answers (
  id uuid primary key default gen_random_uuid(),
  doubt_id uuid not null references doubts (id) on delete cascade,
  mentor_id uuid not null references profiles (id),
  answer text not null,
  answered_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- PAYMENTS & NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  provider payment_provider not null,
  amount numeric not null,
  currency text not null default 'PKR',
  txn_id text not null,
  status payment_status not null default 'pending',
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table devices enable row level security;
alter table sessions_active enable row level security;
alter table papers enable row level security;
alter table topics enable row level security;
alter table lessons enable row level security;
alter table attachments enable row level security;
alter table live_classes enable row level security;
alter table attendance enable row level security;
alter table live_chat_messages enable row level security;
alter table polls enable row level security;
alter table poll_votes enable row level security;
alter table raised_hands enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table progress enable row level security;
alter table office_hours enable row level security;
alter table doubts enable row level security;
alter table doubt_answers enable row level security;
alter table payments enable row level security;
alter table notifications enable row level security;

-- profiles
create policy "profiles: self read" on profiles for select using (id = auth.uid());
create policy "profiles: mentor/admin read all" on profiles for select using (public.current_role() in ('mentor', 'admin'));
create policy "profiles: self update" on profiles for update using (id = auth.uid());
create policy "profiles: admin update all" on profiles for update using (public.current_role() = 'admin');

-- devices / sessions — owner only, mentors/admins can read for support
create policy "devices: owner rw" on devices for all using (user_id = auth.uid());
create policy "devices: admin read" on devices for select using (public.current_role() in ('mentor', 'admin'));
create policy "sessions: owner rw" on sessions_active for all using (user_id = auth.uid());

-- catalogue is public to read (papers/topics/lessons titles); lesson content gated at API layer
create policy "papers: public read" on papers for select using (true);
create policy "papers: mentor write" on papers for all using (public.current_role() in ('mentor', 'admin'));
create policy "topics: public read" on topics for select using (true);
create policy "topics: mentor write" on topics for all using (public.current_role() in ('mentor', 'admin'));
create policy "lessons: public read" on lessons for select using (true);
create policy "lessons: mentor write" on lessons for all using (public.current_role() in ('mentor', 'admin'));

-- attachments: free-preview lessons readable by anyone, others require active access
create policy "attachments: gated read" on attachments for select using (
  exists (
    select 1 from lessons l
    where l.id = attachments.lesson_id
      and (l.is_free_preview or public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin'))
  )
);
create policy "attachments: mentor write" on attachments for all using (public.current_role() in ('mentor', 'admin'));

-- live classes: scheduling info public; mentors manage
create policy "live_classes: public read" on live_classes for select using (true);
create policy "live_classes: mentor write" on live_classes for all using (public.current_role() in ('mentor', 'admin'));

-- attendance: student sees own rows; mentor/admin see all
create policy "attendance: owner read" on attendance for select using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));
create policy "attendance: owner insert" on attendance for insert with check (user_id = auth.uid());
create policy "attendance: owner update" on attendance for update using (user_id = auth.uid());

-- live chat / polls / raised hands: any authenticated user with access can read/write during class
create policy "chat: access read" on live_chat_messages for select using (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin'));
create policy "chat: access write" on live_chat_messages for insert with check (user_id = auth.uid() and (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin')));

create policy "polls: access read" on polls for select using (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin'));
create policy "polls: mentor write" on polls for all using (public.current_role() in ('mentor', 'admin'));

create policy "poll_votes: access read" on poll_votes for select using (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin'));
create policy "poll_votes: owner write" on poll_votes for insert with check (user_id = auth.uid());

create policy "raised_hands: access read" on raised_hands for select using (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin'));
create policy "raised_hands: owner write" on raised_hands for all using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));

-- quizzes/questions: public read metadata, gated by access at API layer for content; mentor writes
create policy "quizzes: public read" on quizzes for select using (true);
create policy "quizzes: mentor write" on quizzes for all using (public.current_role() in ('mentor', 'admin'));
create policy "questions: gated read" on questions for select using (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin'));
create policy "questions: mentor write" on questions for all using (public.current_role() in ('mentor', 'admin'));

-- attempts: owner only
create policy "attempts: owner rw" on attempts for all using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));

-- assignments: public read metadata, mentor writes
create policy "assignments: public read" on assignments for select using (true);
create policy "assignments: mentor write" on assignments for all using (public.current_role() in ('mentor', 'admin'));

-- submissions: owner + mentor/admin
create policy "submissions: owner read" on submissions for select using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));
create policy "submissions: owner insert" on submissions for insert with check (user_id = auth.uid());
create policy "submissions: owner update own" on submissions for update using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));

-- progress: owner only
create policy "progress: owner rw" on progress for all using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));

-- office hours: public read, mentor writes own
create policy "office_hours: public read" on office_hours for select using (true);
create policy "office_hours: mentor write own" on office_hours for all using (mentor_id = auth.uid() or public.current_role() = 'admin');

-- doubts: student sees own + public ones; mentor/admin see all
create policy "doubts: visible read" on doubts for select using (
  student_id = auth.uid() or visibility = 'public' or public.current_role() in ('mentor', 'admin')
);
create policy "doubts: owner insert" on doubts for insert with check (student_id = auth.uid());
create policy "doubts: mentor update" on doubts for update using (public.current_role() in ('mentor', 'admin') or student_id = auth.uid());

create policy "doubt_answers: visible read" on doubt_answers for select using (
  exists (
    select 1 from doubts d where d.id = doubt_answers.doubt_id
      and (d.student_id = auth.uid() or d.visibility = 'public' or public.current_role() in ('mentor', 'admin'))
  )
);
create policy "doubt_answers: mentor write" on doubt_answers for all using (public.current_role() in ('mentor', 'admin'));

-- payments: owner read, admin all; writes happen via service role from server
create policy "payments: owner read" on payments for select using (user_id = auth.uid() or public.current_role() in ('mentor', 'admin'));

-- notifications: owner only
create policy "notifications: owner rw" on notifications for all using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- STORAGE
-- ─────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('lesson-attachments', 'lesson-attachments', false)
on conflict (id) do nothing;

create policy "lesson-attachments: mentor upload"
  on storage.objects for insert
  with check (bucket_id = 'lesson-attachments' and public.current_role() in ('mentor', 'admin'));

create policy "lesson-attachments: mentor manage"
  on storage.objects for all
  using (bucket_id = 'lesson-attachments' and public.current_role() in ('mentor', 'admin'));

create policy "lesson-attachments: read with access"
  on storage.objects for select
  using (bucket_id = 'lesson-attachments' and (public.has_access(auth.uid()) or public.current_role() in ('mentor', 'admin')));
