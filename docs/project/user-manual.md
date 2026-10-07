# User Manual

**Project Name:** JuanProperty (Built on DannFlow)
**Date:** 2026-10-07

> **⚠️ REPOSITORY MODE RULE:**
>
> - If you are in the `DannFlow` template repository, **DO NOT** add specific product workflows or custom user instructions here. Keep this file as the generic baseline.
> - If you are in a **Project Mode** repository (built from DannFlow), you **MUST** update this file to reflect your specific application's user workflows.

---

## 1. DannFlow Baseline Interactions

Out of the box, DannFlow provides the following user workflows. _(Update these as your specific application replaces or expands upon them.)_

### Account Creation & Login

- **Navigation:** Users navigate to the `/login` or `/signup` route.
- **Methods:**
  - **OAuth:** Click "Continue with [Provider]" (e.g., Google, GitHub).
  - **Email/Password:** Enter email and a secure password.
- **Post-Login:** Users are redirected based on the logic in the auth callback.

### Profile Management

- **Navigation:** Users can manage their account settings via the profile dropdown.
- **Capabilities:** View account details, update basic profile information (driven by the `profiles` table in Supabase), and securely log out.

## 2. Project-Specific Operational Guide

JuanProperty currently provides the Property Owner Registry from the authenticated dashboard. Phase 1 functionality is being delivered incrementally; this guide only describes the implemented registry, not planned property, lease, tenant, or payment workflows.

### Manage Property Owners

- **Navigate to:** `/dashboard` → **Property Owners**.
- **Create:** Choose the add-owner action, select Individual or Company, enter a name, and provide any applicable contact or descriptive fields. Company records can include a contact person. Save to add the record to the active directory.
- **Edit:** Open an owner record, change its details, and save. The updated values appear in the directory.
- **Archive:** Use the record's archive action to remove it from the active directory without deleting its history.
- **Restore:** Turn on **Include archived**, find the archived record, and restore it to the active directory.
- **Validation:** A name is required and a provided email must be valid. Correct the inline validation message before saving.

Access is currently limited to the authenticated owner of the associated organization. Organization staff membership is not yet supported. The application does not provide permanent deletion for owner records.
