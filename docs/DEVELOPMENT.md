# Development Guide

## Prerequisites

- Node.js 18+
- Python 3.11+ (or current compatible version in your environment)

## Start Frontend

```bash
npm i
npm run dev
```

Default URL: `http://127.0.0.1:3000`

## Start Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Default URL: `http://127.0.0.1:8000`

## Backend Environment

Copy template if needed:

```bash
cp backend/.env.example backend/.env
```

Important variables:

- `DATABASE_URL`
- `SECRET_KEY`
- `SYSTEM_TIMEZONE` (default `Asia/Shanghai`)
- `ALLOWED_ORIGINS`

## Initialize System

- Fresh database starts with no users.
- Open login page and initialize first admin user.
- Username is fixed as `admin` and cannot be changed.

## Run Tests

```bash
cd backend
python -m unittest discover -s tests/api -p "test_*.py" -v
python -m unittest discover -s tests/cli -p "test_*.py" -v
```

## Build Frontend

```bash
npm run build
```
