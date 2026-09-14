# JuanProperty

Welcome to **JuanProperty**, built on the DannFlow SaaS architecture.

## 🚀 Quick Start

### 1. Initialize Context & Vertical DNA
Define your product requirements, audience, and features:
- **For JuanStack Verticals**: Run  in your AI IDE for an interactive setup interview.
- **For Standard SaaS**: Fill out .

### 2. Next Steps with AI Agent
Open this repository in your AI IDE (Claude Code, Antigravity, or Cursor) and follow this sequence:

1. **Configure Repository Origin (if not set):**
   ```bash
   /new-project
   ```
2. **Initialize Masterplan & Connect Database:**
   Create a Kanban GitHub Project board with `Backlog`, `Ready`, `In progress`, and `Done` columns, then run:
   ```bash
   /masterplan-init
   ```
3. **Execute Tasks:**
   ```bash
   /what-task
   ```

### 3. Development Commands

```bash
npm run dev          # Start local dev server (http://localhost:3000)
npm run build        # Build production bundle
npm run db:migrate   # Push Supabase migrations to remote cloud database
npm run db:types     # Sync TypeScript types from database schema
```

### 4. Upstream Syncing
To pull template updates, new commands, and bug fixes from DannFlow without breaking custom code:
```bash
/sync-upstream
```
