# Technical Document — JuanProperty

**Project Name:** JuanProperty (Built on DannFlow)
**Configured Vertical:** `property`
**Active Product Direction:** Core Real Estate Property Management
**Date:** 2026-10-20
**Status:** Phase 1 in progress — `[P1.1]`, `[P1.2]`, and `[P1.3]` implemented; P1.2/P1.3 automated verification passed, hands-on checks deferred by user

---

## 1. Architecture

JuanProperty follows DannFlow's existing architecture:

- `src/app/` and `src/components/` provide the presentation layer.
- All business logic and Supabase access live in `src/services/`.
- Database types are generated into `src/types/supabase.ts` and are never edited manually.
- Database changes use reviewed SQL in `supabase/migrations/` with RLS enabled on every domain table.
- Every Phase 1 record is isolated by the existing organization/multi-tenant model.
- Server Components are the default; client components are limited to actual interactive requirements.

The Phase 1 domain is implemented incrementally by approved Masterplan tasks. The current implementation status is recorded below; later entities remain planned until their task is complete.

### Implemented: `[P1.1]` Property Owner Registry

- `public.property_owners` stores an organization-scoped owner with `owner_type` (`individual` or `company`), required `name`, and optional contact person, email, phone, address, description, and notes. It also stores `archived_at`, `created_at`, and `updated_at`.
- `organization_id` references `organizations.id` and is indexed. The `updated_at` trigger uses the existing `public.handle_updated_at()` function.
- RLS is enabled. Authenticated SELECT, INSERT, and UPDATE policies authorize rows only when the signed-in user owns the referenced organization (`organizations.owner_id = auth.uid()`). There is intentionally no DELETE policy; archive/restore updates `archived_at` so records remain recoverable.
- The `anon` role has no table privileges. Authenticated GraphQL schema discovery remains enabled; discovery is not row authorization, which is enforced by RLS.
- `src/services/property-owners.ts` derives the organization from the authenticated session and scopes all owner queries to that organization. Callers cannot supply an organization ID. The service is the only database access layer for this feature.
- Current access limitation: organization membership/staff authorization is not implemented by `[P1.1]`; the supported access path is the existing organization-owner model. Do not imply all staff or admins can access these rows until a membership/RBAC task adds and verifies that policy.

### Implemented: `[P1.2]` Property Management

- `public.properties` stores `organization_id`, `primary_owner_id`, required `name`, `property_type`, and `address`, optional `description`, `archived_at`, `created_at`, and `updated_at`.
- `properties_primary_owner_org_fkey` references the composite key `(property_owners.id, property_owners.organization_id)`, so the database rejects a property linked to an owner from another organization. One owner may be linked to multiple properties. Organization/archive/name and owner/organization indexes support the dashboard queries.
- RLS SELECT/INSERT/UPDATE policies authorize only the authenticated owner of the referenced organization. No DELETE policy exists. Migration `20261019142000_restrict_property_table_privileges.sql` also restricts both `properties` and `property_owners` to authenticated SELECT/INSERT/UPDATE privileges; `anon` has no table privileges, and authenticated users cannot DELETE or TRUNCATE these tables.
- `src/services/properties.ts` derives the organization from the authenticated session, filters property reads and writes by that organization, and checks that the primary owner belongs to it. New properties require an active owner. An edit may retain its existing archived owner, but cannot switch to a different archived owner.
- The dashboard supports create, edit, search, archive, and restore. Team Members do not see Property Owners or Properties because the supported database access model is organization-owner-only. Organization staff membership is not implemented.
- Units, land titles, advanced documents, parcel geometry, and GPS are outside `[P1.2]`.

### Implemented: `[P1.3]` Property Unit Management

- `public.property_units` stores `organization_id`, `property_id`, unique-per-property `unit_number`, optional `floor`, `bedrooms`, `bathrooms`, optional `description`, `default_rent_php`, `operational_status`, archive timestamp, and audit timestamps. A composite foreign key ties the unit to a property in the same organization; property deletion is restricted while units exist.
- The unique index on `(property_id, lower(btrim(unit_number)))` prevents duplicate unit identity within a property, regardless of case, whitespace, or archive state.
- RLS SELECT/INSERT/UPDATE policies require ownership of the unit's organization. `anon` has no table access; authenticated users cannot DELETE or TRUNCATE units. There is no DELETE policy.
- `src/services/property-units.ts` derives organization context from the signed-in owner, limits reads/writes to that organization, requires active properties for new units, and keeps a unit attached to its original property during edits.
- Operational states are `active`, `maintenance`, and `inactive`. There is deliberately no `tenant_id` or occupied state; occupancy belongs to the Lease domain. `default_rent_php` is a current default only; future lease creation must copy its agreed rent into the lease so subsequent unit-default edits do not rewrite history.
- The dashboard supports create/edit, search, archive/restore, and filtering archived units. Unit identity cannot be moved to another property after creation.

---

## 2. Planned Phase 1 Domain

```text
Organization
→ Property Owner
→ Property
→ Property Unit

Tenant
→ Lease
→ Property Unit

Lease
→ Rent Obligation
→ Payment

Property / Property Unit
→ Maintenance Request
```

Planned domain entities are Property Owner, Property, Property Unit, Tenant, Lease, Rent Obligation, Payment, and Maintenance Request. Generic starter tables such as `leads`, `services`, and `bookings` are not substitutes for these entities.

---

## 3. Data and Integrity Direction

- Domain rows must carry or safely derive organization ownership and enforce it through RLS.
- A Unit does not store a permanent Tenant relationship; occupancy comes from qualifying Leases.
- Upcoming and Active Leases cannot overlap for the same Unit.
- Historical Leases and posted financial records remain preserved.
- Important operational records use archive state rather than destructive deletion.
- Rent Obligations snapshot their PHP amount and monthly period.
- Multiple positive Payments may be applied to one Rent Obligation, up to its outstanding balance.
- Payment corrections use auditable void/reversal and replacement behavior.
- Maintenance Requests reference a Property and may additionally reference one of that Property's Units.

Exact SQL constraints, status representation, and service transactions must be defined and tested in the corresponding `[P1.x]` task.

---

## 4. Planned Service Boundaries

Phase 1 is expected to introduce independent Real Estate services for:

- Property Owners
- Properties
- Property Units
- Tenants
- Leases
- Rent Obligations
- Payments
- Maintenance Requests
- Operational dashboard read models

UI components and route handlers call these services and do not query Supabase directly.

---

## 5. Protected Modules

AI Secretary, Scheduling, and BIR are team-leader-owned. Phase 1 Real Estate work must not change their code, migrations, personas, tools, configuration logic, or behavior.

Real Estate modules may later expose stable, organization-scoped data such as lease status and dates, obligation due dates and balances, payment facts, maintenance priority/status, and derived Unit vacancy. They do not create AI tasks or calendar events, calculate tax, send tenant communications, or perform autonomous actions.

Generic authentication, organization infrastructure, agents, skills, hooks, and framework conventions remain protected.

---

## 6. Open Architecture Decisions

- `business.json` currently uses `vertical_id: property`; the conceptual `real_estate` label is not a namespace change approval.
- The organization membership/RBAC mechanism for administrative staff must be confirmed before Real Estate RLS design is finalized.
- Payment table naming and read contracts must be coordinated with the team leader without modifying protected AI configuration during Phase 1 planning.

---

## 7. Deferred Technical Direction

Land titles, parcel records, advanced documents, GPS/geospatial data, parcel geometry, broker/buyer workflows, sales operations, and marketplace functionality remain deferred future work. No Phase 1 schema or service should preemptively implement those capabilities.

## 8. Public Site, Dashboard Access, and Blog Boundaries

- Public product copy describes the Phase 1 roadmap—owners, properties, units, tenants, leases, rent obligations, payments, maintenance, and operational visibility—as planned/in development. It must not imply that deferred land-title, parcel-mapping, or BIR functionality is available. Pricing and trial terms remain unset.
- Public landing-page feature content must not expose profile names, email addresses, roles, or creator/repository inventory. Dashboard routes remain `noindex`; blog index and post pages use route-specific canonical URLs.
- The `/dashboard` layout requires an authenticated user with an active profile. Blog editor pages and mutation actions require the persisted `admin` role. The generated database role enum is `admin | user`; do not configure Blog access with an unpersistable `super_admin` value. Private blog reads and writes use the session-scoped client and organization-owner RLS.
- Blog images are stored in a flat shared bucket without organization ownership metadata. Destructive image cleanup remains disabled, and deleting a post intentionally leaves its uploaded image objects untouched until storage paths and policies support safe ownership-scoped cleanup.
