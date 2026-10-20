# User Manual

**Project Name:** JuanProperty (Built on DannFlow)
**Date:** 2026-10-20

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

JuanProperty currently provides the Property Owner Registry and Property Management from the authenticated dashboard. Phase 1 functionality is being delivered incrementally; this guide only describes these implemented workflows, not planned unit, lease, tenant, or payment features.

### Manage Property Owners

- **Navigate to:** `/dashboard` → **Property Owners**.
- **Create:** Choose the add-owner action, select Individual or Company, enter a name, and provide any applicable contact or descriptive fields. Company records can include a contact person. Save to add the record to the active directory.
- **Edit:** Open an owner record, change its details, and save. The updated values appear in the directory.
- **Archive:** Use the record's archive action to remove it from the active directory without deleting its history.
- **Restore:** Turn on **Include archived**, find the archived record, and restore it to the active directory.
- **Validation:** A name is required and a provided email must be valid. Correct the inline validation message before saving.

Access is currently limited to the authenticated owner of the associated organization. Organization staff membership is not yet supported. The application does not provide permanent deletion for owner records.

### Manage Properties

- **Navigate to:** `/dashboard` → **Properties**.
- **Create:** Choose **Add property**, enter a property name, type, and address, optionally add a description, and choose an active Property Owner from your organization. Save to add it to the portfolio.
- **Edit:** Open a property, update its details or primary owner, and save. A currently linked archived owner can remain selected while editing; new links must use an active owner.
- **Search:** Search by property name, type, address, or primary owner. The result count updates with the filtered list.
- **Archive:** Choose **Archive** to remove a property from the active list while retaining its history.
- **Restore:** Enable **Include archived**, find the property, and choose **Restore**.
- **Validation:** Name, type, address, and primary owner are required. Correct any inline validation message before saving.

Each property is linked to one primary owner in the same organization. One owner can be linked to multiple properties. Access is currently limited to the authenticated organization owner; Team Members do not see these dashboard tabs. Permanent deletion is not available.

### Manage Property Units

- **Navigate to:** `/dashboard` → **Units**.
- **Create:** Choose **Add unit**, select an active property, enter a unit number or name, and set the default monthly rent in PHP. Floor, bedroom/bathroom counts, and description are optional. Choose the operational state.
- **Edit:** Update a unit's details or operational state. A unit remains attached to its original property so the property's history stays consistent.
- **Search:** Search by unit number/name, property, operational state, or description.
- **Archive:** Choose **Archive** to retain the unit while hiding it from the active list. Enable **Include archived** to restore it later.
- **Operational state:** Active, Maintenance, and Inactive describe the unit's operational condition. Occupancy is determined by future Lease records and is not stored on the unit.
- **Default rent:** The PHP monthly amount is a starting default. A future lease records its own agreed amount, so later changes to the unit default do not change existing lease history.

Units are scoped to the property and organization. Their number/name must be unique within that property. Permanent deletion is not available.
