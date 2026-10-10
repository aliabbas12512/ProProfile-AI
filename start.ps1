# ProProfile AI — Windows start script
# Launches the app locally and opens it in your default browser.
# After the first install, this is the only script you need — and it
# does not require internet access (the app itself runs fully offline
# once dependencies are installed; only the optional AI panel needs a
# connection).

$ErrorActionPreference = "Stop"

if (-Not (Test-Path "node_modules")) {
    Write-Host "Dependencies are not installed yet. Running install.ps1 first..." -ForegroundColor Yellow
    & "$PSScriptRoot\install.ps1"
}

Write-Host "Starting ProProfile AI at http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"
npm run dev
