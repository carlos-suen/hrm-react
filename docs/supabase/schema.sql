-- ============================================
-- Attendance
-- ============================================
create table if not exists public.attendance (
  id serial primary key,
  name text not null,
  email text not null,
  record_date date not null,
  clock_in time,
  clock_out time,
  status text not null check (status in ('Normal', 'Late', 'Absent', 'EarlyLeave')),
  hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.attendance enable row level security;

create policy "Enable all for authenticated" on public.attendance
  for all to authenticated using (true) with check (true);


-- ============================================
-- Payroll
-- ============================================
create table if not exists public.payroll (
  id serial primary key,
  name text not null,
  bsalary double precision not null,
  bonus double precision not null default 0,
  deduction double precision not null default 0,
  asalary double precision not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payroll enable row level security;

create policy "Enable all for authenticated" on public.payroll
  for all to authenticated using (true) with check (true);


-- ============================================
-- Recruitment
-- ============================================
create table if not exists public.recruitment (
  id serial primary key,
  title text not null,
  department text not null,
  location text not null,
  salary_min text not null,
  salary_max text not null,
  applicant_count int not null default 0,
  type text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recruitment enable row level security;

create policy "Enable all for authenticated" on public.recruitment
  for all to authenticated using (true) with check (true);


-- ============================================
-- Training
-- ============================================
create table if not exists public.training (
  id serial primary key,
  title text not null,
  type text not null,
  start_time text not null,
  end_time text not null,
  location text not null,
  max_people int not null default 0,
  current_join int not null default 0,
  status text not null,
  instructor text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.training enable row level security;

create policy "Enable all for authenticated" on public.training
  for all to authenticated using (true) with check (true);
