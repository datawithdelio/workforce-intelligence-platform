# Workforce Intelligence Platform

Workforce Intelligence Platform is a full-stack HR employee portal built as a Turborepo monorepo. It combines a role-based employee workflow, a manager approval queue, KPI dashboards, automation scripts, and a lightweight data-science feature for completion-risk scoring.

## Stack

- Monorepo: Turborepo
- Frontend: Next.js 14 App Router + TypeScript
- Backend: Express + TypeScript
- Database: PostgreSQL + Drizzle ORM
- Shared packages: `packages/shared`, `packages/ui`
- Analytics SQL: `analytics/sql`
- Data science: `analytics/python`
- Testing: Vitest + React Testing Library
- Local dev: Docker Compose

## Project structure

```text
workforce-intelligence-platform/
├── apps/
│   ├── api/
│   └── web/
├── analytics/
│   ├── python/
│   └── sql/
├── docs/
├── packages/
│   ├── db/
│   ├── shared/
│   └── ui/
├── scripts/
├── docker-compose.yml
├── turbo.json
└── README.md
```

## Setup

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Start Postgres:

   ```bash
   docker compose up postgres -d
   ```

4. Run migrations:

   ```bash
   npm run db:migrate
   ```

5. Seed the database:

   ```bash
   npm run db:seed
   ```

6. Start the web and API apps:

   ```bash
   npm run dev
   ```

## Environment variables

- `DATABASE_URL` e.g. `postgresql://workforce:workforce@localhost:5433/workforce_intelligence`
- `API_PORT`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_API_URL`
- `API_INTERNAL_URL`
- `WEB_APP_URL`

## Useful scripts

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run kpis:refresh
npm run notify:remind
npm run summary:weekly
npm run test
```

## Running the data-science pipeline

From `analytics/python`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
make train
make score
make pipeline
```

If `.venv` exists, the `Makefile` will use it automatically.

## Running tests

```bash
npm run test --workspace @workforce/api
npm run test --workspace @workforce/web
```

## Key product rules

- Employees never directly update their profile.
- Profile edits become change requests first.
- Managers or admins approve or reject each request.
- Private fields are not returned to unauthorized viewers.
- Every write action creates an audit log entry.

## Data-science feature

The Python pipeline predicts profile completion risk using five non-protected signals:

- completion score
- days since last update
- pending change request count
- approved changes in the last 30 days
- login count in the last 30 days

Predictions are stored in `engagement_scores` with:

- `score`
- `risk_level`
- `explanation`

## Accessibility and DAV UX

The UI follows DAV-aware rules:

- visible labels
- large tap targets
- plain-language status text
- icons plus text for status
- logical heading hierarchy
- mobile-first layouts
- visible focus rings

## Documentation

- [Architecture](./docs/architecture.md)
- [Setup](./docs/setup.md)
- [DAV UX](./docs/DAV-ux.md)
- [Submission](./docs/submission.md)
