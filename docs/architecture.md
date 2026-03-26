# Architecture

The Workforce Intelligence Platform is organized as a Turborepo monorepo with clear separation between the product app, the API, shared packages, analytics SQL, and the Python completion-risk pipeline.

## Layers

- `apps/web`: Next.js 14 App Router frontend with NextAuth, role-aware pages, and accessible UI.
- `apps/api`: Express API with JWT auth, role checks, validation, and the change-request workflow.
- `packages/db`: Drizzle ORM schema, migrations, completion score helper, and typed access to reporting views.
- `packages/shared`: shared enums, zod schemas, and request contracts.
- `packages/ui`: reusable Tailwind-style components inspired by shadcn/ui conventions.
- `analytics/sql`: database views for KPI and reporting support.
- `analytics/python`: completion-risk feature engineering, training, scoring, and exploratory notebook.
- `scripts`: seed data, KPI refresh, reminders, and weekly reporting.

## Core flow

1. Employees submit profile changes.
2. The API stores those as `profile_change_requests`.
3. Managers or admins approve or reject them.
4. Approved changes update `employee_profiles`.
5. Every write action creates an `audit_logs` record.
6. Automation scripts create reminders and KPI snapshots.
7. The Python pipeline scores completion risk and writes results to `engagement_scores`.
