# DannFlow Coding Style

> **Core Philosophy:** DannFlow is a high-performance Next.js starter optimized for AI-native development. Code must be highly modular, explicitly typed, and cleanly separated.

## 1. Repository Identity (Template vs. Child Project)
Before writing any code, determine if you are working in **Template Mode** or **Project Mode** based on Git remotes and the folder name:
- **Template Mode:** The repository is `Dannflow`/`DannFlow`. Keep code generic. Do NOT add client names, specific product requirements, or hardcoded Supabase project IDs. This code must be reusable for future projects.
- **Project Mode:** A SaaS project built from DannFlow. Add business-specific logic here.

## 2. Separation of Concerns (CRITICAL)
- **UI Layer (`/components/`, `/app/`):** UI components must **NOT** contain database logic, Supabase queries, or direct API calls. They handle state, render data, and capture events.
- **Logic Layer (`/src/services/`):** All business logic and Supabase database interactions MUST live strictly within `src/services/`.
- **Types (`/src/types/`):** Rely completely on the generated `supabase.ts` definitions. Never use `any`.

## 3. Tech Stack Execution
- **React:** Favor React Server Components (RSC) for data fetching. Only use `'use client'` when interactivity (hooks, state, browser APIs) is strictly required. Use Functional Components.
- **Async/Await:** Use modern `async/await` for all asynchronous operations. Do not use `.then()` chains.
- **CSS / Styling:** Use Tailwind CSS exclusively.

## 4. Code Quality & Modularity
- **DRY & SOLID:** Extract repeatable logic into reusable custom hooks (`/hooks/`) or utility functions (`/lib/`). Do not write spaghetti code.
- **Error Handling:** Never swallow errors silently. Catch them, log context, and display user-friendly error states (e.g., using `text-destructive`).
- **Feature Blueprints:** Always look in `src/prompts/features/` for a blueprint before starting a new complex feature.
