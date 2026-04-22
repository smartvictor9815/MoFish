# MoFish: clone from GitHub and install dependencies (no services started unless -Start).
# One-liner (PowerShell, any directory; trust prompt may appear):
#   irm https://raw.githubusercontent.com/smartvictor9815/MoFish/master/scripts/install.ps1 | iex
# Or:  powershell -NoProfile -ExecutionPolicy Bypass -File path\to\install.ps1

param(
    [string] $Dir = "",
    [string] $Branch = "master",
    [string] $Repo = "https://github.com/smartvictor9815/MoFish.git",
    [switch] $Start
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Dir)) {
    if ($env:INSTALL_DIR) {
        $Dir = $env:INSTALL_DIR
    }
    elseif ($MyInvocation.MyCommand.Path) {
        $scriptsDir = Split-Path $MyInvocation.MyCommand.Path -Parent
        $maybeRoot = Split-Path $scriptsDir -Parent
        if (Test-Path (Join-Path $maybeRoot ".git")) { $Dir = (Resolve-Path $maybeRoot).Path }
        else { $Dir = (Join-Path $env:USERPROFILE "MoFish") }
    }
    else {
        $Dir = (Join-Path $env:USERPROFILE "MoFish")
    }
}

function Test-Command($Name) { return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }
if (-not (Test-Command "git")) { throw "install.ps1: git is required" }
if (-not (Test-Command "npm")) { throw "install.ps1: npm is required" }

$createVenv = $null
if (Test-Command "python") {
    $createVenv = { param($VenvPath) & python -m venv $VenvPath }
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $createVenv = { param($VenvPath) & py -3 -m venv $VenvPath }
} else {
    throw "install.ps1: python (or py launcher) is required"
}

if (Test-Path (Join-Path $Dir ".git")) {
    Write-Host "Updating existing clone: $Dir"
    Push-Location $Dir
    try {
        git fetch origin $Branch 2>$null
        git checkout $Branch 2>$null
        git pull --ff-only origin $Branch
        if ($LASTEXITCODE -ne 0) { git pull --ff-only }
    } finally { Pop-Location }
}
elseif (-not (Test-Path $Dir)) {
    Write-Host "Cloning into $Dir"
    git clone --depth 1 -b $Branch $Repo $Dir
}
elseif ((Get-ChildItem -Force $Dir -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0) {
    Remove-Item -Recurse -Force $Dir
    Write-Host "Cloning into $Dir"
    git clone --depth 1 -b $Branch $Repo $Dir
}
else {
    throw "install.ps1: $Dir already exists and is not a git clone. Remove it or use -Dir."
}

$Root = (Resolve-Path $Dir).Path
$venvPath = Join-Path $Root "backend\.venv"
$venvPy = Join-Path $Root "backend\.venv\Scripts\python.exe"

Push-Location $Root
try {
    Write-Host "Python venv + pip (backend)…"
    if (-not (Test-Path $venvPy)) { & $createVenv $venvPath }
    & $venvPy -m pip install -U pip 2>&1 | Out-Null
    & $venvPy -m pip install -r (Join-Path $Root "backend\requirements.txt")

    Write-Host "npm install (root)…"
    npm install
}
finally { Pop-Location }

Write-Host ""
Write-Host "Install finished: $Root"
Write-Host "  Start:  scripts\start.bat"
Write-Host "  Stop:   scripts\stop.bat"

if ($Start) {
    $bat = Join-Path $Root "scripts\start.bat"
    & $bat
}
