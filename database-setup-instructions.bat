@echo off
echo ========================================
echo   SUPABASE DATABASE SETUP INSTRUCTIONS
echo ========================================
echo.
echo Your Supabase credentials are already configured in .env.local
echo.
echo To complete the database setup:
echo.
echo 1. Open your browser and go to:
echo    https://app.supabase.com/project/yavokvrcskbxhotpcejo/sql/new
echo.
echo 2. Copy the SQL from this file:
echo    supabase\schema.sql
echo.
echo 3. Paste it into the SQL Editor
echo.
echo 4. Click the "Run" button (or press Ctrl+Enter)
echo.
echo 5. You should see "Success. No rows returned" - that's normal!
echo.
echo ========================================
echo   ALTERNATIVE: Manual Copy-Paste
echo ========================================
echo.
echo Opening schema.sql in notepad...
echo.
notepad supabase\schema.sql
echo.
echo After copying the SQL:
echo 1. Go to https://app.supabase.com
echo 2. Click on "yavokvrcskbxhotpcejo" project
echo 3. Click "SQL Editor" in left menu
echo 4. Paste and click "Run"
echo.
echo ========================================
echo   YOUR WEBSITE STATUS
echo ========================================
echo.
echo ✓ Node.js: Installed (portable)
echo ✓ Dependencies: Installed
echo ✓ Dev Server: Running at http://localhost:3000
echo ✓ Environment: Configured
echo.
echo □ Database: Needs schema execution (follow steps above)
echo □ Razorpay: Optional - add test keys when ready
echo.
echo ========================================
echo.
pause
