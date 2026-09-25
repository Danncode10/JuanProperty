# Rule: Template vs. Child Repository Relationship

When operating across repositories (e.g., using `dannflow-synchronizer`), you must explicitly understand the semantic difference between the **DannFlow Template** and a **Child Application (Vertical)**.

## 1. The Template (DannFlow)
- This is the generic, foundational layer. 
- It provides authentication, CI/CD, database sync patterns, and core agent skills.
- It does **not** contain industry-specific copy, vertical branding, or specialized RBAC roles.

## 2. The Child App (e.g., JuanConstruction, AttyJuan)
- This is a highly specialized product built on top of the template.
- It is **expected and desired** for a Child App to diverge from the Template in its business logic (`src/`, `supabase/`).
- If a Child App modifies copy (e.g., `hero.tsx`), styling (`globals.css`), or roles (`roles.json`), these are **Healthy Specializations (💎)**, not warnings or errors.

## 3. Synchronization & Analysis
When analyzing drift between the two:
- **Do not warn** about child-specific copy or branding. Preserve it.
- **Deep LLM Analysis is Required** for complex logic drifts (e.g., Auth, Services). You must read the code (using tools like `view_file` or `diff`) to classify the change:
  - Is it a **Template Upgrade** (e.g., a security patch in DannFlow)? -> *Recommend Sync-Upstream.*
  - Is it a **Beneficial Child Feature** (e.g., the child built a much better generic UI component)? -> *Recommend Sync-to-Upstream.*
  - Is it a **Vertical Specialization** (e.g., child added specific industry fields to a login form)? -> *Preserve/Ignore.*
