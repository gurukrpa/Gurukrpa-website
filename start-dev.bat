@echo off
echo ========================================
echo   Starting Gurukrpa Website...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Dependencies not installed!
    echo.
    echo Please run setup.bat first!
    echo.
    pause
    exit /b 1
)

echo Starting development server...
echo.
echo Website will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start Chrome
start "" "chrome.exe" "http://localhost:3000"

REM Start dev server with portable Node.js
.\.tools\node\node-v22.21.0-win-x64\node.exe .\.tools\node\node-v22.21.0-win-x64\node_modules\npm\bin\npm-cli.js run dev
