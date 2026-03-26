# Setup

## Local prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+
- Docker + Docker Compose

## Quick start

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Start services with `docker compose up postgres`.
4. Run database migrations.
5. Run `npm run db:seed`.
6. Start the app with `npm run dev`.

## Running with Docker Compose

Use `docker compose up --build` to start Postgres, the API, and the web app together for local development.
