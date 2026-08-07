# ApplyFlow

Full-stack job application tracker built with React, TypeScript, FastAPI, and PostgreSQL.

Demo / portfolio project — sample or fictional data only. Do not commit real application records, notes, recruiter contacts, or salary details. Local SQLite DBs (`.db`) and secrets (`.env`) are gitignored; never force-add them.

![Kanban board](docs/kanban-preview.png)

## Features

- Add / edit / delete applications
- Status pipeline + drag-and-drop Kanban
- Search & filter
- Dashboard stats, pipeline analytics, follow-up reminders
- Seeded demo data on first launch

## Live demo

No Docker. Deploy on [Render](https://render.com) with **Blueprint** → connect `padmabaireddy/applyflow` (uses `render.yaml`: Python web service builds the Vite app into `backend/static`).

**Demo:** https://applyflow-m6ak.onrender.com

## Local run

```bash
# backend
cd backend
python3.13 -m venv venv
./venv/bin/pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
./venv/bin/uvicorn app.main:app --reload --app-dir .

# frontend
cd frontend
npm install
npm run dev
```

API: http://127.0.0.1:8000  
App: http://127.0.0.1:5173

## Production build (no Docker)

```bash
cd frontend && npm ci && npm run build
mkdir -p ../backend/static && cp -r dist/* ../backend/static/
cd ../backend && ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```
