@echo off
setlocal

set "ROOT_DIR=%~dp0.."
for %%I in ("%ROOT_DIR%") do set "ROOT_DIR=%%~fI"

call "%ROOT_DIR%\scripts\stop.bat"
call "%ROOT_DIR%\scripts\start.bat"
