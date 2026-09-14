# Project Context — JuanProperty

> This file is read by Claude, skills, and commands before they act on your project.
> Updated via `/juanstack-init` for the JuanProperty real estate & land management vertical.
> Do NOT edit `.claude/skills/` files directly — put project-specific context here instead.

---

## What this app is

**App name:** JuanProperty

**One-liner:** Comprehensive real estate and land management platform for Philippine property developers, brokers, and landlords to manage land parcels, real estate projects, legal land title documents, ownership records, assigned agents with contact registries, and precise GPS mapping coordinates.

**The problem it solves:**
In the Philippines, real estate developers, brokers, and land asset managers struggle with fragmented, paper-based records: land titles (TCT/OCT) and tax declarations are scattered across physical folders or personal chats, land ownership and heir histories are ambiguous, field agents lack immediate contact access or clear project assignments, and land boundaries lack verifiable GPS coordinates on ground oculars. JuanProperty unifies land parcels, development projects, title document vaults, owner/agent registries, interactive GPS boundary mapping, and Philippine BIR property tax compliance into a single secure system.

---

## Core Domain Features & Capabilities

1. **Land Parcel & Project Management:**
   - Organize individual lots, consolidated land parcels, and multi-phase real estate development projects.
   - Track zoning classification (residential, commercial, agricultural, industrial), lot area (sqm / hectares), topography, and utilities.

2. **Land Document Vault:**
   - Dedicated repository for land documents:
     - Transfer Certificate of Title (TCT) / Original Certificate of Title (OCT) / Condominium Certificate of Title (CCT)
     - Real Property Tax Declaration (TD) & Tax Clearance certificates
     - Approved Survey Plans (Lot Plan, Vicinity Map)
     - Deed of Absolute Sale (DOAS) / Contract to Sell (CTS)
     - Special Power of Attorney (SPA) / Extrajudicial Settlement (EJS)
   - Verification status tracking (Verified, Pending Verification, Missing, Disputed).

3. **Landowner & Ownership Registry:**
   - Full landowner profiles: Registered owner(s), co-owners, heirs, corporate entities.
   - Contact records: Verified phone numbers, email addresses, government IDs, and representative authorization (SPA).
   - Ownership history and acquisition details.

4. **Agent & Broker Directory:**
   - Roster of licensed real estate brokers (PRC registered) and accredited sales agents (DHSUD).
   - Direct contact links: Mobile phone, WhatsApp, Viber, and email.
   - Assignment matrix: Easily map agents to specific land parcels, projects, or client ocular viewings.
   - Commission agreements and performance tracking.

5. **Geographic Coordinates & Mapping:**
   - Precise GPS latitude and longitude pinpoints for every land parcel and project entrance.
   - Boundary polygon coordinates (tie points / cadastral survey lot coordinates) for visual mapping.
   - Interactive map view (Leaflet / OpenStreetMap) with satellite layer toggle for on-site navigation during ocular visits.

6. **Philippine BIR & Local Tax Readiness:**
   - Capital Gains Tax (6%), Documentary Stamp Tax (1.5%), Creditable Withholding Tax (5%), and Local Real Property Tax (RPT / Amilyar) tracking.
   - Automated deadline reminders for quarterly and annual tax filings (Form 1601-EQ, Form 1706).

---

## Target audience

**Primary user:**
Licensed Philippine Real Estate Brokers, Real Estate Developers, Land Asset Managers, and Property Management Firms.

**Secondary user:**
Field Sales Agents conducting client ocular inspections, and Landowners checking portfolio status.

**What they care most about:**

- Immediate mobile access to verifiable land title documents (TCT/OCT scans) when meeting clients or city assessors.
- Rapid lookup of who owns what land parcel and which agent is actively handling inquiries.
- Accurate GPS coordinates to navigate directly to unimproved rural or suburban land parcels.
- Never missing Real Property Tax (Amilyar) or BIR withholding deadlines.

**What they don't care about:**

- Full in-browser CAD or BIM rendering (simple PDF blueprints, survey plan scans, and polygon maps are sufficient).
- Cryptocurrency or fractionalized blockchain deeds.
- Over-engineered international tax compliance outside the Philippines.

---

## Stack decisions (supplement CLAUDE.md)

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
- **Document Storage:** Supabase Storage (secured buckets for high-resolution land deeds, survey plans, and IDs)
- **Mapping & Geo:** Leaflet / OpenStreetMap or Mapbox for GPS pin dropping and parcel polygon overlays
- **State & Data Fetching:** TanStack Query + Server Components
- **UI Components:** Shadcn/UI primitives with Tailwind CSS
- **Domain Nomenclature Engine:** `useTerm()` and `getTerm()` strictly backed by `business.json`

---

## Design decisions

- **Strict Semantic Compliance:** Use only Shadcn/Tailwind semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, etc.). Never hardcode hex codes or raw color values.
- **Site-Inspection Ready (Mobile-First):**
  - All interactive touch targets (buttons, inputs, map controls) $\ge 48\text{px}$ tall.
  - High contrast for outdoor daylight viewing on mobile phones and tablets during land ocular inspections.
  - Camera integration hook for instant mobile photo/document uploads during site visits.
- **Form Layouts:**
  - Standardized `<Card>` wrapper with `<CardHeader>`, `<CardContent>`, `<CardFooter>`.
  - Labels always above inputs with visible focus rings (`ring-ring`).
- **Document Previewer:** Clean modal / drawer preview for multi-page land deeds, PDFs, and lot plans.

---

## Tone & voice

**Brand tone:**
Professional, authoritative, trustworthy, and clear. Built with deep respect for Philippine real estate legal realities and surveyor terminology.

**What to avoid:**
Avoid generic tech jargon ("revolutionary decentralized real estate"). Avoid consumer hype. Keep communication grounded in pragmatic property and land administration.

---

## Anti-decisions (things we're NOT doing)

- NOT building an in-browser CAD drawing engine — use image/PDF survey plan attachments.
- NOT implementing Web3/NFT title deeds in v1 — strictly adhere to Philippine Land Registration Authority (LRA) and Registry of Deeds (RD) paradigms.
- NOT building international multi-currency tax engines — focus purely on Philippine BIR regulations and Local Government Unit (LGU) Real Property Tax.

---

## Current focus / what's being built right now

- **Phase 0 & 1:**
  - Setup core database schema for `lands`, `projects`, `land_documents`, `land_owners`, `agents`, and `coordinates`.
  - Implement Land Parcel & Project CRUD with GPS coordinate pin-dropping and boundary logging.
  - Implement Document Vault for uploading and previewing TCTs, Tax Declarations, and Lot Plans.
  - Implement Owner & Agent Contact Directory with direct calling/messaging actions.

---

_Last updated: 2026-09-14 (JuanProperty Vertical Initialization)_
