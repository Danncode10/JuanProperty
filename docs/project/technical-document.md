# Technical Document — JuanProperty

**Project Name:** JuanProperty (Built on DannFlow)  
**Vertical:** Philippine Real Estate & Land Management (`vertical_id: property`)  
**Date:** 2026-09-14  
**Status:** Active Baseline

---

## 1. System Architecture Overview

JuanProperty follows the strict **DannFlow Vibe-Coding Architecture**:

- **Presentation Layer (`src/app/`, `src/components/`):** React Server Components by default. Client components (`'use client'`) used strictly when local interactive state or touch handlers are required.
- **Service Layer (`src/services/`):** All business logic, Supabase database queries, mutation mutations, and rate limiting reside here. The UI never invokes Supabase directly.
- **Type Layer (`src/types/`):** Auto-generated TypeScript definitions (`src/types/supabase.ts`) derived from the cloud Supabase schema. Strict typing is enforced — `any` is strictly banned.
- **Vertical Namespace Isolation:** Domain tax logic resides in `src/bir/property/`, domain analytics in `src/analytics/property/`, and AI secretary configuration in `src/ai/personas/property.ai-manifest.json`.

---

## 2. Infrastructure & Database Layer

### 2.1 Cloud Supabase Configuration

- **Supabase Project ID:** `jmgodwuniwlesgzplduh`
- **Region:** Southeast Asia (Singapore `ap-southeast-1`)
- **Connection Host:** Session pooler at `aws-0-ap-southeast-1.pooler.supabase.com:5432` with IPv4 connectivity.
- **Schema Management:** Native Supabase CLI migrations via `supabase/migrations/` deployed using `npm run db:migrate` (`supabase db push`). Local Docker setups are disabled due to host storage constraints.

### 2.2 Multi-Tenant Row Level Security (RLS)

- Every table operates under active RLS policies.
- Data isolation is strictly scoped to the tenant (`organization_id`).
- Real estate assets (parcels, title files, owner contact info) are only visible to authorized members of the managing organization.

---

## 3. JuanStack Vertical Domain Nomenclature

Domain terminology is decoupled from UI code and resolved at build time via `business.json`:

```typescript
import { getTerm } from "@/lib/vertical-config";

const brokerLabel = getTerm("provider"); // "Property Manager / Broker"
const clientLabel = getTerm("consumer"); // "Property Owner / Buyer"
const projectLabel = getTerm("transaction"); // "Real Estate Project"
const parcelLabel = getTerm("inventory_item"); // "Land Parcel / Unit"
```

In client components, the reactive hook `useTerm()` provides dynamic nomenclature resolution.

---

## 4. Feature Modules & Technical Stack

| Module                      | Implementation                          | Responsibility                                                                                         |
| :-------------------------- | :-------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Land Parcels & Projects** | `src/services/property/`, `src/types/`  | Parcel coordinates, lot sizing (sqm/ha), zoning classifications, and status lifecycles.                |
| **Document Vault**          | Supabase Storage (`documents` bucket)   | Upload, storage, and retrieval of TCT/OCT scans, tax declarations, and survey blueprints.              |
| **GPS & Map Visualizer**    | Leaflet / OpenStreetMap integration     | Latitude/longitude pin plotting, boundary polygon drawing, and mobile ocular navigation.               |
| **BIR Tax Module**          | `src/bir/property/`                     | RA 11976 (EOPT) compliance, CWT 5% calculations (ATCs `WI 100`/`WC 100`), DST, and CGT logs.           |
| **AI Operations Secretary** | Supabase Edge Function (`ai-secretary`) | Autonomous monitoring of unverified land titles, missing GPS coordinates, and quarterly tax deadlines. |

---

## 5. Security & Architectural Guardrails

1. **Separation of Concerns:** UI components must NEVER contain raw SQL or direct Supabase client calls.
2. **Hero-Media Freeze:** The video backgrounds and poster art in `src/components/landing/hero.tsx` are protected assets governed by the template preservation contract.
3. **Audit Trails:** Title document status changes and landowner contact modifications are recorded with timestamps and user attribution.
4. **Rate Limiting:** Critical authentication, password recovery, and upload routes are protected by rate limiters via `src/services/auth-server.ts`.
