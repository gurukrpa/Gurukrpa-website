# Remove the auto-start Scheduled Task
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\unregister-autostart.ps1

$ErrorActionPreference = 'Stop'
$taskName = 'GurukrpaLocalSite'

try {
  schtasks /Query /TN $taskName *> $null
  if ($LASTEXITCODE -eq 0) {
    schtasks /Delete /F /TN $taskName | Out-Null
    Write-Host "Removed task $taskName."
  } else {
    Write-Host "Task $taskName not found."
  }
} catch {
  Write-Host "Task $taskName not found."
}
