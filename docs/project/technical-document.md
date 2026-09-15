# Technical Document — JuanProperty

**Project Name:** JuanProperty (Built on DannFlow)
**Configured Vertical:** `property`
**Active Product Direction:** Core Real Estate Property Management
**Date:** 2026-09-14
**Status:** Phase 1 Planning Baseline

---

## 1. Architecture

JuanProperty follows DannFlow's existing architecture:

- `src/app/` and `src/components/` provide the presentation layer.
- All business logic and Supabase access live in `src/services/`.
- Database types are generated into `src/types/supabase.ts` and are never edited manually.
- Database changes use reviewed SQL in `supabase/migrations/` with RLS enabled on every domain table.
- Every Phase 1 record is isolated by the existing organization/multi-tenant model.
- Server Components are the default; client components are limited to actual interactive requirements.

This document defines planned boundaries only. Phase 1 tables, services, and routes are created by their individual approved Masterplan tasks.

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
