@echo off
title FoodBridge - Database Reset & Re-Seed
if exist "%~dp0node-bin\node.exe" (
    set "PATH=%~dp0node-bin;%PATH%"
)
echo Resetting and re-seeding FoodBridge database with demo donors, NGOs, volunteers, listings and admin...
node "%~dp0backend\seed\seedData.js"
echo Done!
pause
