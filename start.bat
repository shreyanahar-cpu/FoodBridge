@echo off
title FoodBridge - Full-Stack Food Donation Platform
echo ========================================================
echo   FoodBridge - Surplus Food Donation & Distribution
echo   College CEP Group Project Web Application
echo ========================================================
echo.

:: Add local portable node-bin to PATH if present
if exist "%~dp0node-bin\node.exe" (
    set "PATH=%~dp0node-bin;%PATH%"
)

echo [1/2] Verifying database and seed records...
node "%~dp0backend\seed\seedData.js"

echo.
echo [2/2] Starting FoodBridge Unified Full-Stack Server...
echo Server running at: http://localhost:5000
echo Opening your default browser...
start http://localhost:5000

echo.
echo ========================================================
echo Platform is active! Press Ctrl+C in this terminal to stop.
echo ========================================================
echo.
node "%~dp0backend\server.js"
pause
