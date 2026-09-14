<!-- Ledger cleared. Log new pending documentation updates here. -->

## [Installer & Onboarding] Clean Git Slate, Starter README & Piped Input Fix

- **Files changed:** `install.sh`
- **Description:**
  - Fixed stdin detection (`[ -r /dev/tty ]`) so piped installs via `curl -sSL ... | bash` interactively prompt for project name and project repo URL instead of silently falling back to `my-app`.
  - Replaced template Git history retention with clean-slate initialization (`rm -rf .git && git init -b main`). Sets `upstream` to `DannFlow` (fetch-only, push disabled) and optional `origin` to the project repository without inheriting 100+ template commits or causing false upstream push errors.
  - Generates a clean starter `README.md` directing users to edit `PROJECT_CONTEXT.md` and run `/masterplan-init`.
  - Made Ruflo installation non-blocking via `npm run setup:ruflo` to prevent installer hangs.
- **Affected Documentation to Update:** `docs/dannflow_docs/setup/setup-flow.md`, `README.md`.

## [Command & Installer] /juanstack-init Onboarding & Setup Instructions

- **Files changed:**
  - `install.sh`
  - `guide.sh`
  - `.claude/commands/juanstack-init.md`
  - `.agents/skills/dannflow-juanstack-init/SKILL.md`
  - `.claude/commands/README.md`
  - `.claude/commands/help-dannflow.md`
- **Description:**
  - Added `/juanstack-init` interactive setup command and agent skill to automate onboarding of new JuanStack vertical SaaS applications.
  - Implements structured domain interview covering vertical identity, domain nomenclature (`provider`, `consumer`, `transaction`, `inventory_item`), feature modules, Philippine BIR compliance (RA 11976, withholding tax rate, ATCs), AI Secretary persona and observable state triggers, and mobile/site UI constraints.
  - Automates generation and configuration of `business.json`, `PROJECT_CONTEXT.md`, `src/ai/personas/{vertical_id}.ai-manifest.json`, `metadata.json`, and namespace directory creation.
  - Updated `install.sh` and `guide.sh` to include `/juanstack-init` in the post-install Next Steps and generated starter README.md instructions.
- **Affected Documentation to Update:** `docs/dannflow_docs/commands/`, `guide.sh`, and installer documentation.

## [Vertical Init] JuanProperty Real Estate & Land Management Vertical

- **Files changed:** `business.json`, `PROJECT_CONTEXT.md`, `src/ai/personas/property.ai-manifest.json`, `metadata.json`, `src/bir/property/`, `src/analytics/property/`
- **Description:**
  - Initialized `JuanProperty` vertical (`vertical_id`: `property`) with Philippine real estate domain nomenclature (`Property Manager / Broker`, `Property Owner / Buyer`, `Real Estate Project`, `Land Parcel / Unit`).
  - Configured feature flags for real estate & land portfolio operations: inventory management, scheduling, analytics, BIR tax module, and AI secretary.
  - Configured Philippine BIR tax compliance for RA 11976 (EOPT) and CWT (5% on real property rental, ATCs WI 100/WC 100).
  - Scaffolded `src/ai/personas/property.ai-manifest.json` targeting land title document vaults, GPS coordinate coverage, unassigned agent contacts, and BIR tax deadlines.
  - Updated `PROJECT_CONTEXT.md` with full specifications for land parcels, development projects, title documents (TCT/OCT/Tax Decs), owner directory, agent contacts with PRC/DHSUD licenses, and GPS coordinates.
  - Created namespace directories `src/bir/property/` and `src/analytics/property/`.
- **Affected Documentation to Update:** `docs/` architecture documents, Phase 0 readiness, and Masterplan.
