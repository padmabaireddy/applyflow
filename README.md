# ApplyFlow

Full-stack job application tracker built with React, TypeScript, FastAPI, and PostgreSQL.

## Run

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
