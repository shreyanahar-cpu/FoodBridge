@echo off
title FoodBridge - Development Mode (Backend 5000 + Vite 3000)
echo ========================================================
echo   FoodBridge - Development Hot-Reload Mode
echo ========================================================
echo.

if exist "%~dp0node-bin\node.exe" (
    set "PATH=%~dp0node-bin;%PATH%"
)

echo Starting backend on port 5000 in background...
start "FoodBridge Backend API (Port 5000)" cmd /k "cd /d %~dp0 && node backend\server.js"

timeout /t 2 /nobreak >nul

echo Starting Vite frontend on port 3000...
start http://localhost:3000
cd /d "%~dp0frontend"
npm run dev
