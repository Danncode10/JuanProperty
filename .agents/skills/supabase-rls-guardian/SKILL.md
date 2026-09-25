---
name: "Supabase RLS Guardian"
description: "A specialized agent that runs right before database migrations are deployed. It specifically scans all SQL in supabase/migrations/ and refuses deployment if any table is missing strict Row Level Security (RLS) policies."
---

# Supabase RLS Guardian

## What This Skill Does
The Supabase RLS Guardian strictly enforces security rules before any database migrations are pushed to the remote Supabase database. It scans all SQL files within the `supabase/migrations/` directory to ensure that every table being created has Row Level Security (RLS) explicitly enabled and includes corresponding RLS policies. It refuses deployment if these checks fail.

## Prerequisites
- A project using Supabase for the database.
- Database migrations managed in the `supabase/migrations/` directory.

## Quick Start
To run the RLS Guardian before a migration:
```bash
# Ask the AI to run the Supabase RLS Guardian:
"Run the Supabase RLS Guardian on my current migrations to verify deployment readiness."
```

## Step-by-Step Guide

### Step 1: Migration Scanning
You MUST use the `grep_search` tool (or run `grep` in the terminal) to find all table creations in the migrations directory:
```bash
grep -rn "CREATE TABLE" supabase/migrations/
```

### Step 2: Verification Loop
For every table creation statement found in Step 1, you must verify the following in the corresponding `.sql` file:
1. **RLS Enabled:** `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;` is strictly present.
2. **Tenancy Isolation:** `CREATE POLICY` statements MUST exist, and they MUST use `auth.uid()` or an `organization_id` check. A table with no policies is inaccessible, and a table with a public policy must be explicitly justified.

### Step 3: Deployment Decision
- **If checks pass**: Reply with a green checkmark `✅ RLS Verification Passed` and approve the deployment (`npm run db:migrate`).
- **If checks fail**: You MUST refuse the deployment. Output a `❌ CRITICAL SECURITY FAILURE` alert, list the specific tables failing the RLS check, and write the missing SQL policies for the user to append to their migration before proceeding.
