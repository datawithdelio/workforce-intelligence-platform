# Deployment Guide

This project is ready to deploy with:

- `Vercel` for the Next.js frontend
- `Railway` for the Express API and PostgreSQL
- `Render` as a fallback option for the API if you prefer Docker-based deployment

## Recommended architecture

- Frontend: `apps/web` on Vercel
- API: monorepo root on Railway, running the `@workforce/api` workspace
- Database: managed PostgreSQL on Railway

## Frontend on Vercel

Create a Vercel project connected to this GitHub repo and set the project root directory to `apps/web`.

Recommended settings:

- Framework preset: `Next.js`
- Root directory: `apps/web`
- Install command: `cd ../.. && npm install`
- Build command: `cd ../.. && npm run build --workspace @workforce/web`

Frontend environment variables:

- `NEXTAUTH_URL` = your Vercel production URL
- `NEXTAUTH_SECRET` = long random secret
- `NEXT_PUBLIC_API_URL` = `https://your-api-domain/api/v1`
- `API_INTERNAL_URL` = `https://your-api-domain/api/v1`

After deployment, also set:

- `WEB_APP_URL` in the API service to your Vercel frontend URL
- `NEXTAUTH_URL` in the API service to the same Vercel frontend URL

## API and PostgreSQL on Railway

Create a Railway project from this repo and deploy from the repository root.

Recommended API service settings:

- Root directory: `/`
- Build command: `npm install && npm run build --workspace @workforce/api`
- Start command: `npm run start --workspace @workforce/api`
- Health check path: `/health`

Create a PostgreSQL service in the same Railway project and connect:

- `DATABASE_URL` = Railway Postgres connection string

API environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` = your Vercel frontend URL
- `WEB_APP_URL` = your Vercel frontend URL

Notes:

- The API reads `PORT` automatically in production, so Railway can assign its own port.
- The repository includes a root-level `railway.json` with the workspace build and start commands.

## Render fallback

If you prefer Render for the API:

- deploy the API using the repo root and `apps/api/Dockerfile`
- provision a managed PostgreSQL database
- set the same API environment variables listed above

The repository includes a root-level `render.yaml` as a starting point for a Render blueprint.

## Post-deploy checklist

1. Run database migrations against the production database
2. Seed initial data if you want demo users in production
3. Update GitHub with live demo links
4. Add the live URL to your resume and LinkedIn project section
5. Replace placeholder demo credentials if you keep a public deployment
