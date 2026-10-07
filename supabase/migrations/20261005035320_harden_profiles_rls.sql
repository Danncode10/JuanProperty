-- Remove the template-wide profile read policy. Profile rows contain account
-- metadata and must only be visible to their owner or an active administrator.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone."
ON public.profiles;

DROP POLICY IF EXISTS "Users can view own profile"
ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile."
ON public.profiles;

CREATE POLICY "Users can update own profile."
ON public.profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Admins can view all profiles"
ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can update all profiles"
ON public.profiles;

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
