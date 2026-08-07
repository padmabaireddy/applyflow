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

Deploy with the included `Dockerfile` / `render.yaml` (Render free web service). After deploy, put your URL here:

**Demo:** _pending deploy — connect this repo to [Render](https://render.com) with `render.yaml`, or:_

```bash
docker build -t applyflow .
docker run -p 8000:8000 applyflow
# open http://127.0.0.1:8000
```

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
