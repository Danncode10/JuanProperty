CREATE TABLE public.property_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('individual', 'company')),
  name TEXT NOT NULL CHECK (length(btrim(name)) > 0),
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  description TEXT,
  notes TEXT,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX property_owners_organization_archive_name_idx
  ON public.property_owners (organization_id, archived_at, name);

ALTER TABLE public.property_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization owners can read property owners"
  ON public.property_owners
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_owners.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organization owners can create property owners"
  ON public.property_owners
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_owners.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organization owners can update property owners"
  ON public.property_owners
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_owners.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_owners.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

GRANT SELECT, INSERT, UPDATE ON TABLE public.property_owners TO authenticated;

CREATE TRIGGER update_property_owners_updated_at
  BEFORE UPDATE ON public.property_owners
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
