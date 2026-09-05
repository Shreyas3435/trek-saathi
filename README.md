# Trek Platform

A centralized discovery and booking platform for trekking in India, starting with
Karnataka / the Western Ghats. Three roles — trekker, trek organizer, platform
admin — share one FastAPI + Postgres backend and one React + TypeScript frontend.

MVP booking is a request model (organizer confirms manually); no payments,
notifications, or real-time seat locking yet — see the project brief for the
full list of deliberate MVP exclusions and locked-in architecture decisions.

## Structure

```
backend/    FastAPI + SQLAlchemy 2.0 + Alembic + PostgreSQL — see backend/README.md
frontend/   React 18 + TypeScript + Vite + Tailwind CSS v3    — see frontend/README.md
```

## Quick start

1. `backend/`: create a venv, `pip install -r requirements.txt`, copy `.env.example`
   to `.env` and point `DATABASE_URL` at a real Postgres instance, then
   `alembic upgrade head` and optionally `python -m scripts.seed` for sample data.
2. `frontend/`: `npm install`, copy `.env.example` to `.env`.
3. Run both (`uvicorn app.main:app` in `backend/`, `npm run dev` in `frontend/`)
   and open http://localhost:5173.

Seeded accounts (all passwords `password123`): `trekker@trekplatform.dev`,
`organizer1@trekplatform.dev` / `organizer2@trekplatform.dev`,
`admin@trekplatform.dev`.

## Deploying

Split hosting is the recommended path — the frontend is a static Vite build
(Vercel), the backend is a long-running process that doesn't fit Vercel's
serverless model (Railway, Render, or Fly.io), and the database is managed
Postgres (Neon, Supabase, or the backend host's own addon). Full details in
each package's README.
