@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0.."
for %%I in ("%ROOT_DIR%") do set "ROOT_DIR=%%~fI"

set "RUN_DIR=%ROOT_DIR%\.run"
set "BACKEND_PID_FILE=%RUN_DIR%\backend.pid"
set "FRONTEND_PID_FILE=%RUN_DIR%\frontend.pid"

call :stopFromPidFile "%FRONTEND_PID_FILE%" Frontend
call :stopFromPidFile "%BACKEND_PID_FILE%" Backend

call :freePort 3000 Frontend
call :freePort 8000 Backend

echo Done.
exit /b 0

:stopFromPidFile
set "PID_FILE=%~1"
set "NAME=%~2"

if not exist "%PID_FILE%" (
  echo %NAME% not running (pid file missing).
  exit /b 0
)

set /p PID=<"%PID_FILE%"
if "%PID%"=="" (
  del /f /q "%PID_FILE%" >nul 2>&1
  echo %NAME% pid file empty, removed.
  exit /b 0
)

tasklist /FI "PID eq %PID%" | findstr /R /C:" %PID% " >nul
if errorlevel 1 (
  echo %NAME% process already exited.
) else (
  echo Stopping %NAME% (pid: %PID%)...
  taskkill /PID %PID% /F >nul 2>&1
  echo %NAME% stopped.
)

del /f /q "%PID_FILE%" >nul 2>&1
exit /b 0

:freePort
set "PORT=%~1"
set "NAME=%~2"
set "PIDS="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  set "PIDS=!PIDS! %%P"
)
if not "%PIDS%"=="" (
  echo Stopping %NAME% port listeners on :%PORT%:%PIDS%
  for %%P in (%PIDS%) do taskkill /PID %%P /F >nul 2>&1
)
exit /b 0
