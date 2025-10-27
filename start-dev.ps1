# Robust dev starter for Windows PowerShell
# - Ensures portable Node is available
# - Installs dependencies if missing
# - Starts Next.js on 127.0.0.1:3000
# - Waits until ready then opens Chrome

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

# Move to repo root (directory of this script)
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

$Port = 3000
$BindHost = '127.0.0.1'
$Url  = "http://${BindHost}:${Port}"
$NodeVersion = '20.17.0'
$NodeDir = Join-Path '.tools/node' "node-v$NodeVersion-win-x64"
$NodeExe = Join-Path $NodeDir 'node.exe'
$NpmCmd  = Join-Path $NodeDir 'npm.cmd'

Write-Host '========================================'
Write-Host '  Starting Gurukrpa Website (dev)'
Write-Host '========================================'
Write-Host "Target: $Url"

# Ensure portable Node exists
if (-not (Test-Path $NodeExe)) {
  Write-Host "Portable Node.js $NodeVersion not found. Downloading (one-time)..."
  $null = New-Item -ItemType Directory -Force -Path (Join-Path '.tools' 'node')
  $zipUrl = "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-win-x64.zip"
  $zipOut = Join-Path (Resolve-Path '.').Path '.tools/node.zip'
  Invoke-WebRequest -Uri $zipUrl -OutFile $zipOut -UseBasicParsing
  Expand-Archive -Path $zipOut -DestinationPath (Join-Path '.tools' 'node') -Force
  Remove-Item $zipOut -Force
}

# Install deps if missing
if (-not (Test-Path 'node_modules')) {
  Write-Host 'Installing dependencies...'
  & $NpmCmd install
}

# Start Next.js dev server using portable node
$nextBin = 'node_modules/next/dist/bin/next'
if (-not (Test-Path $nextBin)) {
  throw 'Next.js is not installed. Try running npm install again.'
}

Write-Host 'Launching dev server...'
$serverCmd = "`"$NodeExe`" $nextBin dev -p $Port -H $BindHost"
# Launch in new window and keep this window free
Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $serverCmd" -WindowStyle Normal -WorkingDirectory (Get-Location)

# Wait for readiness
Write-Host 'Waiting for server to become ready (up to 120s)...'
$deadline = (Get-Date).AddSeconds(120)
$ok = $false
while (-not $ok -and (Get-Date) -lt $deadline) {
  try {
    (Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing) | Out-Null
    $ok = $true
  } catch {
    Start-Sleep -Milliseconds 700
  }
}

if (-not $ok) {
  Write-Warning "Server did not respond in time. You can still check the 'Gurukrpa Dev Server' window for errors."
  exit 1
}

# Open Chrome (fallback to Edge)
$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
  "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($chrome) {
  Start-Process -FilePath $chrome -ArgumentList $Url
} else {
  Start-Process -FilePath 'cmd.exe' -ArgumentList "/c start msedge $Url" | Out-Null
}

Write-Host "Opened: $Url"
