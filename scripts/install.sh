#!/usr/bin/env bash
# MoFish: clone from GitHub and install dependencies (no services started unless --start).
# One-liner (after the repo is on GitHub):
#   curl -fsSL https://raw.githubusercontent.com/smartvictor9815/MoFish/master/scripts/install.sh | bash
# Options via env: REPO, BRANCH, INSTALL_DIR
set -euo pipefail

REPO="${REPO:-https://github.com/smartvictor9815/MoFish.git}"
BRANCH="${BRANCH:-master}"
ENV_INSTALL_DIR="${INSTALL_DIR-}"
INSTALL_DIR=""
DIR_FROM_CLI=0
START_AFTER=0

usage() {
  cat <<'EOF'
Usage: install.sh [options]

  Clones MoFish (or updates an existing clone), creates the Python venv, and runs npm install.

  Options:
    --dir <path>   Project directory (default: see below)
    --branch <b>   Git branch (default: master)
    --start        Run scripts/start.sh after install
    -h, --help     Show this help

  Default directory:
    1) --dir, or INSTALL_DIR; else
    2) the repo root if you run this file as scripts/install.sh from a clone; else
    3) ~/MoFish

  Environment (optional):
    REPO=           Clone URL (default: https://github.com/smartvictor9815/MoFish.git)
    BRANCH=         Same as --branch
    INSTALL_DIR=    Same as --dir

  One-liner from the network:
    curl -fsSL https://raw.githubusercontent.com/smartvictor9815/MoFish/master/scripts/install.sh | bash
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)
      [[ $# -ge 2 ]] || { echo "install.sh: --dir needs a value" >&2; exit 1; }
      INSTALL_DIR="$2"
      DIR_FROM_CLI=1
      shift 2
      ;;
    --branch)
      [[ $# -ge 2 ]] || { echo "install.sh: --branch needs a value" >&2; exit 1; }
      BRANCH="$2"
      shift 2
      ;;
    --start) START_AFTER=1; shift ;;
    -h | --help) usage; exit 0 ;;
    *)
      echo "install.sh: unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "$DIR_FROM_CLI" -eq 0 ]]; then
  if [[ -n "${ENV_INSTALL_DIR}" ]]; then
    INSTALL_DIR="$ENV_INSTALL_DIR"
  else
    _self="${BASH_SOURCE[0]:-}"
    if [[ -n "$_self" && -f "$_self" ]]; then
      _maybe_root="$(cd "$(dirname "$_self")/.." && pwd)"
      if [[ -d "$_maybe_root/.git" ]]; then
        INSTALL_DIR="$_maybe_root"
      else
        INSTALL_DIR="${HOME}/MoFish"
      fi
    else
      INSTALL_DIR="${HOME}/MoFish"
    fi
  fi
fi

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "install.sh: required command not found: $1" >&2
    exit 1
  }
}

need_cmd git
need_cmd python3
need_cmd npm

if [[ -d "$INSTALL_DIR/.git" ]]; then
  echo "Updating existing clone: $INSTALL_DIR"
  git -C "$INSTALL_DIR" fetch origin "$BRANCH" 2>/dev/null || true
  git -C "$INSTALL_DIR" checkout "$BRANCH" 2>/dev/null || true
  git -C "$INSTALL_DIR" pull --ff-only origin "$BRANCH" || git -C "$INSTALL_DIR" pull --ff-only
elif [[ ! -e "$INSTALL_DIR" ]]; then
  echo "Cloning into $INSTALL_DIR"
  git clone --depth 1 -b "$BRANCH" "$REPO" "$INSTALL_DIR"
elif [[ -d "$INSTALL_DIR" && -z "$(ls -A "$INSTALL_DIR" 2>/dev/null || true)" ]]; then
  rmdir "$INSTALL_DIR"
  echo "Cloning into $INSTALL_DIR"
  git clone --depth 1 -b "$BRANCH" "$REPO" "$INSTALL_DIR"
else
  echo "install.sh: $INSTALL_DIR already exists and is not a git clone. Remove it or use --dir." >&2
  exit 1
fi

ROOT_DIR="$(cd "$INSTALL_DIR" && pwd)"
cd "$ROOT_DIR"

echo "Python venv + pip (backend)…"
if [[ ! -d backend/.venv ]]; then
  python3 -m venv backend/.venv
fi
backend/.venv/bin/python -m pip install -U pip >/dev/null
backend/.venv/bin/python -m pip install -r backend/requirements.txt

echo "npm install (root)…"
npm install

echo ""
echo "Install finished: $ROOT_DIR"
echo "  Start:  bash scripts/start.sh   or   source scripts/start.sh"
echo "  Stop:   bash scripts/stop.sh"

if [[ "$START_AFTER" -eq 1 ]]; then
  echo ""
  exec bash scripts/start.sh
fi
