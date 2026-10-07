-- An authenticated user may edit personal profile fields, but role and account
-- activation are administrative controls managed through the service-role
-- team service. Column privileges prevent direct API self-promotion.
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;

GRANT UPDATE (full_name, age, birthday, gender)
ON TABLE public.profiles
TO authenticated;

-- Administrative RLS access requires both the admin role and an active account.
-- An empty search path also prevents object shadowing in this definer function.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
      AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
