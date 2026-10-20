ALTER TABLE public.properties
  ADD CONSTRAINT properties_id_organization_id_unique
  UNIQUE (id, organization_id);

CREATE TABLE public.property_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  property_id UUID NOT NULL,
  unit_number TEXT NOT NULL
    CHECK (length(btrim(unit_number)) BETWEEN 1 AND 80),
  floor INTEGER,
  bedrooms INTEGER
    CHECK (bedrooms IS NULL OR bedrooms BETWEEN 0 AND 100),
  bathrooms NUMERIC(4, 1)
    CHECK (bathrooms IS NULL OR bathrooms BETWEEN 0 AND 100),
  default_rent_php NUMERIC(12, 2) NOT NULL DEFAULT 0
    CHECK (default_rent_php >= 0),
  description TEXT,
  operational_status TEXT NOT NULL DEFAULT 'active'
    CHECK (operational_status IN ('active', 'maintenance', 'inactive')),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT property_units_property_org_fkey
    FOREIGN KEY (property_id, organization_id)
    REFERENCES public.properties(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT property_units_description_length_check
    CHECK (description IS NULL OR length(description) <= 2000)
);

CREATE UNIQUE INDEX property_units_property_unit_number_key
  ON public.property_units (property_id, lower(btrim(unit_number)));

CREATE INDEX property_units_organization_property_archive_idx
  ON public.property_units (organization_id, property_id, archived_at);

ALTER TABLE public.property_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization owners can read property units"
  ON public.property_units
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_units.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organization owners can create property units"
  ON public.property_units
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_units.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organization owners can update property units"
  ON public.property_units
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_units.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations AS organization
      WHERE organization.id = property_units.organization_id
        AND organization.owner_id = (SELECT auth.uid())
    )
  );

REVOKE ALL ON TABLE public.property_units
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE
  ON TABLE public.property_units
  TO authenticated;

CREATE TRIGGER update_property_units_updated_at
  BEFORE UPDATE ON public.property_units
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
