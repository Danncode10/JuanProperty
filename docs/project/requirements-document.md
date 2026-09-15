# Requirements Document — JuanProperty

**Project Name:** JuanProperty (Built on DannFlow)  
**Configured Vertical:** `property`
**Active Product Direction:** Core Real Estate Property Management
**Date:** 2026-09-14
**Status:** Phase 1 Planning Baseline

---

## 1. Product Goal

JuanProperty enables Property Managers and administrative teams to operate a rental-property portfolio from one organization-scoped system. Phase 1 focuses on owners, properties, units, tenants, leases, recurring rent obligations, recorded payments, maintenance requests, and essential operational visibility.

Property Owner is a separate ownership entity. It does not replace Property Manager as the JuanStack provider.

---

## 2. Phase 1 Users

| User                        | Phase 1 responsibility                                                                  |
| :-------------------------- | :-------------------------------------------------------------------------------------- |
| Property Manager            | Oversees owners, properties, units, tenants, leases, rent, payments, and maintenance    |
| Administrative/office staff | Maintains operational records and follows up work within authorized organization access |
| Property Owner              | Represented as a managed ownership record; an owner portal is outside Phase 1           |
| Tenant                      | Represented as a managed tenancy record; a tenant portal is outside Phase 1             |

---

## 3. Core Domain Requirements

### 3.1 Property Owner Registry

- Owners may be individuals or companies.
- One owner may own multiple properties.
- One primary owner per property is sufficient for Phase 1.
- Owners are organization-scoped and archived instead of destructively deleted.
- Co-ownership percentages are deferred.

### 3.2 Property Management

- Store property name, type, address, description, primary owner, and active/archive state.
- A property belongs to one organization and references one primary owner for Phase 1.
- Land titles, parcel geometry, GPS coordinates, and advanced documents are excluded.

### 3.3 Property Unit Management

- A unit belongs to a property.
- Store unit number/name, floor, bedrooms, bathrooms, default PHP rental rate, description, and operational state.
- A unit must not permanently reference a Tenant.
- Occupancy is derived from the Lease domain.
- Changing a unit's default rent must not rewrite existing obligations or financial history.

### 3.4 Tenant Registry

- Store tenant name, contact information, address, emergency contact, notes, and archive state.
- Tenant history and references from historical leases must be preserved.

### 3.5 Lease Lifecycle

- A Lease connects one Tenant to one Property Unit.
- Store start date, end date, monthly PHP rent, rent due day, security deposit, status, termination date, and termination reason.
- Statuses are Draft, Upcoming, Active, Expired, and Terminated.
- Upcoming and Active leases must not overlap for the same unit.
- Draft leases may coexist but must not activate when a conflict exists.
- An Active lease normally determines that its unit is occupied.
- Early termination requires an effective termination date.
- Historical leases must remain preserved.

### 3.6 Rent Obligations

- A Rent Obligation belongs to a Lease and represents one monthly PHP amount due.
- Due days are limited to 1–28.
- Statuses are Pending, Partially Paid, Paid, and Overdue.
- Existing obligations preserve their original amount even when defaults change.
- Automatic proration is outside Phase 1.

### 3.7 Payment Recording

- A Payment applies to one Rent Obligation in Phase 1.
- Multiple partial payments may apply to the same obligation.
- Store positive amount, payment date, method, reference number, and notes.
- Methods include Cash, GCash, Maya, Bank Transfer, Check, and Other.
- Overpayments and online payment gateways are excluded.
- Corrections preserve original history through void/reversal and replacement rather than silent mutation.

### 3.8 Maintenance Requests

- A request belongs to an organization and relates to a Property or Property Unit.
- Priorities are Low, Medium, High, and Emergency.
- Lifecycle is Submitted → In Progress → Resolved → Closed.
- Request history remains available after resolution or archival.

### 3.9 Operational Dashboard

Phase 1 dashboard metrics are:

- total properties and units
- occupied and available units
- occupancy rate
- active tenants and leases
- current-month rent due and collected
- outstanding rent and overdue obligations
- open maintenance requests
- leases approaching expiration

Advanced analytics is outside Phase 1.

---

## 4. Cross-Cutting Requirements

- Every domain record must respect organization isolation and RLS conventions.
- Important business and financial records use archival, status transitions, or reversal records instead of destructive deletion.
- UI code never performs direct database access; all business logic and Supabase queries reside in `src/services/`.
- Types come from generated Supabase definitions; `any` is prohibited.
- Interfaces are responsive from 375px, use 48px minimum application-control targets, Shadcn/UI, and Tailwind semantic tokens.
- Domain terminology follows the approved JuanStack configuration after the open vertical/nomenclature discrepancy is resolved.

---

## 5. Protected Modules and Integration Boundaries

AI Secretary, Scheduling, and BIR are owned by the team leader and are outside this Phase 1 implementation assignment. Phase 1 may expose stable, organization-scoped, read-only domain facts for later consumption but must not modify or implement protected behavior.

Safe future facts include lease dates/status, obligation due dates and balances, payment history, maintenance state, property/unit identifiers, and derived occupancy. Tax calculation, AI orchestration, scheduling, notifications, and external communications remain outside this scope.

---

## 6. Deferred Requirements

The prior land-registry direction is preserved for future phases:

- land titles and advanced property documents
- parcel management
- GPS/geospatial coordinates and boundary mapping
- brokers and buyers
- property marketplace
- sales pipeline and sales transactions

These requirements are not deleted, implemented, or fully decomposed during Phase 1.

---

## 7. Open Architecture Decisions

- The repository remains configured as `vertical_id: property`, while the revised product direction is conceptually described as `real_estate`.
- Organization membership/RBAC for administrative staff must be confirmed before domain RLS policies are finalized.
- Canonical database naming for Payment must be aligned with any protected AI data contract without modifying the AI module during this phase-planning task.
