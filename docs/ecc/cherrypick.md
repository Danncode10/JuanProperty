# Cherrypicked Skills for DannFlow

This document tracks the custom skills that were created or modified for DannFlow, compared to the original ECC base (`inspirations/ecc`). 

## Custom/Created Skills 
The following skills are present in `.agents/skills` but were not found in `inspirations/ecc/skills`.

### 🟢 Essential for DannFlow Core (Keep these)
These skills actually map to DannFlow's tech stack (Next.js, React, Tailwind, Supabase) and its SaaS/Vibe Coding objectives.

**Core DannFlow Stack (Next.js, React, Supabase, TS)**
- `dannflow-*` (juanstack-init, masterplan, synchronizer, task, update)
- `react-build-resolver`, `react-reviewer`
- `typescript-reviewer`, `type-design-analyzer`
- `database-reviewer`, `supabase-rls-guardian`
- `e2e-runner` (Playwright)
- `shadcn`
- `source-command-*` (All 44 commands)

**Core Vibe Coding & UI Design (CRITICAL)**
- `design-taste-frontend`
- `emil-design-eng`
- `gpt-taste`
- `high-end-visual-design`
- `image`, `image-to-code`, `imagegen-frontend-mobile`, `imagegen-frontend-web`
- `impeccable`
- `industrial-brutalist-ui`
- `minimalist-ui`
- `redesign-existing-projects`
- `stitch-design-taste`
- `video`

**SaaS Growth & Product Layer**
- `copy-editing`, `copywriting`, `content-strategy`
- `cro` (Conversion Rate Optimization)
- `customer-research`
- `emails`, `sms`
- `launch`
- `onboarding`, `signup`
- `paywalls`, `pricing`, `popups`
- `programmatic-seo`, `seo-audit`, `seo-specialist`
- `product-marketing`, `marketing-agent`, `community-marketing`, `competitor-profiling`, `competitors`, `directory-submissions`, `free-tools`, `lead-magnets`
- `sales-enablement`, `revops`, `referrals`

**Agent & Repo Orchestration**
- `comment-analyzer`, `conversation-analyzer`
- `doc-updater`, `docs-lookup`
- `ecosystem-manager`
- `full-output-enforcement`
- `gan-evaluator`, `gan-generator`, `gan-planner`
- `github-code-review`, `github-multi-repo`, `github-project-management`, `github-release-management`, `github-workflow-automation`
- `harness-optimizer`, `hooks-automation`, `loop-operator`
- `opensource-forker`, `opensource-packager`, `opensource-sanitizer`
- `pair-programming`, `performance-optimizer`, `planner`
- `pr-test-analyzer`, `refactor-cleaner`
- `reasoningbank-agentdb`, `reasoningbank-intelligence`
- `schema`, `security-reviewer`, `silent-failure-hunter`, `site-architecture`
- `skill-builder`, `skill-search`
- `sparc-methodology`, `spec-miner`, `stream-chain`
- `swarm-advanced`, `swarm-orchestration`
- `tdd-guide`, `verification-quality`
- `v3-*` (All v3 optimization/swarm/cli skills)

---

### 🔴 Unnecessary Domains (Token Bloat)
These skills have absolutely nothing to do with DannFlow's tech stack. They belong to completely different programming languages, frameworks, or isolated hardware/medical domains. Keeping these just bloats the agent context limit.

**Irrelevant Programming Languages & Frameworks**
- `cpp-build-resolver`, `cpp-reviewer` (C++)
- `csharp-reviewer` (C# / .NET)
- `dart-build-resolver`, `flutter-reviewer` (Dart / Flutter)
- `django-build-resolver`, `django-reviewer` (Python Django)
- `fastapi-reviewer` (Python FastAPI)
- `fsharp-reviewer` (F#)
- `go-build-resolver`, `go-reviewer` (Go)
- `java-build-resolver`, `java-reviewer` (Java / Spring / Quarkus)
- `kotlin-build-resolver`, `kotlin-reviewer` (Kotlin / Android)
- `php-reviewer` (PHP / Laravel)
- `python-reviewer`, `pytorch-build-resolver` (Python / PyTorch)
- `rust-build-resolver`, `rust-reviewer` (Rust)
- `swift-build-resolver`, `swift-reviewer` (Swift / iOS)
- `vue-reviewer` (Vue.js - DannFlow uses React/Next.js)
- `harmonyos-app-resolver` (HarmonyOS)
- `rag-pipeline-reviewer` (Python/LangChain usually)

**Irrelevant Specializations**
- `healthcare-reviewer` (Clinical safety, PHI compliance)
- `homelab-architect` (Home network planning)
- `mle-reviewer` (Machine Learning Engineer for offline training)
- `network-architect`, `network-config-reviewer`, `network-troubleshooter` (Cisco IOS, routers, switches)
