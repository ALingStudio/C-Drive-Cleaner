@echo off
chcp 437 >nul
title C Drive Cleaner
color 0A
setlocal enabledelayedexpansion

:: Check admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
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
echo          C Drive Cleaner v2.9
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
set /p clean_browser=Clean browser caches (Chrome/Edge/Firefox, all profiles)? (Y/N):
echo.
echo [!!!] Caution items (may affect system recovery):
call :red "WARNING: This deletes ALL system restore points. You will NOT be able to roll back the system afterwards."
set /p clean_restore=Delete ALL system restore points? (Y/N):
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
set "drive_letter="
set /p drive_letter=Enter drive letter (e.g., C, D, E):
set "drive_letter=%drive_letter: =%"
if /i "%drive_letter%"=="stop" goto menu
:: Strict validation: only a single letter A-Z may reach PowerShell
set "drive_ok="
for %%i in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if /i "!drive_letter!"=="%%i" (
        set "drive_letter=%%i"
        set "drive_ok=1"
    )
)
if not defined drive_ok (
    echo Invalid drive letter. Please enter a single letter from A to Z.
    pause
    goto disk_loop
)
powershell -NoProfile -Command "if (Test-Path '%drive_letter%:\') { exit 0 } else { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Drive %drive_letter%: does not exist.
    pause
    goto disk_loop
)
echo.
echo ====== Disk Usage for %drive_letter%: ======
call :log "Disk usage checked for %drive_letter%"
powershell -NoProfile -Command "$d = Get-PSDrive %drive_letter%; Write-Host ('Total  : {0} GB' -f [math]::Round(($d.Used + $d.Free)/1GB, 2)); Write-Host ('Used   : {0} GB' -f [math]::Round($d.Used/1GB, 2)); Write-Host ('Free   : {0} GB' -f [math]::Round($d.Free/1GB, 2))"
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
set "size_input="
set /p size_input=Size (GB):
set "size_input=%size_input: =%"
if /i "%size_input%"=="stop" goto menu
if "%size_input%"=="" goto lf_invalid
:: Strict validation: only digits and the dot are allowed (blocks command injection)
set "chk=%size_input%"
for %%c in (0 1 2 3 4 5 6 7 8 9 .) do set "chk=!chk:%%c=!"
if not "%chk%"=="" goto lf_invalid
:: Normalize the number using PowerShell (invariant culture, PS2 compatible)
powershell -NoProfile -Command "$v = -1; try { $v = [double]::Parse('%size_input%', [System.Globalization.CultureInfo]::InvariantCulture) } catch { $v = -1 }; if ($v -lt 0) { 'invalid' | Out-File -FilePath '%TEMP%\sizecheck.txt' -Encoding ASCII } else { $v.ToString([System.Globalization.CultureInfo]::InvariantCulture) | Out-File -FilePath '%TEMP%\sizecheck.txt' -Encoding ASCII }"
set "rounded="
set /p rounded=<"%TEMP%\sizecheck.txt"
del "%TEMP%\sizecheck.txt" >nul
if "%rounded%"=="invalid" goto lf_invalid
if "%rounded%"=="" goto lf_invalid
echo.
echo Searching for files larger than %rounded% GB on C: drive...
echo (Press Ctrl+C to cancel at any time)
echo This may take a while...
echo.
call :log "Large file scan started, threshold = %rounded% GB"
:: The scan script is passed via -EncodedCommand (UTF-16LE base64) so that no
:: batch escaping can break it. Human-readable copy of the script:
::   $thresholdGB = 0
::   if ($env:FF_THRESHOLD_GB) {
::       $thresholdGB = [double]::Parse($env:FF_THRESHOLD_GB, [System.Globalization.CultureInfo]::InvariantCulture)
::   }
::   $threshold = $thresholdGB * 1GB
::   $searchPath = 'C:\'
::   $maxConcurrent = 10
::   $invariant = [System.Globalization.CultureInfo]::InvariantCulture
::   $rootResults = @()
::   Get-ChildItem -Path $searchPath -Force -ErrorAction SilentlyContinue ^| Where-Object { -not $_.PSIsContainer } ^| ForEach-Object {
::       if ($_.Length -gt $threshold) {
::           $rootResults += New-Object PSObject -Property @{ Path = $_.FullName; Size = $_.Length }
::       }
::   }
::   $dirs = @(Get-ChildItem -Path $searchPath -Force -ErrorAction SilentlyContinue ^| Where-Object { $_.PSIsContainer })
::   $pool = [System.Management.Automation.Runspaces.RunspaceFactory]::CreateRunspacePool(1, $maxConcurrent)
::   $pool.Open()
::   $scriptBlock = {
::       param($dirPath, $threshold)
::       $found = @()
::       Get-ChildItem -Path $dirPath -Recurse -Force -ErrorAction SilentlyContinue ^| Where-Object { -not $_.PSIsContainer } ^| ForEach-Object {
::           if ($_.Length -gt $threshold) {
::               $found += New-Object PSObject -Property @{ Path = $_.FullName; Size = $_.Length }
::           }
::       }
::       return $found
::   }
::   $jobs = @()
::   foreach ($dir in $dirs) {
::       $ps = [System.Management.Automation.PowerShell]::Create().AddScript($scriptBlock).AddArgument($dir.FullName).AddArgument($threshold)
::       $ps.RunspacePool = $pool
::       $jobs += @{ PowerShell = $ps; Handle = $ps.BeginInvoke() }
::   }
::   $allResults = @()
::   foreach ($j in $jobs) {
::       $out = $j.PowerShell.EndInvoke($j.Handle)
::       if ($out) { $allResults += $out }
::       $j.PowerShell.Dispose()
::   }
::   $pool.Dispose()
::   $allResults += $rootResults
::   $sorted = @($allResults ^| Sort-Object -Property Size -Descending)
::   Write-Host '  Size(GB)  File Path' -ForegroundColor Yellow
::   if ($sorted.Count -eq 0) {
::       Write-Host 'No files found.' -ForegroundColor Cyan
::   } else {
::       $top = @($sorted ^| Select-Object -First 20)
::       foreach ($item in $top) {
::           $sizeGB = [math]::Round($item.Size / 1GB, 2)
::           Write-Host ('{0,8} GB  {1}' -f $sizeGB.ToString($invariant), $item.Path)
::       }
::   }
::   Write-Host ('Total files found: ' + $sorted.Count)
::   $sorted.Count ^| Out-File -FilePath (Join-Path $env:TEMP 'count.txt') -Encoding ASCII
set "FF_THRESHOLD_GB=%rounded%"
powershell -NoProfile -EncodedCommand JAB0AGgAcgBlAHMAaABvAGwAZABHAEIAIAA9ACAAMAAKAGkAZgAgACgAJABlAG4AdgA6AEYARgBfAFQASABSAEUAUwBIAE8ATABEAF8ARwBCACkAIAB7AAoAIAAgACAAIAAkAHQAaAByAGUAcwBoAG8AbABkAEcAQgAgAD0AIABbAGQAbwB1AGIAbABlAF0AOgA6AFAAYQByAHMAZQAoACQAZQBuAHYAOgBGAEYAXwBUAEgAUgBFAFMASABPAEwARABfAEcAQgAsACAAWwBTAHkAcwB0AGUAbQAuAEcAbABvAGIAYQBsAGkAegBhAHQAaQBvAG4ALgBDAHUAbAB0AHUAcgBlAEkAbgBmAG8AXQA6ADoASQBuAHYAYQByAGkAYQBuAHQAQwB1AGwAdAB1AHIAZQApAAoAfQAKACQAdABoAHIAZQBzAGgAbwBsAGQAIAA9ACAAJAB0AGgAcgBlAHMAaABvAGwAZABHAEIAIAAqACAAMQBHAEIACgAkAHMAZQBhAHIAYwBoAFAAYQB0AGgAIAA9ACAAJwBDADoAXAAnAAoAJABtAGEAeABDAG8AbgBjAHUAcgByAGUAbgB0ACAAPQAgADEAMAAKACQAaQBuAHYAYQByAGkAYQBuAHQAIAA9ACAAWwBTAHkAcwB0AGUAbQAuAEcAbABvAGIAYQBsAGkAegBhAHQAaQBvAG4ALgBDAHUAbAB0AHUAcgBlAEkAbgBmAG8AXQA6ADoASQBuAHYAYQByAGkAYQBuAHQAQwB1AGwAdAB1AHIAZQAKAAoAIwAgAFIAbwBvAHQAIABkAGkAcgBlAGMAdABvAHIAeQAgAGYAaQBsAGUAcwAgACgAbgBvAG4ALQByAGUAYwB1AHIAcwBpAHYAZQApAAoAJAByAG8AbwB0AFIAZQBzAHUAbAB0AHMAIAA9ACAAQAAoACkACgBHAGUAdAAtAEMAaABpAGwAZABJAHQAZQBtACAALQBQAGEAdABoACAAJABzAGUAYQByAGMAaABQAGEAdABoACAALQBGAG8AcgBjAGUAIAAtAEUAcgByAG8AcgBBAGMAdABpAG8AbgAgAFMAaQBsAGUAbgB0AGwAeQBDAG8AbgB0AGkAbgB1AGUAIAB8ACAAVwBoAGUAcgBlAC0ATwBiAGoAZQBjAHQAIAB7ACAALQBuAG8AdAAgACQAXwAuAFAAUwBJAHMAQwBvAG4AdABhAGkAbgBlAHIAIAB9ACAAfAAgAEYAbwByAEUAYQBjAGgALQBPAGIAagBlAGMAdAAgAHsACgAgACAAIAAgAGkAZgAgACgAJABfAC4ATABlAG4AZwB0AGgAIAAtAGcAdAAgACQAdABoAHIAZQBzAGgAbwBsAGQAKQAgAHsACgAgACAAIAAgACAAIAAgACAAJAByAG8AbwB0AFIAZQBzAHUAbAB0AHMAIAArAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUABTAE8AYgBqAGUAYwB0ACAALQBQAHIAbwBwAGUAcgB0AHkAIABAAHsAIABQAGEAdABoACAAPQAgACQAXwAuAEYAdQBsAGwATgBhAG0AZQA7ACAAUwBpAHoAZQAgAD0AIAAkAF8ALgBMAGUAbgBnAHQAaAAgAH0ACgAgACAAIAAgAH0ACgB9AAoACgAjACAARgBpAHIAcwB0AC0AbABlAHYAZQBsACAAcwB1AGIAZABpAHIAZQBjAHQAbwByAGkAZQBzACAAKABzAGMAYQBuAG4AZQBkACAAaQBuACAAcABhAHIAYQBsAGwAZQBsACkACgAkAGQAaQByAHMAIAA9ACAAQAAoAEcAZQB0AC0AQwBoAGkAbABkAEkAdABlAG0AIAAtAFAAYQB0AGgAIAAkAHMAZQBhAHIAYwBoAFAAYQB0AGgAIAAtAEYAbwByAGMAZQAgAC0ARQByAHIAbwByAEEAYwB0AGkAbwBuACAAUwBpAGwAZQBuAHQAbAB5AEMAbwBuAHQAaQBuAHUAZQAgAHwAIABXAGgAZQByAGUALQBPAGIAagBlAGMAdAAgAHsAIAAkAF8ALgBQAFMASQBzAEMAbwBuAHQAYQBpAG4AZQByACAAfQApAAoACgAkAHAAbwBvAGwAIAA9ACAAWwBTAHkAcwB0AGUAbQAuAE0AYQBuAGEAZwBlAG0AZQBuAHQALgBBAHUAdABvAG0AYQB0AGkAbwBuAC4AUgB1AG4AcwBwAGEAYwBlAHMALgBSAHUAbgBzAHAAYQBjAGUARgBhAGMAdABvAHIAeQBdADoAOgBDAHIAZQBhAHQAZQBSAHUAbgBzAHAAYQBjAGUAUABvAG8AbAAoADEALAAgACQAbQBhAHgAQwBvAG4AYwB1AHIAcgBlAG4AdAApAAoAJABwAG8AbwBsAC4ATwBwAGUAbgAoACkACgAKACQAcwBjAHIAaQBwAHQAQgBsAG8AYwBrACAAPQAgAHsACgAgACAAIAAgAHAAYQByAGEAbQAoACQAZABpAHIAUABhAHQAaAAsACAAJAB0AGgAcgBlAHMAaABvAGwAZAApAAoAIAAgACAAIAAkAGYAbwB1AG4AZAAgAD0AIABAACgAKQAKACAAIAAgACAARwBlAHQALQBDAGgAaQBsAGQASQB0AGUAbQAgAC0AUABhAHQAaAAgACQAZABpAHIAUABhAHQAaAAgAC0AUgBlAGMAdQByAHMAZQAgAC0ARgBvAHIAYwBlACAALQBFAHIAcgBvAHIAQQBjAHQAaQBvAG4AIABTAGkAbABlAG4AdABsAHkAQwBvAG4AdABpAG4AdQBlACAAfAAgAFcAaABlAHIAZQAtAE8AYgBqAGUAYwB0ACAAewAgAC0AbgBvAHQAIAAkAF8ALgBQAFMASQBzAEMAbwBuAHQAYQBpAG4AZQByACAAfQAgAHwAIABGAG8AcgBFAGEAYwBoAC0ATwBiAGoAZQBjAHQAIAB7AAoAIAAgACAAIAAgACAAIAAgAGkAZgAgACgAJABfAC4ATABlAG4AZwB0AGgAIAAtAGcAdAAgACQAdABoAHIAZQBzAGgAbwBsAGQAKQAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAGYAbwB1AG4AZAAgACsAPQAgAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABQAFMATwBiAGoAZQBjAHQAIAAtAFAAcgBvAHAAZQByAHQAeQAgAEAAewAgAFAAYQB0AGgAIAA9ACAAJABfAC4ARgB1AGwAbABOAGEAbQBlADsAIABTAGkAegBlACAAPQAgACQAXwAuAEwAZQBuAGcAdABoACAAfQAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAB9AAoAIAAgACAAIAByAGUAdAB1AHIAbgAgACQAZgBvAHUAbgBkAAoAfQAKAAoAJABqAG8AYgBzACAAPQAgAEAAKAApAAoAZgBvAHIAZQBhAGMAaAAgACgAJABkAGkAcgAgAGkAbgAgACQAZABpAHIAcwApACAAewAKACAAIAAgACAAJABwAHMAIAA9ACAAWwBTAHkAcwB0AGUAbQAuAE0AYQBuAGEAZwBlAG0AZQBuAHQALgBBAHUAdABvAG0AYQB0AGkAbwBuAC4AUABvAHcAZQByAFMAaABlAGwAbABdADoAOgBDAHIAZQBhAHQAZQAoACkALgBBAGQAZABTAGMAcgBpAHAAdAAoACQAcwBjAHIAaQBwAHQAQgBsAG8AYwBrACkALgBBAGQAZABBAHIAZwB1AG0AZQBuAHQAKAAkAGQAaQByAC4ARgB1AGwAbABOAGEAbQBlACkALgBBAGQAZABBAHIAZwB1AG0AZQBuAHQAKAAkAHQAaAByAGUAcwBoAG8AbABkACkACgAgACAAIAAgACQAcABzAC4AUgB1AG4AcwBwAGEAYwBlAFAAbwBvAGwAIAA9ACAAJABwAG8AbwBsAAoAIAAgACAAIAAkAGoAbwBiAHMAIAArAD0AIABAAHsAIABQAG8AdwBlAHIAUwBoAGUAbABsACAAPQAgACQAcABzADsAIABIAGEAbgBkAGwAZQAgAD0AIAAkAHAAcwAuAEIAZQBnAGkAbgBJAG4AdgBvAGsAZQAoACkAIAB9AAoAfQAKAAoAJABhAGwAbABSAGUAcwB1AGwAdABzACAAPQAgAEAAKAApAAoAZgBvAHIAZQBhAGMAaAAgACgAJABqACAAaQBuACAAJABqAG8AYgBzACkAIAB7AAoAIAAgACAAIAAkAG8AdQB0ACAAPQAgACQAagAuAFAAbwB3AGUAcgBTAGgAZQBsAGwALgBFAG4AZABJAG4AdgBvAGsAZQAoACQAagAuAEgAYQBuAGQAbABlACkACgAgACAAIAAgAGkAZgAgACgAJABvAHUAdAApACAAewAgACQAYQBsAGwAUgBlAHMAdQBsAHQAcwAgACsAPQAgACQAbwB1AHQAIAB9AAoAIAAgACAAIAAkAGoALgBQAG8AdwBlAHIAUwBoAGUAbABsAC4ARABpAHMAcABvAHMAZQAoACkACgB9AAoAJABwAG8AbwBsAC4ARABpAHMAcABvAHMAZQAoACkACgAKACQAYQBsAGwAUgBlAHMAdQBsAHQAcwAgACsAPQAgACQAcgBvAG8AdABSAGUAcwB1AGwAdABzAAoAJABzAG8AcgB0AGUAZAAgAD0AIABAACgAJABhAGwAbABSAGUAcwB1AGwAdABzACAAfAAgAFMAbwByAHQALQBPAGIAagBlAGMAdAAgAC0AUAByAG8AcABlAHIAdAB5ACAAUwBpAHoAZQAgAC0ARABlAHMAYwBlAG4AZABpAG4AZwApAAoACgBXAHIAaQB0AGUALQBIAG8AcwB0ACAAJwAgACAAUwBpAHoAZQAoAEcAQgApACAAIABGAGkAbABlACAAUABhAHQAaAAnACAALQBGAG8AcgBlAGcAcgBvAHUAbgBkAEMAbwBsAG8AcgAgAFkAZQBsAGwAbwB3AAoAaQBmACAAKAAkAHMAbwByAHQAZQBkAC4AQwBvAHUAbgB0ACAALQBlAHEAIAAwACkAIAB7AAoAIAAgACAAIABXAHIAaQB0AGUALQBIAG8AcwB0ACAAJwBOAG8AIABmAGkAbABlAHMAIABmAG8AdQBuAGQALgAnACAALQBGAG8AcgBlAGcAcgBvAHUAbgBkAEMAbwBsAG8AcgAgAEMAeQBhAG4ACgB9ACAAZQBsAHMAZQAgAHsACgAgACAAIAAgACQAdABvAHAAIAA9ACAAQAAoACQAcwBvAHIAdABlAGQAIAB8ACAAUwBlAGwAZQBjAHQALQBPAGIAagBlAGMAdAAgAC0ARgBpAHIAcwB0ACAAMgAwACkACgAgACAAIAAgAGYAbwByAGUAYQBjAGgAIAAoACQAaQB0AGUAbQAgAGkAbgAgACQAdABvAHAAKQAgAHsACgAgACAAIAAgACAAIAAgACAAJABzAGkAegBlAEcAQgAgAD0AIABbAG0AYQB0AGgAXQA6ADoAUgBvAHUAbgBkACgAJABpAHQAZQBtAC4AUwBpAHoAZQAgAC8AIAAxAEcAQgAsACAAMgApAAoAIAAgACAAIAAgACAAIAAgAFcAcgBpAHQAZQAtAEgAbwBzAHQAIAAoACcAewAwACwAOAB9ACAARwBCACAAIAB7ADEAfQAnACAALQBmACAAJABzAGkAegBlAEcAQgAuAFQAbwBTAHQAcgBpAG4AZwAoACQAaQBuAHYAYQByAGkAYQBuAHQAKQAsACAAJABpAHQAZQBtAC4AUABhAHQAaAApAAoAIAAgACAAIAB9AAoAfQAKAFcAcgBpAHQAZQAtAEgAbwBzAHQAIAAoACcAVABvAHQAYQBsACAAZgBpAGwAZQBzACAAZgBvAHUAbgBkADoAIAAnACAAKwAgACQAcwBvAHIAdABlAGQALgBDAG8AdQBuAHQAKQAKACQAcwBvAHIAdABlAGQALgBDAG8AdQBuAHQAIAB8ACAATwB1AHQALQBGAGkAbABlACAALQBGAGkAbABlAFAAYQB0AGgAIAAoAEoAbwBpAG4ALQBQAGEAdABoACAAJABlAG4AdgA6AFQARQBNAFAAIAAnAGMAbwB1AG4AdAAuAHQAeAB0ACcAKQAgAC0ARQBuAGMAbwBkAGkAbgBnACAAQQBTAEMASQBJAAoA
set "total_count="
if exist "%TEMP%\count.txt" (
    set /p total_count=<"%TEMP%\count.txt"
    del "%TEMP%\count.txt" >nul 2>&1
)
if "%total_count%"=="" set total_count=0
call :log "Large file scan finished. Found %total_count% files."
echo =====================================
echo (Only first 20 files are displayed)
pause
goto menu

:lf_invalid
echo Invalid input. Please enter a number, e.g. 1, 2.5 or 0.5
pause
goto large_files

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
powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" 2>nul
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
net stop wuauserv >nul 2>&1
del /f /s /q "%WINDIR%\SoftwareDistribution\Download\*" 2>nul
rd /s /q "%WINDIR%\SoftwareDistribution\Download" 2>nul
mkdir "%WINDIR%\SoftwareDistribution\Download" 2>nul
net start wuauserv >nul 2>&1
call :log "Windows Update cache cleaned"
exit /b

:clear_browser_cache
echo Cleaning browser caches...
if exist "%LOCALAPPDATA%\Google\Chrome\User Data" (
    for /d %%i in ("%LOCALAPPDATA%\Google\Chrome\User Data\*") do (
        if exist "%%i\Cache" (
            rd /s /q "%%i\Cache" 2>nul
            mkdir "%%i\Cache" 2>nul
        )
    )
)
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data" (
    for /d %%i in ("%LOCALAPPDATA%\Microsoft\Edge\User Data\*") do (
        if exist "%%i\Cache" (
            rd /s /q "%%i\Cache" 2>nul
            mkdir "%%i\Cache" 2>nul
        )
    )
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
echo Deleting ALL system restore points...
vssadmin delete shadows /all /quiet >nul 2>&1
call :log "System restore points deleted - ALL"
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
set "before="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-PSDrive C).Free"`) do set "before=%%a"
exit /b

:show_freed
set "after="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-PSDrive C).Free"`) do set "after=%%a"
if not defined before set before=0
if not defined after set after=0
set /a freed_bytes=after-before
if %freed_bytes% lss 0 set freed_bytes=0
set /a freed_mb=freed_bytes/1048576
if %freed_mb% lss 1024 goto show_mb
set /a gb100=freed_bytes*100/1073741824
set /a gb_int=gb100/100
set /a gb_frac=gb100%%100
if %gb_frac% lss 10 goto show_gb_pad
echo Freed space: %gb_int%.%gb_frac% GB
goto show_done
:show_gb_pad
echo Freed space: %gb_int%.0%gb_frac% GB
goto show_done
:show_mb
echo Freed space: %freed_mb% MB
:show_done
call :log "Freed space: %freed_bytes% bytes"
exit /b

:red
powershell -NoProfile -Command "Write-Host '%~1' -ForegroundColor Red"
exit /b

:yellow
powershell -NoProfile -Command "Write-Host '%~1' -ForegroundColor Yellow"
exit /b

:log
if not "%GLOBAL_LOG_ENABLED%"=="1" exit /b
>>"%LOGFILE%" echo %date% %time% - %*
exit /b
