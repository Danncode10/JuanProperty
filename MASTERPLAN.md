# MASTERPLAN — JuanProperty

> Real Estate Property Management SaaS for landlords, Property Managers, and administrative teams to manage owners, properties, units, tenants, leases, rent obligations, payments, maintenance, and portfolio operations.

**Linked GitHub Project:** [JuanProperty (Board #13)](https://github.com/users/Danncode10/projects/13)

---

## **PHASE 0: DannFlow Template Readiness**

Phase 0 is **template readiness**, establishing verified cloud infrastructure, authentication, design direction, and production deployment before building domain-specific features.

- [x] **`[P0.1]` Supabase template connection and environment values**
  - **Goal:** Connect the Supabase cloud project (`jmgodwuniwlesgzplduh`), verify environment credentials in `.env.local`, and verify public database connectivity.
  - **Dependencies:** None
  - **Acceptance Criteria:** `.env.local` contains non-placeholder credentials, Supabase connection responds successfully, baseline migration verified.
  - **Run:** `/setup-supabase`

- [x] **`[P0.2]` Project overview applied to template UI: design direction, color system, landing-page copy, and template visual cleanup**
  - **Goal:** Apply JuanProperty branding, Philippine real estate color palette, landing page copy, and clean up template placeholders.
  - **Dependencies:** `[P0.1]`
  - **Acceptance Criteria:** Hero and marketing sections reflect JuanProperty's real estate/land management value proposition with clean semantic tokens.
  - **Run:** `/design-project`

- [ ] **`[P0.3]` Template email authentication and redirect configuration**
  - **Goal:** Configure Gmail SMTP for Supabase auth emails, email confirmation and recovery settings, app redirect URLs, and branded email templates.
  - **Dependencies:** `[P0.1]`, `[P0.2]`
  - **Acceptance Criteria:** SMTP credentials configured, redirect URLs registered in Supabase Auth, branded email templates installed.
  - **Run:** `/setup-auth`

- [ ] **`[P0.4]` Google OAuth sign-in configuration and verification**
  - **Goal:** Set up Google Cloud consent screen and Web client, Google-to-Supabase callback URI, Supabase Google provider credentials, app redirect URLs, and verify end-to-end sign-in.
  - **Dependencies:** `[P0.1]`, `[P0.2]`, `[P0.3]`
  - **Acceptance Criteria:** Google OAuth client credentials added to Supabase, callback URLs properly mapped, test sign-in succeeds.
  - **Run:** `/setup-auth`

- [ ] **`[P0.5]` Hero media brief and asset handoff**
  - **Goal:** Produce hero visual assets, imagery, or media backgrounds highlighting Philippine real estate / land management aesthetics.
  - **Dependencies:** `[P0.2]`
  - **Acceptance Criteria:** High-resolution media asset integrated into the hero section with proper aspect ratio and performance optimization.
  - **Run:** `/hero-bg`

- [ ] **`[P0.6]` Template-level visual and quality review**
  - **Goal:** Execute visual, SEO, marketing copy, and accessibility audit across the template pages.
  - **Dependencies:** `[P0.1]`, `[P0.2]`, `[P0.3]`, `[P0.4]`, `[P0.5]`
  - **Acceptance Criteria:** `/seo-check`, `/marketing-check`, and `/review` pass without errors; mobile responsiveness verified at 375px.
  - **Run:** `/seo-check`, `/marketing-check`, `/review`

- [ ] **`[P0.7]` Vercel production deployment and authentication URL registration**
  - **Goal:** Deploy JuanProperty to Vercel production, configure environment variables, register canonical production domain in Supabase Auth redirect URLs and Google OAuth authorized origins, and verify live authentication.
  - **Dependencies:** `[P0.1]`, `[P0.2]`, `[P0.3]`, `[P0.4]`, `[P0.6]`
  - **Acceptance Criteria:** Clean build and deploy on Vercel, canonical HTTPS domain active, production auth redirect URLs verified end-to-end.
  - **Run:** `/setup-vercel`

- [ ] **`[P0.DOC]` Finalize Phase 0 Documentation & Handover**
  - **Goal:** Update docs, handover logs, and pending documentation ledger for Phase 0 completion.
  - **Dependencies:** `[P0.1]`, `[P0.2]`, `[P0.3]`, `[P0.4]`, `[P0.5]`, `[P0.6]`, `[P0.7]`
  - **Acceptance Criteria:** `docs/handover/phase-0-setup-handover.md` updated, `docs/PENDING_DOC_UPDATES.md` cleared for Phase 0.
  - **Run:** `/close-task`

---

## **PHASE 1: Core Property Management, Leasing & Rent Operations**

> **Objective:** Build the organization-scoped operational foundation that allows Property Managers to manage property owners, properties, units, tenants, leases, rent obligations, payments, maintenance requests, and basic portfolio visibility.
>
> **Ownership boundary:** Phase 1 does not modify or implement AI Secretary, Scheduling, BIR, generic authentication, or generic DannFlow/JuanStack infrastructure. It may expose stable, read-only domain data contracts for those systems to consume later.

- [ ] **`[P1.1]` Property Owner Registry**
  - **Goal:** Create an organization-scoped registry for Property Owners without conflating them with the configured Property Manager provider.
  - **Scope:** Support individual and company owners, one owner owning multiple properties, contact and descriptive information, and archival instead of destructive deletion. One primary owner per property is sufficient for MVP; co-ownership percentages are deferred.
  - **Dependencies:** Phase 0 readiness and an approved organization-access/RLS convention.
  - **Acceptance Criteria:** Property Owners are isolated by organization; individual/company ownership is represented; records can be created, viewed, updated, and archived; archived records and their history remain available to authorized users; no AI, Scheduling, or BIR behavior is introduced.
  - **Affected Areas:** Future Real Estate migration, generated Supabase types, validation, `src/services/`, authenticated dashboard routes/components, tests, and documentation ledger.

- [ ] **`[P1.2]` Property Management**
  - **Goal:** Implement organization-scoped Property management linked to one primary Property Owner.
  - **Scope:** Property name, property type, address, description, primary owner, and active/archive state.
  - **Dependencies:** `[P1.1]`.
  - **Acceptance Criteria:** Authorized users can manage and archive properties within their organization; one owner may be linked to multiple properties; property history is preserved; land titles, parcel geometry, GPS coordinates, and advanced documents are excluded.
  - **Affected Areas:** Future Real Estate migration, generated types, validation, property service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.3]` Property Unit Management**
  - **Goal:** Implement operational units belonging to Properties.
  - **Scope:** Unit number/name, floor, bedrooms, bathrooms, default PHP rental rate, description, and operational state.
  - **Dependencies:** `[P1.2]`.
  - **Acceptance Criteria:** Units are organization-scoped through their Property; unit identity is unique within the appropriate Property boundary; default rent changes do not rewrite historical lease or obligation values; no permanent `tenant_id` is stored on a unit; occupancy is determined through the Lease domain.
  - **Affected Areas:** Future Real Estate migration, generated types, validation, unit service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.4]` Tenant Registry**
  - **Goal:** Implement organization-scoped Tenant management while preserving historical tenant records.
  - **Scope:** Name, contact information, address, emergency contact, notes, and archive state.
  - **Dependencies:** Phase 0 readiness and the approved organization-access/RLS convention.
  - **Acceptance Criteria:** Authorized users can manage and archive tenants; tenant records are not permanently assigned to units; historical lease references remain valid; destructive deletion is unavailable for records referenced by business history.
  - **Affected Areas:** Future Real Estate migration, generated types, validation, tenant service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.5]` Lease Lifecycle**
  - **Goal:** Implement the Tenant → Lease → Property Unit relationship and its controlled lifecycle.
  - **Scope:** Tenant, Property Unit, start date, end date, monthly PHP rent, rent due day, security deposit, status, termination date, and termination reason. Statuses: Draft, Upcoming, Active, Expired, and Terminated.
  - **Dependencies:** `[P1.3]`, `[P1.4]`.
  - **Acceptance Criteria:** Upcoming and Active leases cannot overlap for the same unit; Draft leases may coexist but cannot transition when conflicting; an Active lease normally makes its unit occupied; early termination requires an effective termination date; historical leases remain preserved; organization isolation is enforced at the database and service layers.
  - **Affected Areas:** Future Real Estate migration and constraints, generated types, validation/state transitions, lease service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.6]` Rent Obligations**
  - **Goal:** Introduce monthly Rent Obligations as immutable financial expectations belonging to Leases.
  - **Scope:** Lease, obligation period, due date, PHP amount due, balance/status information, and statuses Pending, Partially Paid, Paid, and Overdue. Due day is limited to 1–28; automatic proration is excluded.
  - **Dependencies:** `[P1.5]`.
  - **Acceptance Criteria:** Obligations are organization-scoped through their Lease; each obligation preserves its rent amount independently of later unit or lease-default changes; monthly obligation identity is protected against duplicates; status and outstanding balance rules are documented and testable.
  - **Affected Areas:** Future Real Estate migration and constraints, generated types, validation, obligation service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.7]` Payment Recording**
  - **Goal:** Record auditable payments against Rent Obligations and calculate balances without rewriting financial history.
  - **Scope:** Multiple partial payments per obligation; positive PHP amount; payment date; method (Cash, GCash, Maya, Bank Transfer, Check, Other); reference number; notes; void/reversal and replacement correction flow.
  - **Dependencies:** `[P1.6]`.
  - **Acceptance Criteria:** Payments are organization-isolated; partial payments update the obligation balance/status consistently; overpayment is rejected; original payment records survive correction; online payment gateways and payment credits are excluded.
  - **Affected Areas:** Future Real Estate migration and transactional constraints, generated types, validation, payment service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.8]` Maintenance Requests**
  - **Goal:** Implement organization-scoped maintenance tracking for a Property or Property Unit.
  - **Scope:** Property/Unit relationship, request details, priority (Low, Medium, High, Emergency), lifecycle (Submitted → In Progress → Resolved → Closed), notes, timestamps, and archive/history behavior.
  - **Dependencies:** `[P1.2]`, `[P1.3]`.
  - **Acceptance Criteria:** Every request belongs to the correct organization and references a valid Property and, when supplied, one of that Property's Units; lifecycle transitions are validated; resolved and closed history remains available; no scheduling automation or AI task creation is implemented.
  - **Affected Areas:** Future Real Estate migration and constraints, generated types, validation, maintenance service, routes/components, tests, and documentation ledger.

- [ ] **`[P1.9]` Real Estate Operational Dashboard**
  - **Goal:** Provide basic operational portfolio visibility using Phase 1 domain data.
  - **Scope:** Total properties, total units, occupied/available units, occupancy rate, active tenants, active leases, current-month rent due and collected, outstanding rent, overdue obligations, open maintenance requests, and leases approaching expiration.
  - **Dependencies:** `[P1.1]` through `[P1.8]`.
  - **Acceptance Criteria:** Metrics are organization-scoped, defined consistently with the Phase 1 business rules, obtained through the service layer, responsive from 375px, and limited to operational summaries rather than advanced analytics; no protected Analytics core, AI, Scheduling, or BIR logic is changed.
  - **Affected Areas:** Real Estate dashboard service/read model, authenticated dashboard routes/components, tests, and documentation ledger.

- [ ] **`[P1.DOC]` Finalize Phase 1 Documentation & Diagrams**
  - **Goal:** Close Phase 1 with authoritative documentation and a clear handoff to protected modules.
  - **Dependencies:** `[P1.1]` through `[P1.9]`.
  - **Acceptance Criteria:** Real Estate domain diagram, entity relationships, business rules, implementation summary, deferred functionality, known limitations, and safe integration contracts for AI Secretary, Scheduling, and BIR are documented; `docs/PENDING_DOC_UPDATES.md` is processed and cleared for Phase 1.
  - **Affected Areas:** `docs/project/`, `docs/diagrams/`, phase handover documentation, and documentation ledger.

---

## **Superseded Phase 1 Direction — Preserved for Traceability**

The earlier Phase 1 placeholder, **Core Land Registry, Documents & Coordinates**, is superseded as the active Phase 1 direction. It had no detailed `[P1.x]` tasks in `MASTERPLAN.md` and no matching GitHub Issues, so no completed or tracked task IDs are being reused. Its product direction is retained in the deferred phases below.

---

## **PHASE 2: Deferred Land Registry & Advanced Property Documents**

_(Deferred placeholder — land titles, parcel records, and advanced property documents. Do not expand or implement during Phase 1.)_

---

## **PHASE 3: BIR Property Tax Compliance & AI Secretary Proactive Triggers**

_(Team-leader-owned placeholder preserved from the previous roadmap. Do not expand or implement as part of the Real Estate Phase 1 assignment.)_

---

## **PHASE 4: Deferred Parcel Geometry & Geospatial Operations**

_(Deferred placeholder — GPS coordinates, parcel geometry, boundary mapping, and related field workflows. Do not expand or implement during Phase 1.)_

---

## **PHASE 5: Deferred Brokerage, Buyers & Sales Operations**

_(Deferred placeholder — brokers, buyers, sales pipeline, and sales transactions. Do not expand or implement during Phase 1.)_

---

## **PHASE 6: Deferred Property Marketplace**

_(Deferred placeholder — public marketplace and related listing/discovery workflows. Do not expand or implement during Phase 1.)_

---

## **Notes**

- Every phase concludes with a mandatory documentation task: `[PX.DOC] Finalize Phase X Documentation & Diagrams`.
- Run `/update-masterplan` after editing tasks so the linked GitHub Project stays in sync.
