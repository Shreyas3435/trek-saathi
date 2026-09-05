# Trek Platform — Frontend

React 18 + TypeScript + Vite + Tailwind CSS v3 frontend for Trek Platform.

## Setup

```bash
npm install
copy .env.example .env    # then set VITE_API_URL if the backend isn't on localhost:8000
```

## Run

```bash
npm run dev
```

Runs at http://localhost:5173, expects the backend (see `../backend/README.md`) running
and reachable at `VITE_API_URL`.

## Build

```bash
npm run build
```

Type-checks (`tsc --noEmit`) then produces a production build in `dist/`.

## Project layout

- `src/components/` — shared UI (`ui/`), layout (`layout/`), and the two signature
  motif components `TrailLine.tsx` / `ContourField.tsx`.
- `src/pages/` — one file per route, grouped by dashboard (`trekker/`, `organizer/`,
  `admin/`) where relevant.
- `src/queries/` — all TanStack Query hooks, one file per backend resource.
- `src/context/AuthContext.tsx` — JWT-backed auth state.
- `tailwind.config.js` — the design system's color and font tokens (see the project
  brief for the full rationale). Do not upgrade to Tailwind v4 without rewriting the
  theme config to v4's `@theme` syntax.

## Deploying

Deploys to Vercel with zero extra config: set the project's root directory to
`frontend`, framework preset "Vite", build command `npm run build`, output
directory `dist`. Set `VITE_API_URL` in the Vercel project's environment variables
to the deployed backend's URL (see `../backend/README.md` for where that runs) —
without it the app falls back to `http://localhost:8000/api/v1`, which won't exist
in production.
