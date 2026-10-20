REVOKE ALL ON TABLE public.properties, public.property_owners
  FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE
  ON TABLE public.properties, public.property_owners
  TO authenticated;
