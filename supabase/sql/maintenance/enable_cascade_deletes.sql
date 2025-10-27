-- Enable cascading deletes so Auth user removal also deletes related rows
-- Safe to run multiple times

-- 1) Cascade from bookings -> users
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 2) Cascade from users -> auth.users
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Notes:
-- - After this, deleting a user from Authentication -> Users will automatically
--   remove that row from public.users and any related public.bookings rows.
-- - Execute once and your future deletions via Dashboard will no longer error.
