@echo off
chcp 437 >nul
title C Drive Cleaner
color 0A
setlocal enabledelayedexpansion

:: Check admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process -Verb RunAs '%~0'"
    exit /b
)

:: ======== GLOBAL LOG SETUP ========
set GLOBAL_LOG_ENABLED=0
set LOGFILE=C:\Log\CleanLog.txt
:ask_log
cls
echo ================================
echo     Enable Global Logging?
echo ================================
call :yellow "Enable logging to %LOGFILE% ?"
call :yellow "This may take very little disk space."
echo.
set /p log_choice=Enable logging? (Y/N):
if /i "%log_choice%"=="Y" (
    set GLOBAL_LOG_ENABLED=1
    if not exist "C:\Log" mkdir "C:\Log" 2>nul
    call :log "=========================================="
    call :log "Logging started at %date% %time%"
    call :log "=========================================="
    echo Logging enabled. Log will be saved to %LOGFILE%
) else (
    echo Logging disabled.
)
pause
goto menu

:: ============== MENU ==============
:menu
cls
echo ================================================
echo          C Drive Cleaner v2.8
echo                 By ALing
echo ================================================
echo  1. Quick Clean (one-click)
echo  2. Advanced Mode (custom)
echo  3. Check Disk Usage (Enter drive letter)
echo  4. Find Large Files (Custom size)
echo  5. Exit
echo ================================================
set /p choice=Enter option (1-5):
if "%choice%"=="1" goto quick
if "%choice%"=="2" goto advanced
if "%choice%"=="3" goto disk_usage
if "%choice%"=="4" goto large_files
if "%choice%"=="5" exit
goto menu

:: ============== QUICK CLEAN ==============
:quick
call :log "Quick Clean started"
call :get_before
call :clear_temp
call :clear_recycle
call :clear_prefetch
call :clear_recent
call :clear_ie_cache
call :clear_logs
call :clear_thumb
call :clear_update_cache
call :clear_browser_cache
echo.
echo Quick clean completed!
call :show_freed
call :log "Quick Clean finished"
pause
goto menu

:: ============== ADVANCED MODE ==============
:advanced
cls
echo Advanced Mode - Confirm each item (Y/N)
echo.
echo [*] Standard items (safe):
echo.
set /p clean_temp=Clean temporary files? (Y/N):
set /p clean_recycle=Empty Recycle Bin? (Y/N):
set /p clean_prefetch=Clean Prefetch files? (Y/N):
set /p clean_recent=Clean Recent documents? (Y/N):
set /p clean_ie=Clean IE cache? (Y/N):
set /p clean_logs=Clean system logs? (Y/N):
set /p clean_thumb=Clean thumbnail cache? (Y/N):
set /p clean_update=Clean Windows Update cache? (Y/N):
set /p clean_browser=Clean browser caches (Chrome/Edge/Firefox)? (Y/N):
echo.
echo [!!!] Caution items (may affect system recovery):
call :red "WARNING: Deleting system restore points will remove all restore points except the latest (if any)."
set /p clean_restore=Delete system restore points? (Y/N):
call :red "WARNING: Deleting patch cache may prevent uninstalling some Windows updates."
set /p clean_patch=Clean Windows Installer patch cache? (Y/N):
echo.
echo Executing selected tasks...
call :log "Advanced Clean started"
call :get_before
if /i "%clean_temp%"=="Y" call :clear_temp
if /i "%clean_recycle%"=="Y" call :clear_recycle
if /i "%clean_prefetch%"=="Y" call :clear_prefetch
if /i "%clean_recent%"=="Y" call :clear_recent
if /i "%clean_ie%"=="Y" call :clear_ie_cache
if /i "%clean_logs%"=="Y" call :clear_logs
if /i "%clean_thumb%"=="Y" call :clear_thumb
if /i "%clean_update%"=="Y" call :clear_update_cache
if /i "%clean_browser%"=="Y" call :clear_browser_cache
if /i "%clean_restore%"=="Y" call :clear_restore_points
if /i "%clean_patch%"=="Y" call :clear_patch_cache
echo.
echo Advanced clean completed!
call :show_freed
call :log "Advanced Clean finished"
pause
goto menu

:: ============== DISK USAGE ==============
:disk_usage
cls
echo ======== Check Disk Usage ========
echo (Enter "stop" to return to main menu)
echo.
:disk_loop
set /p drive_letter=Enter drive letter (e.g., C, D, E):
set drive_letter=%drive_letter: =%
if /i "%drive_letter%"=="stop" goto menu
for %%i in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if /i "%drive_letter%"=="%%i" set drive_letter=%%i
)
powershell -Command "if (Test-Path %drive_letter%:\) { exit 0 } else { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Invalid drive letter or drive does not exist.
    pause
    goto disk_loop
)
echo.
echo ====== Disk Usage for %drive_letter%: ======
call :log "Disk usage checked for %drive_letter%"
powershell -Command "$drive = Get-PSDrive %drive_letter%; $total = [math]::Round($drive.Used/1GB,2) + [math]::Round($drive.Free/1GB,2); Write-Host \"Total  : $([math]::Round($total,2)) GB\"; Write-Host \"Used   : $([math]::Round($drive.Used/1GB,2)) GB\"; Write-Host \"Free   : $([math]::Round($drive.Free/1GB,2)) GB\""
echo ===================================
echo.
echo Type "stop" to exit, or press Enter to continue checking other drives.
goto disk_loop

:: ============== LARGE FILES (MULTI-THREADED) ==============
:large_files
cls
echo ======== Find Large Files ========
echo Enter minimum file size in GB (e.g., 1, 2.5, 0.5)
echo (Enter "0" to find all files, but may be slow)
echo (Enter "stop" to return to main menu)
set /p size_input=Size (GB):
set size_input=%size_input: =%
if /i "%size_input%"=="stop" goto menu
if "%size_input%"=="" (
    echo Invalid input. Please enter a number.
    pause
    goto large_files
)
:: Validate and round using PowerShell
powershell -Command "$val = try { [double]'%size_input%' } catch { $null }; if ($val -eq $null) { Write-Host 'invalid' } else { $rounded = [math]::Round($val, 2); if ($rounded -lt 0) { $rounded = 0 }; Write-Host $rounded }" > "%TEMP%\sizecheck.txt"
set /p rounded=<"%TEMP%\sizecheck.txt"
del "%TEMP%\sizecheck.txt" >nul
if "%rounded%"=="invalid" (
    echo Invalid input. Please enter a number.
    pause
    goto large_files
)
echo.
echo Searching for files larger than %rounded% GB on C: drive...
echo (Press Ctrl+C to cancel at any time)
echo This may take a while...
echo.
call :log "Large file scan started (threshold = %rounded% GB)"

:: Generate multi-threaded PowerShell script (max 10 concurrent)
set "psScript=%TEMP%\findlarge.ps1"
powershell -Command "$script = @' 
$thresholdGB = %rounded%
$maxConcurrent = 10
$searchPath = 'C:\'
$threshold = $thresholdGB * 1GB

$resultBag = [System.Collections.Concurrent.ConcurrentBag[object]]::new()

# Root directory files (non-recursive)
$rootFiles = Get-ChildItem -Path $searchPath -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt $threshold }
foreach ($f in $rootFiles) {
    $resultBag.Add([PSCustomObject]@{Path = $f.FullName; Size = $f.Length})
}

# Get all first-level subdirectories
$dirs = Get-ChildItem -Directory -Path $searchPath -Force -ErrorAction SilentlyContinue

$runspacePool = [RunspaceFactory]::CreateRunspacePool(1, $maxConcurrent)
$runspacePool.Open()

$scriptBlock = {
    param($dirPath, $threshold)
    $files = Get-ChildItem -Path $dirPath -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt $threshold }
    $result = @()
    foreach ($f in $files) {
        $result += [PSCustomObject]@{Path = $f.FullName; Size = $f.Length}
    }
    return $result
}

$jobs = @()
foreach ($dir in $dirs) {
    $job = [PowerShell]::Create().AddScript($scriptBlock).AddArgument($dir.FullName).AddArgument($threshold)
    $job.RunspacePool = $runspacePool
    $jobs += @{ Job = $job; Handle = $job.BeginInvoke() }
}

$allResults = @()
foreach ($j in $jobs) {
    $result = $j.Job.EndInvoke($j.Handle)
    $allResults += $result
    $j.Job.Dispose()
}
$runspacePool.Dispose()

$allResults = $allResults + $resultBag.ToArray()
$sorted = $allResults | Sort-Object -Property Size -Descending
$top20 = $sorted | Select-Object -First 20
$totalFound = $sorted.Count

Write-Host \"  Size(GB)  File Path\" -ForegroundColor Yellow
if ($totalFound -eq 0) {
    Write-Host \"No files found.\" -ForegroundColor Cyan
} else {
    foreach ($item in $top20) {
        $sizeGB = [math]::Round($item.Size/1GB, 2)
        Write-Host (\"{0,8} GB  {1}\" -f $sizeGB, $item.Path)
    }
}
Write-Host (\"Total files found: \" + $totalFound)
# Write count for batch log
$totalFound | Out-File -FilePath \"$env:TEMP\count.txt\" -Encoding ASCII
'@; $script | Out-File -FilePath '%psScript%' -Encoding ASCII"

:: Execute the generated script
powershell -ExecutionPolicy Bypass -File "%psScript%"
del "%psScript%" >nul 2>&1

set /p total_count=<"%TEMP%\count.txt" 2>nul
if "%total_count%"=="" set total_count=0
call :log "Large file scan finished. Found %total_count% files."
echo =====================================
echo (Only first 20 files are displayed)
pause
goto menu

:: ============== CLEAN FUNCTIONS ==============
:clear_temp
echo Cleaning temporary files...
del /f /s /q "%TEMP%\*" 2>nul
del /f /s /q "%WINDIR%\Temp\*" 2>nul
rd /s /q "%TEMP%" 2>nul
rd /s /q "%WINDIR%\Temp" 2>nul
mkdir "%TEMP%" 2>nul
mkdir "%WINDIR%\Temp" 2>nul
call :log "Temporary files cleaned"
exit /b

:clear_recycle
echo Emptying Recycle Bin...
powershell -Command "Clear-RecycleBin -Force" 2>nul
call :log "Recycle Bin emptied"
exit /b

:clear_prefetch
echo Cleaning Prefetch files...
del /f /s /q "%WINDIR%\Prefetch\*" 2>nul
call :log "Prefetch files cleaned"
exit /b

:clear_recent
echo Cleaning Recent documents...
del /f /s /q "%APPDATA%\Microsoft\Windows\Recent\*" 2>nul
call :log "Recent documents cleaned"
exit /b

:clear_ie_cache
echo Cleaning IE cache...
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 8 2>nul
call :log "IE cache cleaned"
exit /b

:clear_logs
echo Cleaning system logs (Event Logs)...
wevtutil cl Application 2>nul
wevtutil cl System 2>nul
wevtutil cl Security 2>nul
wevtutil cl Setup 2>nul
call :log "System logs cleaned"
exit /b

:clear_thumb
echo Cleaning thumbnail cache...
del /f /s /q "%USERPROFILE%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_*.db" 2>nul
call :log "Thumbnail cache cleaned"
exit /b

:clear_update_cache
echo Cleaning Windows Update cache...
del /f /s /q "%WINDIR%\SoftwareDistribution\Download\*" 2>nul
rd /s /q "%WINDIR%\SoftwareDistribution\Download" 2>nul
mkdir "%WINDIR%\SoftwareDistribution\Download" 2>nul
call :log "Windows Update cache cleaned"
exit /b

:clear_browser_cache
echo Cleaning browser caches...
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
    mkdir "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
)
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" 2>nul
    mkdir "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" 2>nul
)
if exist "%APPDATA%\Mozilla\Firefox\Profiles" (
    for /d %%i in ("%APPDATA%\Mozilla\Firefox\Profiles\*") do (
        if exist "%%i\cache2" (
            rd /s /q "%%i\cache2" 2>nul
            mkdir "%%i\cache2" 2>nul
        )
    )
)
call :log "Browser caches cleaned"
exit /b

:clear_restore_points
echo Deleting system restore points (except latest)...
vssadmin delete shadows /all /quiet >nul 2>&1
call :log "System restore points deleted (except latest)"
exit /b

:clear_patch_cache
echo Cleaning Windows Installer patch cache...
if exist "%WINDIR%\Installer\$PatchCache$" (
    rd /s /q "%WINDIR%\Installer\$PatchCache$" 2>nul
    mkdir "%WINDIR%\Installer\$PatchCache$" 2>nul
)
call :log "Patch cache cleaned"
exit /b

:: ============== HELPER FUNCTIONS ==============
:get_before
for /f "usebackq delims=" %%a in (`powershell -Command "(Get-PSDrive C).Free"`) do set before=%%a
exit /b

:show_freed
set before=%before%
powershell -Command "$before = [int64]%before%; $after = (Get-PSDrive C).Free; $freed = $after - $before; if ($freed -lt 0) { $freed = 0 }; if ($freed -ge 1073741824) { $gb = [math]::Round($freed/1073741824, 2); Write-Host \"Freed space: $gb GB\" } else { $mb = [math]::Round($freed/1048576, 2); Write-Host \"Freed space: $mb MB\" }"
call :log "Freed space: %freed_bytes% bytes"
exit /b

:red
powershell -Command "Write-Host '%~1' -ForegroundColor Red"
exit /b

:yellow
powershell -Command "Write-Host '%~1' -ForegroundColor Yellow"
exit /b

:log
if %GLOBAL_LOG_ENABLED%==1 (
    echo %date% %time% - %* >> "%LOGFILE%"
)
exit /b