# Project Context — JuanProperty

> This file is read by agents, skills, and commands before they act on JuanProperty.
> Project-specific direction here supplements `AGENTS.md` and `CLAUDE.md` without replacing protected DannFlow/JuanStack conventions.

---

## What this app is

**App name:** JuanProperty

**One-liner:** JuanProperty is a Real Estate Property Management SaaS designed to help landlords, Property Managers, and small real estate businesses manage properties, property units, Property Owners, tenants, leases, rent obligations, payments, maintenance operations, and portfolio visibility in one centralized platform.

**The problem it solves:** Property-management records are commonly fragmented across spreadsheets, messages, paper files, and disconnected payment tracking. JuanProperty centralizes operational history and recurring work while preserving reliable lease and financial records.

---

## Target audience

**Primary users:**

- Property Managers
- administrative and office staff
- landlords managing rental portfolios

Secondary users may be introduced in later phases. Tenant and Property Owner portals are not active Phase 1 functionality.

**What they care most about:** Clear portfolio status, dependable leasing and rent records, fast access to operational work, and accurate historical information.

**Primary operating environments:** Responsive, field-friendly mobile use and efficient desktop workflows for administrative work.

**Domain roles:**

- Property Manager is the JuanStack provider.
- Tenant is the consumer.
- Lease is the transaction.
- Property Unit is the inventory item.
- Property Owner is a separate ownership entity and must not replace Property Manager as the provider.

---

## Active product phase

### Phase 1 — Core Property Management, Leasing & Rent Operations

Phase 1 establishes:

1. Property Owner Registry
2. Property Management
3. Property Unit Management
4. Tenant Registry
5. Lease Lifecycle
6. Rent Obligations
7. Payment Recording
8. Maintenance Requests
9. Real Estate Operational Dashboard

The core relationship model is:

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

A Tenant is never permanently assigned directly to a Property Unit. Occupancy is represented through the Lease domain.

---

## Phase 1 business decisions

- One primary owner per property is sufficient for MVP; one owner may own multiple properties.
- Owners may represent individuals or companies.
- Co-ownership percentages are deferred.
- Important business records are archived instead of destructively deleted.
- Upcoming and Active leases cannot overlap for the same unit.
- Draft leases cannot activate when they conflict with an Upcoming or Active lease.
- Lease statuses are Draft, Upcoming, Active, Expired, and Terminated.
- Early termination requires an effective termination date.
- Historical leases and payments remain preserved.
- Active leases normally determine unit occupancy.
- Rent Obligations belong to Leases and preserve their original PHP amount.
- Phase 1 supports monthly rent only, with due days limited to 1–28.
- Automatic proration is outside Phase 1.
- Multiple partial payments may be recorded against one obligation.
- Overpayments, payment credits, and online payment gateways are outside Phase 1.
- Payment corrections preserve the original record through a void/reversal and replacement approach.
- Maintenance Requests may relate to a Property or Property Unit.
- Phase 1 dashboard reporting is operational only; advanced analytics is deferred.

---

## Platform capabilities and protected ownership boundaries

AI Secretary, Scheduling, and BIR compliance remain part of the final JuanProperty product.

The team leader owns AI Secretary, Scheduling, and BIR. Phase 1 Real Estate work must not modify their code, migrations, personas, tools, configuration logic, or behavior.

Real Estate modules may expose stable, organization-scoped, read-only domain data for later consumption by those systems, including lease start/end/status, rent-obligation due dates and outstanding balances, payment information, maintenance priority/status, and property-unit vacancy information.

Real Estate services must not:

- create AI Secretary tasks
- create scheduling or calendar events
- calculate BIR taxes
- send tenant communications
- perform autonomous actions

Generic DannFlow/JuanStack infrastructure, generic authentication, agents, skills, hooks, and framework conventions are also protected.

---

## Open vertical identity decision

The repository currently uses `vertical_id: property` and protected namespace paths under `src/bir/property/`, `src/analytics/property/`, and `src/ai/personas/property.ai-manifest.json`.

The revised product model uses the conceptual label `real_estate`. This discrepancy is intentionally unresolved. Do not change `vertical_id`, `business.json`, or protected namespace paths without explicit architectural approval. Until resolved, implementation must respect the current configured namespace while treating this Phase 1 product model as the roadmap authority.

---

## Design decisions

- Mobile-first from 375px with no horizontal scrolling.
- Minimum 48px interactive application controls.
- High contrast for field use and efficient information density for desktop office work.
- Shadcn/UI primitives and Tailwind semantic tokens only.
- Labels appear above inputs with visible focus and error states.
- Prioritize access to properties, units, tenants, leases, payments, maintenance, operational alerts, and compliance information.
- Preserve the existing approved JuanProperty visual system unless a separately tracked design task changes it.

---

## Deferred product direction

The previous land-registry direction remains valid future work but is not active Phase 1 scope:

- land title management
- parcel management
- GPS/geospatial coordinates and boundary mapping
- advanced property documents
- brokers and buyers
- property marketplace
- sales pipeline and sales transactions

These capabilities are preserved as future placeholder phases in `MASTERPLAN.md` and must not be implemented or fully expanded during Phase 1.

---

## Other V1 exclusions

- No short-term rental or channel manager.
- No native mobile app.
- No autonomous tenant notices.
- No online payment gateway.
- No full accounting suite.
- No tenant portal or owner portal.
- No advanced CRM.
- No predictive AI beyond team-leader-approved operational monitoring.

---

## Current focus

Obtain human approval for the realigned Phase 1 plan, reconcile GitHub Project tracking, resolve the vertical identity and organization-membership decisions, then begin `[P1.1] Property Owner Registry` through the tracked DannFlow task workflow.

---

_Last updated: 2026-09-14 — Phase 1 property-management realignment_
