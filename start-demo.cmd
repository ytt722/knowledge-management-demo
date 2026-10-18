@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel%==0 (
  node server.mjs
  exit /b %errorlevel%
)

set "CODEX_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%CODEX_NODE%" (
  "%CODEX_NODE%" server.mjs
  exit /b %errorlevel%
)

echo.
echo [ERROR] Node.js was not found.
echo Install Node.js 18 or later from https://nodejs.org/ and reopen PowerShell.
echo.
pause
exit /b 1
