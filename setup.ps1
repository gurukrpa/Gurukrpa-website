# Gurukrpa Website - Automated Setup Script
# This script will automatically set up everything after Node.js is installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GURUKRPA WEBSITE - AUTO SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Step 1: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "PLEASE INSTALL NODE.JS FIRST:" -ForegroundColor Red
    Write-Host "1. Go to: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download LTS version" -ForegroundColor White
    Write-Host "3. Run installer" -ForegroundColor White
    Write-Host "4. Restart computer" -ForegroundColor White
    Write-Host "5. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Setup Supabase Database:" -ForegroundColor White
Write-Host "   - Go to: https://app.supabase.com" -ForegroundColor Gray
Write-Host "   - Open project: yavokvrcskbxhotpcejo" -ForegroundColor Gray
Write-Host "   - Go to SQL Editor" -ForegroundColor Gray
Write-Host "   - Copy contents of 'supabase/schema.sql'" -ForegroundColor Gray
Write-Host "   - Paste and Run in SQL Editor" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setup Razorpay (Optional for now):" -ForegroundColor White
Write-Host "   - Go to: https://razorpay.com" -ForegroundColor Gray
Write-Host "   - Sign up and get test API keys" -ForegroundColor Gray
Write-Host "   - Update .env.local file" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the development server:" -ForegroundColor White
Write-Host "   Run: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Open in browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Need help? WhatsApp: +91 96295 55442" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
