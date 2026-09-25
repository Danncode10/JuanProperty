# ECC to DannFlow: The 99% Mass-Migration Strategy

This is the comprehensive blueprint to ingest 90-99% of the **Everything-Claude-Code (ECC)** ecosystem (68 agents, 292 skills, 94 commands, and advanced hook systems) into DannFlow without destroying DannFlow's Next.js/Supabase architecture. 

Because ECC is primarily a system of Markdown files (`.agents`, `.claude`, `skills/`, `commands/`), we can achieve near-100% migration. The only things we will exclude or modify are scripts that hard-conflict with DannFlow's build process.

---

## Phase 1: The Mass Skill & Agent Ingestion (Automated)
Instead of copying 4 skills manually, we will run an automated ingestion script to merge all 292 ECC Skills and 68 ECC Agents into DannFlow's native `.agents/skills/` directory.

### 1. Agents to Skills Conversion
In DannFlow, an "Agent" and a "Skill" are unified. Every ECC agent file (e.g., `inspirations/ecc/agents/react-reviewer.md`) will be converted into a native skill directory:
*   **Source:** `inspirations/ecc/agents/*.md`
*   **Destination:** `.agents/skills/<agent-name>/SKILL.md`
*   **Action:** 100% automated copy. This instantly gives DannFlow all 68 ECC personas (from `architect`, to `performance-optimizer`, to `flutter-reviewer`).

### 2. The 292 Skills Sync
*   **Source:** `inspirations/ecc/skills/*`
*   **Destination:** `.agents/skills/*`
*   **Action:** Direct `cp -r`. We will ingest every single workflow, including:
    *   `agent-architecture-audit`
    *   `ai-first-engineering`
    *   `intent-driven-development`
    *   `taste-application`
    *   `cost-aware-llm-pipeline`
    *   *...and 280+ more.*

---

## Phase 2: The Command Library Migration
ECC has 94 slash commands designed to automate workflows.

*   **Source:** `inspirations/ecc/commands/*.md`
*   **Destination:** `.claude/commands/` (and mapped to `.codex/commands/`)
*   **Modification:** 95% of these commands are tech-agnostic (e.g., `/plan`, `/review`, `/test`). We will copy them directly. For the 5% that run specific Node scripts (e.g., `/ecc-update`), we will point them to DannFlow's equivalent scripts.
*   **Codex Native Sync:** We will also copy ECC's native `.codex/` folder to ensure Codex's `config.toml` and specific agent configurations are fully updated alongside the Claude commands.

---

## Phase 3: The Rules & Hooks Injection
ECC uses extremely powerful hooks and context rules (`.claude/rules/node.md`, `hookify-rules`).

### 1. Global Context Rules
*   **Source:** `inspirations/ecc/.claude/rules/*.md`
*   **Destination:** `.agents/rules/`
*   **Action:** We will import ECC's rule definitions, but we will ensure they do not override DannFlow's `AGENTS.md` (which enforces Next.js 16 and Supabase). ECC's rules will act as *additive* context (e.g., how to write clean code, how to defend against prompt injection).

### 2. The Hook System (The Brain)
ECC uses JavaScript hooks (`scripts/hooks/`) to intercept AI actions, monitor costs, and trigger workflows (like the `Loop Operator`).
*   **Action:** We will copy the `inspirations/ecc/scripts/hooks/` directory into `scripts/ecc-hooks/`.
*   **Integration:** We will update `.claude.json` / `.mcp.json` in DannFlow to route events through these hooks. This brings ECC's "Instincts", "Cost Tracking", and "Security Guardrails" directly into DannFlow.

---

## Phase 4: The 1% Exclusion (What we won't copy)
To guarantee we **DO NOT BREAK DannFlow**, we will intentionally exclude or modify ~1% of ECC:
1.  **Package.json Overwrites:** We will not replace DannFlow's `package.json` with ECC's. DannFlow needs Next.js, React, and Supabase. ECC's utility packages (like `c8`, `markdownlint`) will be safely appended to `devDependencies` instead.
2.  **Linting Conflicts:** We will keep DannFlow's Next.js ESLint config, but we will merge ECC's security linting rules into it.
3.  **Database Assumptions:** ECC has skills for Django, PHP, etc. We will keep those skills (they don't hurt), but DannFlow's `AGENTS.md` will strictly force the AI to use Supabase for this specific project.

---

## Phase 5: Post-Migration Agent Factory
Once the 99% ECC migration is successfully merged and stable, we will transition from *migrating* agents to *creating brand new ones* specifically tailored to supercharge DannFlow's workflow.

### ✅ 1. AI Chief of Staff (Prompt Dispatcher)
*   **Responsibility:** Acts as your personal AI secretary to convert raw, lazy thoughts into highly optimized workflows. It scans the 158 commands and 360 skills to find the perfect match, proposes a plan, and waits for your approval.

### ✅ 2. AI Healer (Skill Forge & Post-Task Optimizer)
*   **Self-Improving Loop:** If it detects you are asking for a highly repetitive task, or if it cannot find an existing skill that perfectly matches your request, it will proactively suggest: *"This looks like a repetitive workflow. Would you like me to build a permanent Skill for this before we execute it so it's easier next time?"* 
*   **Suggest Agent/Skills or command improvements:** Let say I got frustrated and you can get the right answer, you will suggest to edit the actual agent/skills or command files so less errors as we edit along the way, and make the code better. For example I said I hate what you did, etc etc, you should take note of that, but not every time you suggest an ai edit, just after I approve that the output is correct, the next is you will suggest that "Can I improve an agent/skill/command that is related to this task?".

### ✅ 3. The AI Ecosystem Manager (Conflict Auto-Resolution)
*   Because we just imported hundreds of commands that may assume different tech stacks or reference missing scripts, we will spawn a dedicated agent to clean them up.
*   **Responsibility:** Continually monitor `.claude/`, `.agents/`, and `.codex/` to scan for broken dependencies and auto-remediate commands for 100% Next.js/Supabase compatibility.

### ✅ 4. Auto-Doc Orchestrator
*   **Responsibility:** An agent that strictly monitors `docs/PENDING_DOC_UPDATES.md`. Instead of blocking commits, you can command it to read the ledger, automatically generate the architecture documentation, update `README.md`, and then clear the ledger itself.

### 5. Supabase RLS Guardian ✅
*   **Responsibility:** A specialized agent that runs right before database migrations are deployed. It specifically scans all SQL in `supabase/migrations/` and refuses deployment if any table is missing strict Row Level Security (RLS) policies.

### 6. DannFlow Upstream Synchronizer (Strict Agent)
*   **Responsibility:** A highly intelligent, strict agent that replaces the manual `/sync-upstream` commands. Instead of relying on a static command, this agent intelligently evaluates updates from the main DannFlow repository and safely merges them into downstream apps (vertical SaaS apps built on DannFlow). It ensures that new architectural updates are applied predictably without ever destroying the child application's custom business logic.

---

## Phase 6: The Nervous System (Brain Wiring)
While Phase 3 imported the JavaScript hook scripts into `scripts/ecc-hooks/`, those hooks were never connected to the AI coders' actual configuration. 
*   **Action:** We will generate `.claude.json` and `.mcp.json` configuration files in the repository root.
*   **Responsibility:** These files act as the "nervous system." They will silently intercept every user prompt, run it through the ECC hooks, and dynamically route the prompt to the most specialized agent (e.g., `security-reviewer`, `a11y-architect`) instead of relying on manual slash commands.

---

## Execution Plan
To execute this without human error, we will write a bash script named `scripts/migrate-ecc.sh`. 
This script will safely extract the 360+ markdown files from `inspirations/ecc` and place them precisely into DannFlow's `.agents` and `.claude` folders in under 5 seconds.