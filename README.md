# LibraCore

A library management system built on the existing HTML, CSS, and vanilla JavaScript frontend.

## Architecture

- **Frontend:** static site hosted on the existing Vercel deployment.
- **Database and authentication:** Supabase Postgres and Supabase Auth.
- **Authorization:** Postgres row-level security and role-checked SQL functions.
- **Backend hosting:** no separate server; database transactions and access rules run in Postgres.

The browser uses only the Supabase project URL and publishable key in `supabase/config.js`. Publishable keys are intended for browser use; database access must remain protected by the migrations' row-level security policies. Never put a `service_role` key, database password, or other secret in this repository.

The free Supabase tier currently has limited database/storage quotas and may pause projects after a week of inactivity. It is suitable for a small project, but does not guarantee always-on production availability. Vercel Hobby is free for eligible personal projects; check its current usage terms before using it for an organization.

## Supabase setup

1. Create a Supabase project on the Free plan.
2. Set the project URL and **publishable** key in `supabase/config.js`.
3. In the Supabase SQL Editor, run the migration files in `supabase/migrations` in filename order. These migrations extend the existing text-ID schema without dropping or renaming its tables. The current schema inspection reported zero rows in all five legacy tables.
4. In **Authentication → URL Configuration**, set the Site URL to the deployed site and add the local development origin to the redirect URL allow list. Password reset and email confirmation redirect to the current site origin.
5. Start the site over HTTP (for example, with VS Code Live Server). Opening `index.html` directly with `file://` does not provide a valid authentication redirect origin.
6. Create an account from the login page and confirm the email if confirmation is enabled. The migration links a signup to an existing member by email or creates a member record for a new address.
7. To designate the first administrator or a librarian, run this in the SQL Editor after signup, replacing the email and role:

   ```sql
   update public.user_profiles
   set role = 'admin' -- use 'librarian' for library staff
   where id = (
     select id
     from auth.users
     where lower(email) = lower('your-email@example.com')
   );
   ```

New accounts default to the `member` role. Roles must be assigned in the database; the browser cannot promote an account.

The schema inspection query at `supabase/inspect_legacy_schema.sql` is read-only and can be used to review the old table columns and record counts.

## Local development

Use VS Code Live Server or another static HTTP server from the repository root. No frontend build step or npm install is required. The Supabase project must be configured and its migrations applied for login and library data to work.

## Current behavior

- Supabase Auth provides email/password signup, sign-in, sign-out, and password reset.
- The database stores books, member records, loans, reservations, fines, payments, and audit events.
- Loan issue/return and fine-payment operations run as database functions; inventory updates are transactional.
- Fine payments are recorded manually (cash, UPI, or other); the application does not process or charge payments.
- Dashboard and report values are computed from records visible to the signed-in user.
