# Register autostart via Current User Startup folder (no admin required)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

$startup = Join-Path $env:AppData 'Microsoft\\Windows\\Start Menu\\Programs\\Startup'
$lnkPath = Join-Path $startup 'GurukrpaLocalSite.lnk'
$target = 'powershell.exe'
$args = "-NoProfile -ExecutionPolicy Bypass -File `"$((Join-Path (Get-Location) 'start-prod.ps1'))`""

# Create the shortcut
$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($lnkPath)
$shortcut.TargetPath = $target
$shortcut.Arguments = $args
$shortcut.WorkingDirectory = (Get-Location).Path
$shortcut.WindowStyle = 7 # Minimized
$shortcut.Description = 'Start Gurukrpa website locally at login'
$shortcut.Save()

Write-Host "Created startup shortcut: $lnkPath"
