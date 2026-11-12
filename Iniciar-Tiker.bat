@echo off
title Tiker - Cotizador
cd /d "%~dp0"

echo ======================================================
echo           Iniciando Tiker - Cotizador
echo ======================================================
echo.

if not exist "node_modules" (
    echo Instalando dependencias necesarias...
    call npm.cmd install
)

:: Inicia Vite
start "" /b cmd /c "npm.cmd run dev"

:: Breve espera para que el servidor levante
timeout /t 2 /nobreak >nul

:: Abre directamente en el navegador en modo app
start "" http://localhost:5173

echo.
echo Aplicacion iniciada correctamente en http://localhost:5173
echo Puedes minimizar esta ventana.
