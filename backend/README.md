# Trek Platform — Backend

FastAPI + SQLAlchemy 2.0 + PostgreSQL backend for Trek Platform.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env         # then edit DATABASE_URL / SECRET_KEY
```

## Database

```bash
alembic upgrade head
python -m scripts.seed          # optional: sample destinations/organizers/treks
```

## Run

```bash
uvicorn app.main:app --reload
```

Note: `--reload` uses a filesystem watcher that can miss changes in OneDrive-synced
folders. If edits don't seem to take effect, stop the process and restart without
`--reload`.

## Tests

```bash
pytest
```

Covers the seat-availability logic in `app/services/booking_service.py`.

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Project layout

See `app/models/models.py` for the data model, `app/api/v1/` for routes, and
`app/services/booking_service.py` for the booking/seat-availability logic.

## Deploying

This is a long-running FastAPI process (sync SQLAlchemy connection pool), not a
serverless function — it needs a host built for that: Railway, Render, or Fly.io
all work with no code changes. `Procfile` defines the start command
(`alembic upgrade head` then `uvicorn`), which Railway/Render pick up automatically.

Required environment variables on the host:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Managed Postgres — Neon, Supabase, or the host's own Postgres addon |
| `SECRET_KEY` | Generate with `python -c "import secrets; print(secrets.token_urlsafe(64))"` — never reuse the `.env.example` placeholder |
| `CORS_ORIGINS` | The deployed frontend's URL (comma-separated if more than one) — the default `http://localhost:5173` will block every request from production |

Don't run `alembic upgrade head` manually against production outside the deploy
step, and don't fall back to `Base.metadata.create_all` shortcuts.
