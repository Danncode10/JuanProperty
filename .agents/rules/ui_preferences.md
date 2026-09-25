# DannFlow UI & Vibe Coding Preferences

> **Core Philosophy:** DannFlow targets SaaS founders who need premium, state-of-the-art UI out of the box. Vibe Coding, high-end visual design, and rigorous aesthetic standards are Non-Negotiable.

## 1. Aesthetic Standards (Vibe Coding)
- **Minimalist & Premium:** Clean editorial-style interfaces. Interfaces must feel responsive, modern, and alive. 
- **Micro-animations:** Incorporate subtle hover effects, active states, and micro-motion for an enhanced user experience.
- **Strict Semantic Colors:** Use ONLY Shadcn/Tailwind semantic tokens (e.g., `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`). **Hardcoding hex codes (e.g., #FFFFFF), rgba, or static color names (like text-gray-500) is a CRITICAL FAILURE.**

## 2. Core UI Requirements
- **Mobile-First Responsiveness:** Every single component MUST be fully responsive down to 375px width. Horizontal scrolling is unacceptable.
- **Touch Targets:** All interactive elements (buttons, inputs, links) must be a minimum of 48px tall to ensure mobile accessibility.
- **Visual Hierarchy:** Use deliberate font weights, typography scales (Inter, Roboto), and spacing scales (`p-4`, `p-6`, `gap-4`, `gap-6`). Do not cram elements together.

## 3. Form & Component Patterns
- **Forms:** Labels must be placed ABOVE inputs, never relying solely on placeholders. Inputs must have clear focus rings using `ring-ring`.
- **Card Wrapping:** Wrap form pages and logical content blocks in Shadcn's `<Card>`, `<CardHeader>`, `<CardContent>`, and `<CardFooter>`.
- **Feedback & States:** 
  - Buttons MUST have a visual loading state.
  - Inputs MUST have visual error states using `text-destructive`.
  - Empty screens MUST NOT be blank (always use a centered icon + helper message).
- **Buttons:** Never use raw HTML `<button>`. Always use the Shadcn `<Button variant="default">`, `<Button variant="outline">`, etc.
