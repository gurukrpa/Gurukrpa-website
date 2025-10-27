# Register a Windows Scheduled Task to auto-start the local site at user logon
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\register-autostart.ps1

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

$taskName = 'GurukrpaLocalSite'
$scriptPath = Join-Path (Get-Location) 'start-prod.ps1'

if (-not (Test-Path $scriptPath)) {
  throw "start-prod.ps1 not found at $scriptPath"
}

$escaped = $scriptPath.Replace('"','\"')
$cmd = "powershell -NoProfile -ExecutionPolicy Bypass -File `"$escaped`""

# Create or update the task
try {
  schtasks /Query /TN $taskName *> $null
  $exists = $LASTEXITCODE -eq 0
} catch { $exists = $false }

if ($exists) {
  Write-Host "Updating existing task $taskName ..."
  schtasks /Change /TN $taskName /TR $cmd /RL HIGHEST | Out-Null
} else {
  Write-Host "Creating task $taskName (runs at logon)..."
  schtasks /Create /SC ONLOGON /TN $taskName /TR $cmd /RL HIGHEST | Out-Null
}

Write-Host "Registered. The site will start automatically at next login."
