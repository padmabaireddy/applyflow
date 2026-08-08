# ApplyFlow

Full-stack job application tracker with Kanban pipeline, dashboard analytics, and follow-up reminders.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=flat&logo=render)](https://applyflow-m6ak.onrender.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

**Live Demo:** https://applyflow-m6ak.onrender.com  
**Login password:** `demo` (writes require login; reads are open)

> Portfolio / demo project with seeded sample data only. Do not commit real application records, notes, recruiter contacts, or salary details.

## Screenshots

### Dashboard
![Dashboard — stats, follow-ups, pipeline analytics](docs/dashboard-preview.png)

### Kanban
![Kanban — drag applications across pipeline stages](docs/kanban-preview.png)

### List
![List — searchable table with inline status updates](docs/list-preview.png)

## Features

- CRUD for job applications (auth-protected writes)
- Status pipeline with drag-and-drop Kanban
- Search and status filters
- Dashboard metrics, pipeline analytics, follow-up reminders
- Reminder digest with optional Slack/email webhook (`REMINDER_WEBHOOK_URL`)
- Seeded demo data on first launch
- SQLite locally; PostgreSQL in production via `DATABASE_URL`

## Architecture & tech stack

```
┌─────────────────┐     REST/JSON      ┌──────────────────┐
│  React + Vite   │ ◄────────────────► │  FastAPI (API)   │
│  TypeScript     │                    │  SQLAlchemy ORM  │
│  Tailwind CSS   │                    └────────┬─────────┘
└─────────────────┘                             │
        ▲                                       ▼
        │ SPA static files          ┌──────────────────┐
        └───────────────────────────│ SQLite / Postgres│
              (same Render service) └──────────────────┘
```

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, Pydantic, SQLAlchemy 2 |
| Auth | JWT (`python-jose`), password-gated writes |
| Database | SQLite (local) · PostgreSQL (production) |
| Deploy | Single Render web service: API + built SPA |

Frontend talks to `/api/*`. In production the Vite build is copied into `backend/static` and served by FastAPI, so one URL hosts both UI and API.

## Setup

**Requirements:** Python 3.13+, Node 20+

```bash
# Backend
cd backend
python3.13 -m venv venv
./venv/bin/pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
./venv/bin/uvicorn app.main:app --reload --app-dir .

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

| Service | URL |
|---|---|
| API | http://127.0.0.1:8000 |
| App | http://127.0.0.1:5173 |
| Health | http://127.0.0.1:8000/api/health |

Optional env vars: `DEMO_PASSWORD`, `AUTH_SECRET`, `DATABASE_URL`, `CORS_ORIGINS`, `REMINDER_WEBHOOK_URL`.

## Deploy

Blueprint: [`render.yaml`](render.yaml). Set secrets in the Render dashboard:

| Variable | Purpose |
|---|---|
| `DEMO_PASSWORD` | Login password (default `demo`) |
| `AUTH_SECRET` | JWT signing secret |
| `DATABASE_URL` | Optional Neon/Postgres URL |
| `REMINDER_WEBHOOK_URL` | Optional webhook for reminder digests |
| `CORS_ORIGINS` | `*` or your frontend origin |

**Manual production build (no Docker):**

```bash
cd frontend && npm ci && npm run build
mkdir -p ../backend/static && cp -r dist/* ../backend/static/
cd ../backend && ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Portfolio blurb

> **ApplyFlow** — Full-stack job application tracker. Track company, role, status, and follow-ups on a Kanban board with search, dashboard analytics, and reminder digests. React, TypeScript, Vite, Tailwind, FastAPI, SQLAlchemy, REST, SQLite/PostgreSQL. Live on Render.  
> Demo: https://applyflow-m6ak.onrender.com · Code: https://github.com/padmabaireddy/applyflow

**Resume one-liner:** Built ApplyFlow, a React/TypeScript + FastAPI job tracker with Kanban pipeline, analytics, and auth-protected writes (live on Render).
