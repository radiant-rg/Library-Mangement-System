create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  phone text,
  role text not null default 'member'
    check (role in ('admin', 'librarian', 'member')),
  status text not null default 'active'
    check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.books
  add column if not exists archived_at timestamptz;

alter table public.members
  add column if not exists auth_user_id uuid references auth.users (id) on delete set null,
  add column if not exists address text;

create unique index if not exists members_auth_user_id_unique
  on public.members (auth_user_id)
  where auth_user_id is not null;

create unique index if not exists members_email_unique
  on public.members (lower(email));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.books'::regclass
      and conname = 'books_inventory_nonnegative'
  ) then
    alter table public.books
      add constraint books_inventory_nonnegative
      check (
        total_copies >= 0
        and available_copies >= 0
        and available_copies <= total_copies
      ) not valid;
  end if;
end;
$$;

alter table public.books validate constraint books_inventory_nonnegative;

alter table public.loans
  add column if not exists issued_by uuid references public.user_profiles (id) on delete restrict;

alter table public.fines
  add column if not exists loan_id text references public.loans (id) on delete restrict,
  add column if not exists paid_amount numeric(10, 2) not null default 0,
  add column if not exists payment_date timestamptz;

create unique index if not exists fines_loan_id_unique
  on public.fines (loan_id)
  where loan_id is not null;

update public.fines
set paid_amount = amount
where lower(status) = 'paid'
  and paid_amount = 0;

create table if not exists public.fine_payments (
  id uuid primary key default gen_random_uuid(),
  fine_id text not null references public.fines (id) on delete restrict,
  amount numeric(10, 2) not null check (amount > 0),
  payment_method text not null default 'cash'
    check (payment_method in ('cash', 'upi', 'other')),
  recorded_by uuid not null references public.user_profiles (id) on delete restrict,
  paid_at timestamptz not null default now()
);

create index if not exists fine_payments_fine_idx
  on public.fine_payments (fine_id, paid_at);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.user_profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx
  on public.audit_log (created_at desc);

create index if not exists audit_log_actor_idx
  on public.audit_log (actor_id, created_at desc);

create index if not exists books_title_search
  on public.books using gin (to_tsvector('simple', title));

create index if not exists books_author_search
  on public.books using gin (to_tsvector('simple', author));

create index if not exists books_category_idx
  on public.books (category);

create index if not exists loans_member_status_idx
  on public.loans (member_id, status);

create index if not exists loans_due_date_idx
  on public.loans (due_date)
  where lower(status) <> 'returned';

create unique index if not exists one_active_loan_per_member_and_book
  on public.loans (member_id, book_id)
  where lower(status) <> 'returned';

create unique index if not exists one_open_reservation_per_member_and_book
  on public.reservations (member_id, book_id)
  where lower(status) in ('pending', 'ready');

create index if not exists reservations_queue_idx
  on public.reservations (book_id, reservation_date)
  where lower(status) = 'pending';

create index if not exists fines_member_status_idx
  on public.fines (member_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
before update on public.books
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Library member'
  );

  insert into public.user_profiles (id, full_name)
  values (new.id, v_name);

  update public.members
  set auth_user_id = new.id
  where auth_user_id is null
    and lower(email) = lower(new.email);

  if not found then
    insert into public.members (
      id, name, email, role, status, joined_date, created_at, auth_user_id
    )
    values (
      'MEM-' || gen_random_uuid()::text,
      v_name,
      lower(new.email),
      'Student',
      'Active',
      current_date,
      now(),
      new.id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.user_profiles (id, full_name)
select
  users.id,
  coalesce(
    nullif(btrim(users.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
    'Library member'
  )
from auth.users as users
on conflict (id) do nothing;

update public.members as members
set auth_user_id = users.id
from auth.users as users
where members.auth_user_id is null
  and lower(members.email) = lower(users.email);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.user_profiles as p
  where p.id = (select auth.uid())
    and p.status = 'active'
$$;

create or replace function public.current_member_id()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select m.id
  from public.members as m
  where m.auth_user_id = (select auth.uid())
    and lower(m.status) = 'active'
$$;

create or replace function public.is_library_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() in ('admin', 'librarian'), false)
$$;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'user_profiles', 'books', 'members', 'loans',
        'reservations', 'fines', 'fine_payments', 'audit_log'
      )
  loop
    execute format(
      'drop policy %I on %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end;
$$;

alter table public.user_profiles enable row level security;
alter table public.books enable row level security;
alter table public.members enable row level security;
alter table public.loans enable row level security;
alter table public.reservations enable row level security;
alter table public.fines enable row level security;
alter table public.fine_payments enable row level security;
alter table public.audit_log enable row level security;

create policy "Profiles are visible to their owner or admins"
  on public.user_profiles for select to authenticated
  using (id = (select auth.uid()) or public.current_user_role() = 'admin');

create policy "Books are visible to authenticated users"
  on public.books for select to authenticated
  using (true);

create policy "Staff can add books"
  on public.books for insert to authenticated
  with check (public.is_library_staff());

create policy "Staff can update books"
  on public.books for update to authenticated
  using (public.is_library_staff())
  with check (public.is_library_staff());

create policy "Staff can archive books"
  on public.books for delete to authenticated
  using (public.current_user_role() = 'admin');

create policy "Members are visible to their owner or staff"
  on public.members for select to authenticated
  using (
    auth_user_id = (select auth.uid())
    or public.is_library_staff()
  );

create policy "Staff can add members"
  on public.members for insert to authenticated
  with check (public.is_library_staff());

create policy "Staff can update members"
  on public.members for update to authenticated
  using (public.is_library_staff())
  with check (public.is_library_staff());

create policy "Admins can remove members"
  on public.members for delete to authenticated
  using (public.current_user_role() = 'admin');

create policy "Loans are visible to their member or staff"
  on public.loans for select to authenticated
  using (
    member_id = (select public.current_member_id())
    or public.is_library_staff()
  );

create policy "Reservations are visible to their member or staff"
  on public.reservations for select to authenticated
  using (
    member_id = (select public.current_member_id())
    or public.is_library_staff()
  );

create policy "Fines are visible to their member or staff"
  on public.fines for select to authenticated
  using (
    member_id = (select public.current_member_id())
    or public.is_library_staff()
  );

create policy "Fine payments are visible to their member or staff"
  on public.fine_payments for select to authenticated
  using (
    public.is_library_staff()
    or exists (
      select 1
      from public.fines
      where fines.id = fine_payments.fine_id
        and fines.member_id = (select public.current_member_id())
    )
  );

create policy "Audit log is visible to admins"
  on public.audit_log for select to authenticated
  using (public.current_user_role() = 'admin');

revoke all on public.user_profiles, public.books, public.members, public.loans,
  public.reservations, public.fines, public.fine_payments, public.audit_log
  from anon;

revoke all on public.user_profiles, public.books, public.members, public.loans,
  public.reservations, public.fines, public.fine_payments, public.audit_log
  from authenticated;

grant select on public.user_profiles, public.books, public.members, public.loans,
  public.reservations, public.fines, public.fine_payments, public.audit_log
  to authenticated;

grant insert on public.books to authenticated;
grant insert, update on public.members to authenticated;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.current_user_role() from public, anon;
revoke all on function public.current_member_id() from public, anon;
revoke all on function public.is_library_staff() from public, anon;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_member_id() to authenticated;
grant execute on function public.is_library_staff() to authenticated;
