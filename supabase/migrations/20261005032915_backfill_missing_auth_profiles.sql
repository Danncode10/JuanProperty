-- Backfill the application profile required by dashboard authorization for
-- Supabase Auth users that existed before profile provisioning was applied.
-- The primary-key conflict guard keeps this safe to rerun.
INSERT INTO public.profiles (id, email, full_name)
SELECT
  auth_user.id,
  auth_user.email,
  NULLIF(
    BTRIM(
      COALESCE(
        auth_user.raw_user_meta_data ->> 'full_name',
        auth_user.raw_user_meta_data ->> 'name',
        ''
      )
    ),
    ''
  )
FROM auth.users AS auth_user
WHERE NOT EXISTS (
  SELECT 1
  FROM public.profiles AS profile
  WHERE profile.id = auth_user.id
)
ON CONFLICT (id) DO NOTHING;
