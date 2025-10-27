-- Delete test users by email safely (bookings -> users -> auth.users)
-- HOW TO USE:
-- 1) Replace the emails inside the IN (...) list below
-- 2) Run the script in Supabase SQL Editor
-- 3) If step 3 (auth.users) fails due to permissions, delete those users via
--    Authentication -> Users in the Dashboard (should succeed after steps 1 & 2),
--    or run this script using the SQL editor with service role privileges.

-- >>> Replace these emails <<<
WITH target AS (
  SELECT id FROM public.users
  WHERE email IN (
    'user1@example.com',
    'user2@example.com'
  )
)
-- Delete dependent rows first
DELETE FROM public.bookings
WHERE user_id IN (SELECT id FROM target);

-- Then delete from app's users table
DELETE FROM public.users
WHERE id IN (SELECT id FROM target);

-- Finally, delete from Supabase Auth (auth.users)
-- If you cannot run this part, use the Dashboard after running the two deletes above.
DELETE FROM auth.users
WHERE id IN (SELECT id FROM target);
