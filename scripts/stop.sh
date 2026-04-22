#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
BACKEND_PID_FILE="$RUN_DIR/backend.pid"
FRONTEND_PID_FILE="$RUN_DIR/frontend.pid"

stop_pid_file() {
  local pid_file="$1"
  local name="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "$name not running (pid file missing)."
    return
  fi

  local pid
  pid="$(cat "$pid_file")"
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping $name (pid: $pid)..."
    kill "$pid" 2>/dev/null || true
    sleep 1
    if kill -0 "$pid" 2>/dev/null; then
      echo "Force killing $name (pid: $pid)..."
      kill -9 "$pid" 2>/dev/null || true
    fi
    echo "$name stopped."
  else
    echo "$name process already exited."
  fi

  rm -f "$pid_file"
}

stop_pid_file "$FRONTEND_PID_FILE" "Frontend"
stop_pid_file "$BACKEND_PID_FILE" "Backend"

kill_port_processes() {
  local port="$1"
  local name="$2"
  local pids
  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Stopping $name port listeners on :$port ($pids)..."
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1
    local remaining
    remaining="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    if [[ -n "$remaining" ]]; then
      echo "Force killing remaining :$port processes ($remaining)..."
      # shellcheck disable=SC2086
      kill -9 $remaining 2>/dev/null || true
    fi
  fi
}

kill_port_processes "3000" "Frontend"
kill_port_processes "8000" "Backend"

echo "Done."
