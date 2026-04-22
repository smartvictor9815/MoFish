
# HappyWork

This is the HappyWork project codebase.

## Project docs

- Architecture: `docs/ARCHITECTURE.md`
- Structure standard: `docs/PROJECT_STRUCTURE.md`
- Development guide: `docs/DEVELOPMENT.md`

## Frontend (Vite + React)

1. Install dependencies:

```bash
npm i
```

2. Start frontend:

```bash
npm run dev
```

The frontend proxies `/api` requests to `http://127.0.0.1:8000` in development.

## One-command start/stop

From project root:

```bash
./scripts/start.sh
./scripts/stop.sh
./scripts/restart.sh
```

- `start.sh` starts backend (`8000`) and frontend (`3000`) and writes PID files/logs in `.run/`.
- `stop.sh` stops both services using PID files.

For Windows (Command Prompt):

```bat
scripts\start.bat
scripts\stop.bat
scripts\restart.bat
```

- `start.bat`/`stop.bat` provide the same behavior for Windows, including port-occupancy cleanup for `3000` and `8000`.

## Backend (FastAPI)

1. Create a virtual environment and install dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. (Optional) copy environment template:

```bash
cp .env.example .env
```

3. Start backend:

```bash
uvicorn app.main:app --reload
```

## Backend CLI (Phase 2 scaffold)

Run from `backend` directory:

```bash
python -m cli.main users list
python -m cli.main logs list --limit 20
python -m cli.main auth login --username admin --password hw12345
python -m cli.main sync run --source legacy
```

## First login initialization

- A fresh system starts with no users.
- On first visit to the login page, the app requires initializing the `admin` account password.
- After initialization, the system enters normal login mode.

## Run backend tests

Run from `backend` directory after installing Python dependencies:

```bash
python -m unittest discover -s tests/api -p "test_*.py" -v
python -m unittest discover -s tests/cli -p "test_*.py" -v
```
  