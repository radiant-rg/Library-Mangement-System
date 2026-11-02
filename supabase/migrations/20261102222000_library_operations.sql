alter table public.books
  alter column id set default ('BK-' || gen_random_uuid()::text);

alter table public.loans
  alter column id set default ('LOAN-' || gen_random_uuid()::text);

alter table public.reservations
  alter column id set default ('RES-' || gen_random_uuid()::text);

alter table public.fines
  alter column id set default ('FN-' || gen_random_uuid()::text);

create or replace function public.issue_book(p_book_id text, p_member_id text, p_due_date date)
returns public.loans
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_loan public.loans;
begin
  if not public.is_library_staff() then
    raise exception 'Only library staff can issue books' using errcode = '42501';
  end if;

  if p_due_date < current_date then
    raise exception 'Due date cannot be in the past' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.members
    where id = p_member_id and lower(status) = 'active'
  ) then
    raise exception 'Member is not active' using errcode = '22023';
  end if;

  update public.books
  set available_copies = available_copies - 1
  where id = p_book_id
    and archived_at is null
    and available_copies > 0;

  if not found then
    raise exception 'Book is unavailable or archived' using errcode = '22023';
  end if;

  insert into public.loans (book_id, member_id, issued_by, issue_date, due_date, status)
  values (p_book_id, p_member_id, (select auth.uid()), current_date, p_due_date, 'Issued')
  returning * into v_loan;

  insert into public.audit_log (actor_id, action, entity_type, entity_id)
  values ((select auth.uid()), 'issue_book', 'loan', v_loan.id);

  return v_loan;
end;
$$;

create or replace function public.return_book(p_loan_id text)
returns public.loans
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_loan public.loans;
  v_days_overdue integer;
begin
  if not public.is_library_staff() then
    raise exception 'Only library staff can return books' using errcode = '42501';
  end if;

  update public.loans
  set status = 'Returned', return_date = current_date
  where id = p_loan_id and lower(status) <> 'returned'
  returning * into v_loan;

  if not found then
    raise exception 'Active loan not found' using errcode = '22023';
  end if;

  update public.books
  set available_copies = available_copies + 1
  where id = v_loan.book_id and available_copies < total_copies;

  if not found then
    raise exception 'Book availability is inconsistent' using errcode = '23514';
  end if;

  v_days_overdue := greatest(current_date - v_loan.due_date, 0);

  if v_days_overdue > 0 then
    insert into public.fines (
      id, loan_id, member_id, book_id, due_date, return_date,
      days_overdue, amount, paid_amount, status, created_at
    )
    values (
      'FN-' || gen_random_uuid()::text,
      v_loan.id,
      v_loan.member_id,
      v_loan.book_id,
      v_loan.due_date,
      current_date,
      v_days_overdue,
      v_days_overdue * 5.00,
      0,
      'Unpaid',
      now()
    );
  end if;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, details)
  values (
    (select auth.uid()),
    'return_book',
    'loan',
    v_loan.id,
    jsonb_build_object('days_overdue', v_days_overdue)
  );

  return v_loan;
end;
$$;

create or replace function public.update_book(
  p_book_id text,
  p_title text,
  p_author text,
  p_category text,
  p_isbn text,
  p_shelf text,
  p_total_copies integer
)
returns public.books
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_book public.books;
  v_active_loans integer;
begin
  if not public.is_library_staff() then
    raise exception 'Only library staff can update books' using errcode = '42501';
  end if;

  select * into v_book
  from public.books
  where id = p_book_id and archived_at is null
  for update;

  if not found then
    raise exception 'Book not found' using errcode = '22023';
  end if;

  if p_total_copies < 0
    or p_total_copies < 1
    or nullif(btrim(p_title), '') is null
    or nullif(btrim(p_author), '') is null
    or nullif(btrim(p_category), '') is null then
    raise exception 'Book details are invalid' using errcode = '22023';
  end if;

  select count(*)::integer into v_active_loans
  from public.loans
  where book_id = p_book_id and lower(status) <> 'returned';

  if p_total_copies < v_active_loans then
    raise exception 'Total copies cannot be less than active loans' using errcode = '22023';
  end if;

  update public.books
  set title = btrim(p_title),
      author = btrim(p_author),
      category = btrim(p_category),
      isbn = nullif(btrim(p_isbn), ''),
      shelf = nullif(btrim(p_shelf), ''),
      total_copies = p_total_copies,
      available_copies = p_total_copies - v_active_loans
  where id = p_book_id
  returning * into v_book;

  insert into public.audit_log (actor_id, action, entity_type, entity_id)
  values ((select auth.uid()), 'update_book', 'book', v_book.id);

  return v_book;
end;
$$;

create or replace function public.archive_book(p_book_id text)
returns public.books
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_book public.books;
begin
  if not public.is_library_staff() then
    raise exception 'Only library staff can archive books' using errcode = '42501';
  end if;

  update public.books
  set archived_at = now()
  where id = p_book_id and archived_at is null
  returning * into v_book;

  if not found then
    raise exception 'Book not found' using errcode = '22023';
  end if;

  insert into public.audit_log (actor_id, action, entity_type, entity_id)
  values ((select auth.uid()), 'archive_book', 'book', v_book.id);

  return v_book;
end;
$$;

create or replace function public.reserve_book(p_book_id text)
returns public.reservations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_id text;
  v_reservation public.reservations;
begin
  if public.current_user_role() <> 'member' then
    raise exception 'Only members can reserve books' using errcode = '42501';
  end if;

  v_member_id := public.current_member_id();
  if v_member_id is null then
    raise exception 'Active member profile not found' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.books
    where id = p_book_id and archived_at is null and available_copies = 0
  ) then
    raise exception 'Reservations are only available for out-of-stock books'
      using errcode = '22023';
  end if;

  insert into public.reservations (member_id, book_id, reservation_date, status)
  values (v_member_id, p_book_id, current_date, 'Pending')
  returning * into v_reservation;

  insert into public.audit_log (actor_id, action, entity_type, entity_id)
  values ((select auth.uid()), 'reserve_book', 'reservation', v_reservation.id);

  return v_reservation;
end;
$$;

create or replace function public.cancel_reservation(p_reservation_id text)
returns public.reservations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reservation public.reservations;
begin
  update public.reservations
  set status = 'Cancelled'
  where id = p_reservation_id
    and lower(status) = 'pending'
    and (
      public.is_library_staff()
      or member_id = public.current_member_id()
    )
  returning * into v_reservation;

  if not found then
    raise exception 'Pending reservation not found' using errcode = '22023';
  end if;

  insert into public.audit_log (actor_id, action, entity_type, entity_id)
  values ((select auth.uid()), 'cancel_reservation', 'reservation', v_reservation.id);

  return v_reservation;
end;
$$;

create or replace function public.record_fine_payment(
  p_fine_id text,
  p_amount numeric,
  p_payment_method text default 'cash'
)
returns public.fines
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_fine public.fines;
begin
  if not public.is_library_staff() then
    raise exception 'Only library staff can record payments' using errcode = '42501';
  end if;

  if p_amount <= 0 or p_payment_method not in ('cash', 'upi', 'other') then
    raise exception 'Invalid payment details' using errcode = '22023';
  end if;

  select * into v_fine
  from public.fines
  where id = p_fine_id
  for update;

  if not found then
    raise exception 'Fine not found' using errcode = '22023';
  end if;

  if p_amount > v_fine.amount - v_fine.paid_amount then
    raise exception 'Payment exceeds the outstanding balance' using errcode = '22023';
  end if;

  insert into public.fine_payments (fine_id, amount, payment_method, recorded_by)
  values (v_fine.id, p_amount, p_payment_method, (select auth.uid()));

  update public.fines
  set paid_amount = paid_amount + p_amount,
      status = case
        when paid_amount + p_amount = amount then 'Paid'
        else 'Partial'
      end,
      payment_date = case
        when paid_amount + p_amount = amount then now()
        else payment_date
      end
  where id = v_fine.id
  returning * into v_fine;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, details)
  values (
    (select auth.uid()),
    'record_fine_payment',
    'fine',
    v_fine.id,
    jsonb_build_object('amount', p_amount, 'payment_method', p_payment_method)
  );

  return v_fine;
end;
$$;

revoke all on function public.issue_book(text, text, date) from public, anon;
revoke all on function public.return_book(text) from public, anon;
revoke all on function public.update_book(text, text, text, text, text, text, integer) from public, anon;
revoke all on function public.archive_book(text) from public, anon;
revoke all on function public.reserve_book(text) from public, anon;
revoke all on function public.cancel_reservation(text) from public, anon;
revoke all on function public.record_fine_payment(text, numeric, text) from public, anon;

grant execute on function public.issue_book(text, text, date) to authenticated;
grant execute on function public.return_book(text) to authenticated;
grant execute on function public.update_book(text, text, text, text, text, text, integer) to authenticated;
grant execute on function public.archive_book(text) to authenticated;
grant execute on function public.reserve_book(text) to authenticated;
grant execute on function public.cancel_reservation(text) to authenticated;
grant execute on function public.record_fine_payment(text, numeric, text) to authenticated;
