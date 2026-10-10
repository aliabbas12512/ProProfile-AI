# ProProfile AI — Windows install script
# Installs project dependencies. Run once (and again after pulling updates).
#
# Requires Node.js 18+ to already be installed.
# Download it from https://nodejs.org if `node -v` below fails.

$ErrorActionPreference = "Stop"

Write-Host "Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node -v
    Write-Host "Found Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js was not found on this computer." -ForegroundColor Red
    Write-Host "Install it from https://nodejs.org (LTS version), then re-run this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Installing dependencies (this needs an internet connection, one time only)..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed. See the error above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Done. Run .\start.ps1 to launch ProProfile AI." -ForegroundColor Green
