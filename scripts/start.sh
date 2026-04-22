#!/usr/bin/env bash
set -euo pipefail

# Resolve project root for bash, zsh, and whether this file is run or sourced.
# (Sourcing in zsh does not set BASH_SOURCE, so BASH_SOURCE[0] is invalid there.)
if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
  _SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
elif [[ -n "${ZSH_VERSION:-}" ]]; then
  # zsh: path of the file being parsed
  # shellcheck disable=SC2296
  _SCRIPT_DIR="$(cd "$(dirname "${(%):-%x}")" && pwd)"
else
  _SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
fi
ROOT_DIR="$(cd "$_SCRIPT_DIR/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
LOG_DIR="$RUN_DIR/logs"
BACKEND_PID_FILE="$RUN_DIR/backend.pid"
FRONTEND_PID_FILE="$RUN_DIR/frontend.pid"

mkdir -p "$RUN_DIR" "$LOG_DIR"

is_running() {
  local pid="$1"
  if [[ -z "${pid:-}" ]]; then
    return 1
  fi
  kill -0 "$pid" 2>/dev/null
}

free_port_if_occupied() {
  local port="$1"
  local name="$2"
  local pids

  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "$name port :$port is occupied, stopping existing process(es): $pids"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1

    local remaining
    remaining="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    if [[ -n "$remaining" ]]; then
      echo "Force killing remaining process(es) on :$port: $remaining"
      # shellcheck disable=SC2086
      kill -9 $remaining 2>/dev/null || true
    fi
  fi
}

start_backend() {
  if [[ -f "$BACKEND_PID_FILE" ]] && is_running "$(cat "$BACKEND_PID_FILE")"; then
    echo "Backend pid file exists (pid: $(cat "$BACKEND_PID_FILE")), restarting backend..."
  fi
  free_port_if_occupied "8000" "Backend"
  rm -f "$BACKEND_PID_FILE"

  if [[ ! -d "$ROOT_DIR/backend/.venv" ]]; then
    echo "Creating backend virtualenv..."
    python3 -m venv "$ROOT_DIR/backend/.venv"
  fi

  echo "Installing backend dependencies..."
  # Use the venv interpreter so this works when the script is sourced in zsh
  # (activate is bash-oriented; `pip` may not land on PATH).
  "$ROOT_DIR/backend/.venv/bin/python" -m pip install -r "$ROOT_DIR/backend/requirements.txt" >/dev/null

  echo "Starting backend..."
  nohup bash -lc "cd \"$ROOT_DIR/backend\" && source .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000" \
    >"$LOG_DIR/backend.log" 2>&1 &
  echo $! >"$BACKEND_PID_FILE"
  echo "Backend started (pid: $(cat "$BACKEND_PID_FILE"))."
}

start_frontend() {
  if [[ -f "$FRONTEND_PID_FILE" ]] && is_running "$(cat "$FRONTEND_PID_FILE")"; then
    echo "Frontend pid file exists (pid: $(cat "$FRONTEND_PID_FILE")), restarting frontend..."
  fi
  free_port_if_occupied "3000" "Frontend"
  rm -f "$FRONTEND_PID_FILE"

  echo "Installing frontend dependencies..."
  (cd "$ROOT_DIR" && npm install >/dev/null)

  echo "Starting frontend..."
  nohup bash -lc "cd \"$ROOT_DIR\" && npm run dev -- --host 127.0.0.1 --port 3000" \
    >"$LOG_DIR/frontend.log" 2>&1 &
  echo $! >"$FRONTEND_PID_FILE"
  echo "Frontend started (pid: $(cat "$FRONTEND_PID_FILE"))."
}

start_backend
start_frontend

echo ""
echo "Services are starting."
echo "Frontend: http://127.0.0.1:3000"
echo "Backend:  http://127.0.0.1:8000"
echo "Logs: $LOG_DIR"
