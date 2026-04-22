# MoFish Architecture

## Overview

MoFish is a full-stack application with:

- Frontend: Vite + React + React Router
- Backend API: FastAPI + SQLAlchemy
- Backend CLI: Python command-line entrypoints
- Shared backend business logic: `domain/services`

## Top-level Structure

```text
MoFish/
├─ src/                  # Frontend source
├─ backend/
│  ├─ app/               # FastAPI app layer
│  ├─ domain/            # Shared business layer (API/CLI)
│  ├─ cli/               # CLI commands and adapters
│  └─ tests/             # Backend tests
└─ docs/                 # Architecture and conventions
```

## Backend Layering

- `backend/app/`: transport and framework integration
  - `api/`: HTTP routes
  - `deps/`: auth and request dependencies
  - `models/`: SQLAlchemy models
  - `schemas/`: request/response models
  - `core/`: settings, security, timezone
- `backend/domain/`: reusable business services
  - API and CLI should both call this layer.
- `backend/cli/`: command-line wrappers for operations
  - minimal logic, delegates to domain services.

## Timezone Standard

- System timezone is configured as `Asia/Shanghai` (UTC+8).
- Backend writes timestamps using configured system timezone.

## Authentication & Bootstrap

- On empty database, no default users are created on startup.
- First login flow requires bootstrap initialization:
  - fixed username: `admin`
  - password must be set manually
- `admin` username is immutable after creation.

## API Conventions

- API prefix: `/api`
- Authentication: Bearer token
- Error payload: `{"detail": "..."}`
- Main admin modules currently covered:
  - Auth (`/api/auth/*`)
  - Users (`/api/users/*`)
  - Access logs (`/api/access-logs`)

## Testing Strategy

- Backend API tests: `backend/tests/api`
- Backend CLI tests: `backend/tests/cli`
- Frontend verification: build + smoke test via API and routes
