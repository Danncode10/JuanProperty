# MASTERPLAN — JuanProperty

> Centralized real estate and land management platform for Philippine property developers, brokers, and landlords to manage land parcels, real estate projects, legal land title documents, ownership records, assigned agents with contact registries, and precise GPS mapping coordinates.

**Linked GitHub Project:** [JuanProperty (Board #13)](https://github.com/users/Danncode10/projects/13)

---

## **PHASE 0: DannFlow Template Readiness**

Phase 0 is **template readiness**, establishing verified cloud infrastructure, authentication, design direction, and production deployment before building domain-specific features.

- [x] **`[P0.1]` Supabase template connection and environment values**
  - **Goal:** Connect the Supabase cloud project (`jmgodwuniwlesgzplduh`), verify environment credentials in `.env.local`, and verify public database connectivity.
  - **Dependencies:** None
  - **Acceptance Criteria:** `.env.local` contains non-placeholder credentials, Supabase connection responds successfully, baseline migration verified.
  - **Run:** `/setup-supabase`

- [ ] **`[P0.2]` Project overview applied to template UI: design direction, color system, landing-page copy, and template visual cleanup**
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

## **PHASE 1: Core Land Registry, Documents & Coordinates**

_(Placeholder — expand with `/make-masterplan Phase 1`)_

---

## **PHASE 2: Ownership Registry & Agent Contact Directory**

_(Placeholder — expand with `/make-masterplan Phase 2`)_

---

## **PHASE 3: BIR Property Tax Compliance & AI Secretary Proactive Triggers**

_(Placeholder — expand with `/make-masterplan Phase 3`)_

---

## **Notes**

- Every phase concludes with a mandatory documentation task: `[PX.DOC] Finalize Phase X Documentation & Diagrams`.
- Run `/update-masterplan` after editing tasks so the linked GitHub Project stays in sync.
