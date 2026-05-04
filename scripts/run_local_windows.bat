@echo off
REM ============================================================================
REM AICHAT - Local Windows Environment Runner
REM Purpose: Run AI components locally on Windows
REM ----------------------------------------------------------------------------
REM Environment Setup
SETLOCAL ENABLEDELAYEDEXPANSION

REM Define constants
SET SCRIPT_DIR=%~dp0
SET LOG_FILE=%SCRIPT_DIR%run_local_windows.log
SET ERROR_LOG=%SCRIPT_DIR%run_local_windows_error.log
SET PYTHON_PATH=C:\Python39\python.exe
SET VIRTUAL_ENV_DIR=%SCRIPT_DIR%venv

REM Function to log messages
:log
    echo [%DATE% %TIME%] %* >> %LOG_FILE%
    exit /b

REM Function to log errors
:log_error
    echo [%DATE% %TIME%] ERROR: %* >> %ERROR_LOG%
    exit /b

REM Start VENV if not already active
IF NOT DEFINED VIRTUAL_ENV (
    %PYTHON_PATH% -m venv %VIRTUAL_ENV_DIR%
    CALL %VIRTUAL_ENV_DIR%\Scripts\activate
) ELSE (
    CALL %VIRTUAL_ENV_DIR%\Scripts\activate
)

REM Check Python installation
%PYTHON_PATH% --version >nul 2>&1
IF ERRORLEVEL 1 (
    CALL :log_error "Python is not installed or not found in the PATH."
    exit /b 1
)

REM Install project dependencies
CALL :log "Installing dependencies..."
%PYTHON_PATH% -m pip install -r %SCRIPT_DIR%requirements.txt >nul 2>&1
IF ERRORLEVEL 1 (
    CALL :log_error "Failed to install dependencies."
    exit /b 1
)

REM Start the microservices
REM ----------------------------------------------------------------------------
REM Start the Speech-to-Text Service
start cmd /c "CALL :log Starting STT Service && %PYTHON_PATH% %SCRIPT_DIR%services\stt_service.py >nul"

REM Start the Intent Processing Service
start cmd /c "CALL :log Starting Intent Processing Service && %PYTHON_PATH% %SCRIPT_DIR%services\intent_service.py >nul"

REM Start the Text-to-Speech Service
start cmd /c "CALL :log Starting TTS Service && %PYTHON_PATH% %SCRIPT_DIR%services\tts_service.py >nul"

REM ----------------------------------------------------------------------------
REM Check if services started successfully
TIMEOUT /T 5 >nul

REM Function to check if service is running
:check_service
    rem netstat -ano | findstr /R /C:LISTENING %1
    tasklist | findstr /I /C:"%~1"
    IF %ERRORLEVEL% NEQ 0 (
        CALL :log_error "Service %~1 is not running."
        exit /b 1
    ) ELSE (
        CALL :log "Service %~1 is running."
    )
    exit /b

REM Validate each service
CALL :check_service "stt_service.py"
CALL :check_service "intent_service.py"
CALL :check_service "tts_service.py"

REM End Script
CALL :log "All services started successfully."
exit /b 0

REM Cleanup
ENDLOCAL