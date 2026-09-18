$toolsNode = Join-Path $PSScriptRoot ".tools\node"
$env:PATH = "$toolsNode;" + $env:PATH
& (Join-Path $toolsNode "npx.cmd") --no-install vite --port 5173 --host
