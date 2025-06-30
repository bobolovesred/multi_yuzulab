@echo off
setlocal enabledelayedexpansion

:: ==================================================================
::  SETTINGS. Change paths only here.
:: ==================================================================
set "PROJECT_SERVER_DIR=C:\Users\www.yuzu.city\Desktop\yuzu_labs\multi_portal\server"
set "PM2_CMD_PATH=C:\Users\www.yuzu.city\AppData\Roaming\npm\pm2.cmd"
set "NGINX_DIR=C:\nginx"
:: ==================================================================


:: --- Path checks before showing the menu ---
if not exist "%PROJECT_SERVER_DIR%" (
    cls & echo. & echo [ERROR] Project directory not found: & echo %PROJECT_SERVER_DIR% & echo. & echo Check the path in the script settings. & echo( & echo Press any key to exit... & pause >nul & exit /b 1
)
if not exist "%PM2_CMD_PATH%" (
    cls & echo. & echo [ERROR] PM2 executable not found: & echo %PM2_CMD_PATH% & echo. & echo Check the path or make sure PM2 is installed globally. & echo( & echo Press any key to exit... & pause >nul & exit /b 1
)
if not exist "%NGINX_DIR%\nginx.exe" (
    cls & echo. & echo [ERROR] Nginx executable not found: & echo %NGINX_DIR%\nginx.exe & echo. & echo Check the path in the script settings. & echo( & echo Press any key to exit... & pause >nul & exit /b 1
)


:MENU
cls
echo.
echo  +---------------------------------------+
echo  ^|   Manage "multi_portal" services    ^|
echo  +---------------------------------------+
echo.
echo    [1] Start all services (PM2 + Nginx)
echo    [2] Stop all services (PM2 + Nginx)
echo    [3] Show logs
echo.
echo    [4] Exit
echo.

set "userInput="
set /p "userInput=  Enter your choice and press Enter: "

if "%userInput%"=="1" goto START_SERVICES
if "%userInput%"=="2" goto STOP_SERVICES
if "%userInput%"=="3" goto SHOW_LOGS
if "%userInput%"=="4" goto EXIT_SCRIPT

echo.
echo   Invalid choice. Please try again.
echo( & echo Press any key to continue... & pause >nul
goto MENU


:START_SERVICES
cls
echo.
echo  === STARTING SERVICES ===
echo.
echo  [1/2] Starting Node.js processes via PM2...
cd /d "%PROJECT_SERVER_DIR%"
call "%PM2_CMD_PATH%" resurrect >nul 2>&1
if !errorlevel! neq 0 (
    echo      ... ERROR: 'pm2 resurrect' command failed.
    echo      ... No saved session found. Trying 'pm2 start'...
    call "%PM2_CMD_PATH%" start >nul 2>&1
    if !errorlevel! neq 0 (
        echo      ... ERROR: 'pm2 start' also failed. Check your PM2 config.
    ) else (
        echo      ... OK: Processes started via 'pm2 start'.
    )
) else (
    echo      ... OK: Processes restored from saved session.
)
echo.

echo  [2/2] Starting Nginx...
cd /d "%NGINX_DIR%"
start "" nginx.exe
if !errorlevel! neq 0 (
    echo      ... ERROR: Failed to start Nginx. Check config or logs.
) else (
    echo      ... OK: Start command sent to Nginx.
)
echo.
echo  ----------------------------------------------------------------
echo  All services have been instructed to start. You can close this window.
echo  To check status, use 'pm2 status' and 'tasklist /fi "imagename eq nginx.exe"'.
echo.
echo( & echo Press any key to return to the menu... & pause >nul
goto MENU

:STOP_SERVICES
cls
echo.
echo  === STOPPING SERVICES ===
echo.
echo  [1/2] Stopping all PM2 processes...
call "%PM2_CMD_PATH%" stop all >nul 2>&1
if !errorlevel! neq 0 (
    echo      ... ERROR: 'pm2 stop all' command failed.
) else (
    echo      ... OK: Processes stopped.
)
echo.

echo  [2/2] Stopping Nginx...
"%NGINX_DIR%\nginx.exe" -s stop >nul 2>&1
if !errorlevel! neq 0 (
    echo      ... WARNING: Failed to stop Nginx (it might not have been running).
) else (
    echo      ... OK: Process stopped.
)
echo.
echo  ----------------------------------------------------------------
echo  All services should now be stopped.
echo.
echo( & echo Press any key to return to the menu... & pause >nul
goto MENU

:SHOW_LOGS
:LOG_MENU
cls
echo.
echo  === VIEW LOGS ===
echo.
echo    [1] PM2 logs (all apps)
echo    [2] Nginx access log (last 30 lines)
echo    [3] Nginx error log (last 30 lines)
echo.
echo    [4] Back to main menu
echo.

set "logChoice="
set /p "logChoice=  Select a log to view and press Enter: "

if "%logChoice%"=="1" goto LOG_PM2
if "%logChoice%"=="2" goto LOG_NGINX_ACCESS
if "%logChoice%"=="3" goto LOG_NGINX_ERROR
if "%logChoice%"=="4" goto MENU

echo.
echo   Invalid choice. Please try again.
echo( & echo Press any key to continue... & pause >nul
goto LOG_MENU


:LOG_PM2
cls
echo --- PM2 Logs. Press Ctrl+C to return to the menu. ---
echo.
call "%PM2_CMD_PATH%" logs
echo( & echo Press any key to return to the log menu... & pause >nul
goto LOG_MENU

:LOG_NGINX_ACCESS
cls
echo --- Nginx access log (access.log), last 30 lines ---
echo.
powershell -Command "Get-Content '%NGINX_DIR%\logs\access.log' -Tail 30 -ErrorAction SilentlyContinue"
echo.
echo( & echo Press any key to return to the log menu... & pause >nul
goto LOG_MENU

:LOG_NGINX_ERROR
cls
echo --- Nginx error log (error.log), last 30 lines ---
echo.
powershell -Command "Get-Content '%NGINX_DIR%\logs\error.log' -Tail 30 -ErrorAction SilentlyContinue"
echo.
echo( & echo Press any key to return to the log menu... & pause >nul
goto LOG_MENU

:EXIT_SCRIPT
endlocal
exit /b 0