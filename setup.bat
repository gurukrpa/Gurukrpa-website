@echo off
echo ========================================
echo   GURUKRPA WEBSITE - AUTO SETUP
echo ========================================
echo.

echo Step 1: Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js is NOT installed!
    echo.
    echo PLEASE INSTALL NODE.JS FIRST:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download LTS version
    echo 3. Run installer
    echo 4. Restart computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js is installed
echo.

echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo ✓ Dependencies installed successfully!
echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Setup Supabase Database:
echo    - Go to: https://app.supabase.com
echo    - Open project: yavokvrcskbxhotpcejo
echo    - Go to SQL Editor
echo    - Copy contents of 'supabase/schema.sql'
echo    - Paste and Run in SQL Editor
echo.
echo 2. Setup Razorpay (Optional for now):
echo    - Go to: https://razorpay.com
echo    - Sign up and get test API keys
echo    - Update .env.local file
echo.
echo 3. Start the development server:
echo    Run: npm run dev
echo.
echo 4. Open in browser:
echo    http://localhost:3000
echo.
echo Need help? WhatsApp: +91 96295 55442
echo.
pause
