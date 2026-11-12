@echo off
setlocal
set SCRIPT_DIR=%~dp0
set TARGET_BAT=%SCRIPT_DIR%Iniciar-Tiker.bat
set ICON_PATH=%SCRIPT_DIR%public\favicon.ico
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Tiker - Cotizador.lnk

echo Creando acceso directo en el Escritorio...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$sc = $ws.CreateShortcut('%SHORTCUT_PATH%'); " ^
  "$sc.TargetPath = '%TARGET_BAT%'; " ^
  "$sc.WorkingDirectory = '%SCRIPT_DIR%'; " ^
  "$sc.IconLocation = '%ICON_PATH%'; " ^
  "$sc.Description = 'Tiker - Sistema de Costos y Cotizador'; " ^
  "$sc.Save();"

echo Acceso directo creado con exito en tu Escritorio: "%SHORTCUT_PATH%"
pause
