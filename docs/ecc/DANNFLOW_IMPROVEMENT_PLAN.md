# Architectural Review: ECC (`inspirations/ecc`) & DannFlow Enhancement Roadmap

This document outlines the detailed architectural enhancements for the **DannFlow** repository (Template Mode), directly mapped from the best practices found in the **ECC** (Everything Claude Code) framework. 

The strategy focuses strictly on mapping files and concepts that natively support **Antigravity, Claude Code, and Codex**.

---

## 1. STRICT COPY (Exact 1:1 Migration)

These elements from ECC are universally applicable. We will copy them directly from ECC into DannFlow's agent definitions with zero logic changes.

### A. Core Security (Prompt Defense Baseline)
*   **From:** `inspirations/ecc/CLAUDE.md`
*   **To:** `AGENTS.md` 
*   **Implementation:** Copy the exact Prompt Defense rules to prevent prompt injections, block secret leaks, and ignore malicious context overflow tricks.

### B. Specialized Agents (The "Review & Monitor" Personas)
*   **Security Reviewer (`ecc/agents/security-reviewer.md` -> `.agents/skills/security-reviewer/SKILL.md`)**: A dedicated persona to hunt for OWASP vulnerabilities before commits.
*   **Refactor Cleaner (`ecc/agents/refactor-cleaner.md` -> `.agents/skills/refactor-cleaner/SKILL.md`)**: A strict agent that only focuses on removing dead code and simplifying logic without feature creep.
*   **Loop Operator (`ecc/agents/loop-operator.md` -> `.agents/skills/loop-operator/SKILL.md`)**: A safeguard agent that autonomously monitors long-running AI loops to prevent token exhaustion and stalling.

---

## 2. COPY and MODIFY (Adapting to DannFlow Stack)

These elements are architecturally brilliant in ECC but must be tweaked to understand DannFlow's **Next.js 16 App Router**, **Supabase**, and **AgentDB** stack.

### A. The "Development" Personas
*   **Test-Driven Development (`ecc/agents/tdd-guide.md` -> `.agents/skills/dannflow-tdd/SKILL.md`)**: Tweak the prompt to enforce writing Jest/Playwright tests specifically for Next.js components and Supabase `src/services/` prior to implementation.
*   **Build Error Resolver (`ecc/agents/build-error-resolver.md` -> `.agents/skills/build-error-resolver/SKILL.md`)**: Inject Next.js 16 caching knowledge and Supabase CLI migration drift knowledge to prevent AI hallucination during debugging.
*   **Database Reviewer (`ecc/agents/database-reviewer.md` -> `.agents/skills/database-reviewer/SKILL.md`)**: Modify it to enforce JuanStack Vertical multi-tenant constraints (e.g., ensuring `organization_id` checks and Row Level Security are always present).

---

## 3. NEWLY IDENTIFIED FEATURES (Missed in Initial Review)

Upon deeper review of the `inspirations/ecc` ecosystem, we identified massive capabilities that DannFlow currently lacks and should adopt:

### A. Pre/Post-Task Automated Hooks
*   **ECC Concept:** ECC uses a `hooks.json` engine to automatically trigger actions (like summarizing sessions or scanning secrets) *before* or *after* a tool is executed.
*   **DannFlow Plan:** Implement a similar hooks system (`.claude/hooks.json` or `.agents/hooks/`) that automatically scans for hardcoded `.env.local` keys before any git commit is generated, and automatically triggers an AgentDB memory save after a successful task completion.

### B. Documentation & Context Agents (Codemaps)
*   **ECC Concept:** ECC uses `spec-miner`, `doc-updater`, and `docs-lookup` agents to constantly maintain documentation and prevent the AI from losing track of the project's overall structure.
*   **DannFlow Plan:** Create a `.agents/skills/doc-updater/SKILL.md` persona. Whenever `dannflow-task` finishes a complex feature, it must delegate to `doc-updater` to update the project README and `PROJECT_CONTEXT.md`.

### C. Standardized MCP Configurations
*   **ECC Concept:** ECC ships with a curated `mcp-configs/` folder mapping 14 critical external tools.
*   **DannFlow Plan:** Expand DannFlow's `mcp.example.json` into a `.agents/mcp-configs/` directory containing out-of-the-box, secure configurations for GitHub, Supabase, and Terminal MCPs.

---

## 4. DEVOPS, CI/CD & GIT HOOKS

DannFlow's DevOps pipeline currently lags behind ECC's enterprise-grade configuration. We must adapt ECC's CI and local Git Hooks to fit the DannFlow workflow.

### A. Husky (`.husky/pre-push`)
*   **Current State:** DannFlow's `pre-push` only checks `npm run lint`, `tsc --noEmit`, and blocks pushes if there are pending docs in `PENDING_DOC_UPDATES.md`.
*   **ECC Upgrade (AgentShield):** We need to modify `.husky/pre-push` to execute a local security scan (similar to ECC's AgentShield). It must block the push if it detects any hardcoded Supabase Service Role keys, API secrets, or unencrypted `.env` data.

### B. GitHub Actions (`.github/workflows/`)
*   **Current State:** DannFlow has a single, basic `ci.yml` (1.4KB).
*   **ECC Upgrade:** ECC utilizes 12 robust workflows (e.g., `supply-chain-watch.yml`, extensive `reusable-test.yml`, and `release.yml`). 
*   **DannFlow Plan:** 
    1. **Supply Chain Watch:** Copy ECC's `supply-chain-watch.yml` to automatically monitor DannFlow's `package.json` for malicious NPM dependencies (crucial for AI-generated code).
    2. **E2E Testing CI:** Upgrade `ci.yml` to strictly enforce the "80% test coverage" rule, blocking PRs into `main` if Playwright/Jest tests fail or coverage drops.

---

## 5. STRUCTURAL RULE MIGRATION (Context Optimization)

To prevent the AI agents from exceeding their context windows, we will break down the massive 23KB `AGENTS.md` file into lazily-loaded modules following ECC's context budgeting strategy.

*   **Next.js & UI Guidelines**: Moved to `.agents/rules/ui-guidelines.md`. Only loaded when editing `src/components/` or `app/`.
*   **JuanStack Vertical Rules**: Moved to `.agents/rules/juanstack.md`. Only loaded when editing `src/bir/` or `src/analytics/`.
