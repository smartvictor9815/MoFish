@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0.."
for %%I in ("%ROOT_DIR%") do set "ROOT_DIR=%%~fI"

set "RUN_DIR=%ROOT_DIR%\.run"
set "LOG_DIR=%RUN_DIR%\logs"
set "BACKEND_PID_FILE=%RUN_DIR%\backend.pid"
set "FRONTEND_PID_FILE=%RUN_DIR%\frontend.pid"

if not exist "%RUN_DIR%" mkdir "%RUN_DIR%"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

call :freePort 8000 Backend
call :freePort 3000 Frontend

if exist "%BACKEND_PID_FILE%" del /f /q "%BACKEND_PID_FILE%" >nul 2>&1
if exist "%FRONTEND_PID_FILE%" del /f /q "%FRONTEND_PID_FILE%" >nul 2>&1

if not exist "%ROOT_DIR%\backend\.venv\Scripts\python.exe" (
  echo Creating backend virtualenv...
  python -m venv "%ROOT_DIR%\backend\.venv"
)

echo Installing backend dependencies...
call "%ROOT_DIR%\backend\.venv\Scripts\python.exe" -m pip install -r "%ROOT_DIR%\backend\requirements.txt" >nul

echo Starting backend...
powershell -NoProfile -Command ^
  "$p = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c cd /d \"%ROOT_DIR%\backend\" ^& call .venv\\Scripts\\activate ^& uvicorn app.main:app --reload --host 127.0.0.1 --port 8000' -RedirectStandardOutput '%LOG_DIR%\backend.log' -RedirectStandardError '%LOG_DIR%\backend.log' -WindowStyle Hidden -PassThru; $p.Id" > "%BACKEND_PID_FILE%"

echo Installing frontend dependencies...
call npm install >nul

echo Starting frontend...
powershell -NoProfile -Command ^
  "$p = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c cd /d \"%ROOT_DIR%\" ^& npm run dev -- --host 127.0.0.1 --port 3000' -RedirectStandardOutput '%LOG_DIR%\frontend.log' -RedirectStandardError '%LOG_DIR%\frontend.log' -WindowStyle Hidden -PassThru; $p.Id" > "%FRONTEND_PID_FILE%"

echo.
echo Services are starting.
echo Frontend: http://127.0.0.1:3000
echo Backend:  http://127.0.0.1:8000
echo Logs: %LOG_DIR%
exit /b 0

:freePort
set "PORT=%~1"
set "NAME=%~2"
set "PIDS="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  set "PIDS=!PIDS! %%P"
)
if not "%PIDS%"=="" (
  echo %NAME% port :%PORT% is occupied, stopping process(es):%PIDS%
  for %%P in (%PIDS%) do taskkill /PID %%P /F >nul 2>&1
)
exit /b 0
