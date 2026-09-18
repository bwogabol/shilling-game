$ErrorActionPreference = "Stop"
$toolsDir = Join-Path $PSScriptRoot ".tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}
$nodeDir = Join-Path $toolsDir "node"
$nodeExe = Join-Path $nodeDir "node.exe"

if (-not (Test-Path $nodeExe)) {
    $zipPath = Join-Path $toolsDir "node.zip"
    Write-Host "Downloading portable Node.js..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip" -OutFile $zipPath
    Write-Host "Extracting portable Node.js..."
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
    $extracted = Join-Path $toolsDir "node-v20.18.0-win-x64"
    if (Test-Path $extracted) {
        Rename-Item $extracted "node"
    }
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
}

Write-Host "Node version:"
& $nodeExe -v
$npmCmd = Join-Path $nodeDir "npm.cmd"
Write-Host "Npm version:"
& $npmCmd -v
