@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Ensure we run from the project root (the folder of this script)
cd /d "%~dp0"

REM Stable defaults
set "PORT=3000"
set "HOST=127.0.0.1"
set "URL=http://%HOST%:%PORT%"
set "NODE_VERSION=20.17.0"
set "NODE_DIR=.tools\node\node-v%NODE_VERSION%-win-x64"
@echo off
REM Simple wrapper to launch the reliable PowerShell starter
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"
endlocal
echo.
