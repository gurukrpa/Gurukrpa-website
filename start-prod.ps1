# Start Next.js in production mode with portable Node
# - Builds the app if needed
# - Starts next start on 127.0.0.1:3000
# - Waits for readiness then opens Chrome

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

$Port = 3000
$BindHost = '127.0.0.1'
$Url  = "http://${BindHost}:${Port}"
$NodeVersion = '20.17.0'
$NodeDir = Join-Path '.tools/node' "node-v$NodeVersion-win-x64"
$NodeExe = Join-Path $NodeDir 'node.exe'
$NpmCmd  = Join-Path $NodeDir 'npm.cmd'

Write-Host '========================================'
Write-Host '  Starting Gurukrpa Website (prod)'
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

# Always create a fresh production build to ensure `next start` succeeds
Write-Host 'Building Next.js app (prod build)...'
& $NodeExe node_modules/next/dist/bin/next build
if ($LASTEXITCODE -ne 0) {
  Write-Error "Next.js build failed (exit $LASTEXITCODE). Aborting start."
  exit 1
}

Write-Host 'Launching next start...'
$serverCmd = "`"$NodeExe`" node_modules/next/dist/bin/next start -p $Port -H $BindHost"
Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $serverCmd" -WindowStyle Minimized -WorkingDirectory (Get-Location)

# Wait for readiness
Write-Host 'Waiting for server to become ready (up to 60s)...'
$deadline = (Get-Date).AddSeconds(60)
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
  Write-Warning "Server did not respond in time. Check the 'Gurukrpa Website (prod)' console for errors."
  exit 1
}

# Open Chrome (fallback to Edge)
$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
  "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($chrome) { Start-Process -FilePath $chrome -ArgumentList $Url } else { Start-Process -FilePath 'cmd.exe' -ArgumentList "/c start msedge $Url" | Out-Null }

Write-Host "Opened: $Url"
