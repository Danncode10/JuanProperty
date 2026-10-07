-- The original schema granted this helper to anon explicitly. PUBLIC revocation
-- does not remove a role-specific grant, so revoke it separately.
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
