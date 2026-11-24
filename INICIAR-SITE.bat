@echo off
cd /d "%~dp0"
title NEXT LEVEL EXPERIENCE - servidor local
echo Iniciando o NEXT LEVEL EXPERIENCE...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor-local.ps1" -Port 8080
echo.
echo O servidor foi encerrado.
pause
