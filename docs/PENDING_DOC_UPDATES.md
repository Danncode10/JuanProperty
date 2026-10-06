<!-- Ledger cleared after verified task P0.5. Log new pending documentation updates here when implementation begins. -->

## P0.6 — Public-site quality, dashboard access, and blog image cleanup

- Document the shared `/dashboard` active-profile gate and the `admin` boundary for blog-editor routes and blog mutation server actions. Explain that the generated database role enum supports `admin` and `user`, so the dashboard role configuration must not rely on an unpersistable `super_admin` value for Blog access. Normal blog reads/writes remain session-scoped under organization-owner RLS.
- Document that destructive blog-image cleanup is disabled because uploads use a flat shared `blog-images` bucket without organization ownership metadata. A future cleanup action requires organization-scoped storage paths/policies or a genuine platform-admin role; post deletion intentionally leaves image files untouched until that boundary exists.
- Update product/launch copy documentation to match the Phase 1 roadmap (owners, properties, units, tenants, leases, rent, payments, and maintenance), explicitly mark those modules as planned/in development, and note that land titles, parcel mapping, and BIR are deferred. Pricing/trial terms are not set.
- Record public-page privacy and SEO decisions: remove profile/repository dashboard data from the public landing page, use route-specific canonical URLs for blog index and posts, and preserve `noindex` on dashboard routes.
- Verification guide: `docs/tests/p0.6-public-quality-and-access.md`.
