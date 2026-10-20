ALTER TABLE public.property_owners
  ADD CONSTRAINT property_owners_id_organization_id_unique
  UNIQUE (id, organization_id);

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  primary_owner_id UUID NOT NULL,
  name TEXT NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  property_type TEXT NOT NULL CHECK (length(btrim(property_type)) BETWEEN 1 AND 80),
  address TEXT NOT NULL CHECK (length(btrim(address)) BETWEEN 1 AND 500),
  description TEXT,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT properties_primary_owner_org_fkey
    FOREIGN KEY (primary_owner_id, organization_id)
    REFERENCES public.property_owners(id, organization_id)
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT properties_description_length_check
    CHECK (description IS NULL OR length(description) <= 2000)
);

CREATE INDEX properties_organization_archive_name_idx
  ON public.properties (organization_id, archived_at, name);

CREATE INDEX properties_primary_owner_org_idx
  ON public.properties (primary_owner_id, organization_id);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization owners can read properties"
  ON public.properties
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = properties.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organization owners can create properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = properties.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organization owners can update properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = properties.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = properties.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

REVOKE ALL ON TABLE public.properties FROM anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.properties TO authenticated;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
