with table_counts as (
  select 'books' as table_name, count(*) as row_count from public.books
  union all
  select 'members', count(*) from public.members
  union all
  select 'loans', count(*) from public.loans
  union all
  select 'reservations', count(*) from public.reservations
  union all
  select 'fines', count(*) from public.fines
)
select
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  coalesce(table_counts.row_count, 0) as table_rows
from information_schema.columns as c
left join table_counts using (table_name)
where c.table_schema = 'public'
  and c.table_name in (
    'books',
    'members',
    'loans',
    'reservations',
    'fines'
  )
order by c.table_name, c.ordinal_position;
