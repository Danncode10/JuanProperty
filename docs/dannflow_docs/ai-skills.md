# AI Skills & Agent Personas

Following the ECC Migration, DannFlow includes a massive library of 68 Agent Personas and 292 Skills located natively in the `.agents/skills/` directory. This brings advanced capabilities directly into the Next.js/Supabase root without external dependencies.

## Key Capabilities

- **Cost-Aware Pipelines**: Optimize model routing and token usage across your workflows.
- **A11y Architects**: Dedicated agents for ensuring WCAG compliance and accessible design.
- **Security Reviewers**: Advanced static and dynamic security analysis for your codebase.

## The Hook System

Imported from ECC, the new Hook System lives in `scripts/ecc-hooks/`.

The Hook System provides additive guidance and workflow orchestration without overriding the strict architectural boundaries established in `AGENTS.md`.

- **Core Scripts**: Includes cost tracking, instinct loops, and other advanced mechanisms.
- **Integration**: Works seamlessly with the Phase 2 command library to provide context-aware, stateful agent behaviors.
