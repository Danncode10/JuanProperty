# Requirements Document — JuanProperty

**Project Name:** JuanProperty (Built on DannFlow)  
**Vertical:** Philippine Real Estate & Land Management (`vertical_id: property`)  
**Date:** 2026-09-14  
**Status:** Approved Baseline

---

## 1. System Specifications & Goal

**JuanProperty** is a specialized real estate and land asset management platform built specifically for Philippine property developers, licensed real estate brokers, and land portfolio managers.

It replaces fragmented, vulnerable paper-based record-keeping with a unified digital cloud operations system:

- Centralized tracking of individual lots, consolidated land parcels, and multi-phase real estate development projects.
- Tamper-evident digital vault for high-resolution land titles (TCT/OCT/CCT), Tax Declarations (TD), and survey lot plans.
- Comprehensive landowner and heir registry with verified contact and SPA authorization records.
- Licensed broker (PRC) and accredited sales agent (DHSUD) directory with project assignment tracking.
- Interactive GPS mapping with coordinate pinpoints and cadastral boundary polygon overlays.
- Philippine BIR property tax (CWT, DST, CGT) and local Real Property Tax (_Amilyar_) deadline compliance.

---

## 2. User Personas & Pain Points

| Persona                                  | Role                                                   | Primary Pain Points Solved                                                                                                                                                                             |
| :--------------------------------------- | :----------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Property Manager / Broker** (Provider) | Licensed Real Estate Broker (PRC) / Land Asset Manager | Managing dozens of land listings without verified title scans; missing BIR withholding or quarterly local real property tax (_amilyar_) deadlines; difficulty organizing co-owners and heir approvals. |
| **Property Owner / Buyer** (Consumer)    | Landowner, Land Buyer, or Real Estate Investor         | Uncertainty regarding land title authenticity, boundary coordinates, and property encumbrances; lack of transparent deal tracking.                                                                     |
| **Field Sales Agent**                    | Accredited Salesperson (DHSUD)                         | Inability to quickly access parcel boundaries, GPS pinpoints, and title copies on mobile devices while conducting on-site client ocular inspections.                                                   |

---

## 3. Core Functional Requirements

### 3.1 Land Parcel & Project Management (`inventory_item` / `transaction`)

- **Parcels & Lots:** Record lot number, block number, survey number, zoning classification (residential, commercial, agricultural, industrial), lot area (sqm and hectares), and topography.
- **Development Projects:** Group parcels under named real estate projects (e.g., subdivisions, commercial estates, farmland developments).
- **Status Lifecycles:** Track parcel status (`Available`, `Reserved`, `Under Contract`, `Sold`, `Under Dispute`).

### 3.2 Land Title Document Vault

- **Supported Documents:** Transfer Certificate of Title (TCT), Original Certificate of Title (OCT), Condominium Certificate of Title (CCT), Tax Declarations (TD), Deed of Absolute Sale (DOAS), Special Power of Attorney (SPA), and Approved Survey Plans.
- **Document Verification:** Multi-tier verification status (`Verified`, `Pending Verification`, `Missing`, `Disputed`).
- **Secure File Storage:** Stored in encrypted Supabase Storage buckets with role-based access controls.

### 3.3 Landowner & Legal Registry

- Full owner profiles: Individual owners, co-owners, corporate entities, heirs.
- Contact tracking: Mobile numbers, WhatsApp/Viber handles, government IDs (TIN, Passport, PhilSys ID), and SPA authorization letters.

### 3.4 Agent & Broker Directory

- Profile management for licensed brokers (PRC license number) and salespersons (DHSUD registration).
- Project assignment matrix: Assign agents to specific properties, parcels, or client ocular appointments.
- Instant contact links for mobile phone calls, Viber, and WhatsApp.

### 3.5 Geographic Coordinates & Boundary Mapping

- Precise GPS latitude and longitude pinpoints for every land parcel.
- Boundary polygon mapping: Storage of latitude/longitude boundary coordinates matching official cadastral survey tie points.
- Map viewing interface optimized for mobile ocular inspections in rural and suburban settings.

### 3.6 Philippine BIR & Local Tax Readiness

- Automated compliance tracking for Philippine real estate transactions:
  - **Creditable Withholding Tax (CWT):** 5% standard rate on real property rental/sales (ATCs `WI 100` / `WC 100`).
  - **Capital Gains Tax (CGT):** 6% on capital asset transfers (Form 1706).
  - **Documentary Stamp Tax (DST):** 1.5% on deeds of sale (Form 2000-OT).
  - **Local Real Property Tax (_Amilyar_):** Quarterly deadline reminders (March 31, June 30, September 30, December 31).

---

## 4. Non-Functional Requirements

- **Mobile-First Touch Architecture:** $\ge 48\text{px}$ touch targets across all forms, buttons, and map controls for outdoor fieldwork.
- **High-Contrast Sunlight Readability:** Emerald Forest & Earth Gold dark-mode theme calibrated for readable text in bright outdoor settings.
- **Security & RLS:** Multi-tenant Row Level Security enforcing strict data isolation between brokerage organizations.
- **Strict Semantic Tokens:** 100% adherence to Tailwind/Shadcn semantic color variables without hardcoded hex codes.
