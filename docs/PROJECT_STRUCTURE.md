# Project Structure Standard

## Goal

Define a consistent structure for frontend, backend API, backend CLI, and shared domain logic.

## Frontend (`src/`)

Recommended organization:

```text
src/
├─ app/
│  ├─ components/        # Page and UI composition
│  ├─ routes.tsx         # Route registration and guards
│  └─ App.tsx            # App shell
├─ lib/                  # API clients, session helpers, shared utils
└─ styles/               # Global style files
```

Rules:

- Keep API requests in `lib/` wrappers.
- Keep route guards centralized in `routes.tsx`.
- Avoid direct data access in low-level UI components.

## Backend API (`backend/app/`)

```text
backend/app/
├─ api/                  # Route definitions
├─ core/                 # Settings, security, timezone
├─ db/                   # DB session/base/init utilities
├─ deps/                 # FastAPI dependencies
├─ models/               # ORM models
├─ schemas/              # Pydantic models
└─ services/             # App-level support services (e.g. audit logging)
```

Rules:

- Route files validate requests and orchestrate operations.
- Core business logic should be in `backend/domain/services`.
- Keep transport concerns (HTTP status, request objects) in `api/`.

## Backend Domain (`backend/domain/`)

```text
backend/domain/
└─ services/             # Business use-cases reusable by API/CLI
```

Rules:

- Domain services should not depend on FastAPI request objects.
- API and CLI both call domain services for consistency.

## Backend CLI (`backend/cli/`)

```text
backend/cli/
├─ commands/             # Subcommands
├─ adapters/             # Console/file adapters
└─ main.py               # CLI entrypoint
```

Rules:

- Command handlers stay thin.
- Shared business actions go through domain services.

## Tests (`backend/tests/`)

```text
backend/tests/
├─ api/                  # API behavior tests
└─ cli/                  # CLI command tests
```

Rules:

- Add tests by feature area.
- Prefer isolated tests with mocks for command-layer behavior.
