// Package runner builds temporary worker batch files whose command lines are
// copied VERBATIM from the original C Drive Cleaner v2.9.bat.
//
// Layout rule: orchestration FIRST, function bodies LAST. Batch executes from
// the top; a function body's `exit /b` reached at top level would terminate
// the whole script, so sections must only be reachable via `call`.
package runner

import (
	"strings"

	"cdrivecleaner-neo/internal/batparse"
)

var headerLines = []string{
	"@echo off",
	"chcp 437 >nul",
	"title C Drive Cleaner neo - Worker",
	"setlocal enabledelayedexpansion",
}

func header(p *batparse.Parsed, logEnabled bool) []string {
	out := append([]string{}, headerLines...)
	if logEnabled {
		out = append(out, "set GLOBAL_LOG_ENABLED=1")
	} else {
		out = append(out, "set GLOBAL_LOG_ENABLED=0")
	}
	out = append(out, "set LOGFILE="+p.LogFile, "")
	return out
}

func embedSections(p *batparse.Parsed, names []string) []string {
	out := []string{}
	for _, n := range names {
		out = append(out, ":"+n)
		out = append(out, p.Sections[n]...)
		out = append(out, "")
	}
	return out
}

// BuildCleanRunner builds the Quick/Advanced clean worker.
func BuildCleanRunner(p *batparse.Parsed, logEnabled bool, fns []string) string {
	lines := header(p, logEnabled)
	// Verbatim line from the original :ask_log flow (creates the log dir).
	if logEnabled {
		lines = append(lines, `if not exist "C:\Log" mkdir "C:\Log" 2>nul`)
	}
	lines = append(lines, "echo [GUI] Task started")
	lines = append(lines, "call :get_before")
	for _, fn := range fns {
		lines = append(lines, "echo [STEP:"+fn+"]", "call :"+fn)
	}
	lines = append(lines,
		"echo.",
		"echo Clean completed!",
		"call :show_freed",
		"echo [GUI] Task finished",
		"exit /b 0",
		"",
	)
	lines = append(lines, embedSections(p, append(append([]string{}, fns...), "log", "get_before", "show_freed"))...)
	return strings.Join(lines, "\r\n") + "\r\n"
}

// BuildDiskRunner builds the disk-usage worker. letter must be A-Z (validated
// by the caller, identical to the original bat's strict validation).
func BuildDiskRunner(p *batparse.Parsed, logEnabled bool, letter string) string {
	lines := header(p, logEnabled)
	lines = append(lines,
		`set "drive_letter=`+letter+`"`,
		"echo [GUI] Checking disk usage...",
		strings.TrimSpace(p.DiskTestPath), // verbatim from original
		"if %errorlevel% neq 0 (",
		"    echo Drive %drive_letter%: does not exist.",
		"    exit /b 1",
		")",
		"echo.",
		"echo ====== Disk Usage for %drive_letter%: ======",
		`call :log "Disk usage checked for %drive_letter%"`,
		strings.TrimSpace(p.DiskInfo), // verbatim from original
		"echo ===================================",
		"echo [GUI] Task finished",
		"exit /b 0",
		"",
	)
	lines = append(lines, embedSections(p, []string{"log"})...)
	return strings.Join(lines, "\r\n") + "\r\n"
}

// BuildLargeFilesRunner builds the legacy PowerShell-based large-file worker.
// NOTE: neo 1.0 uses the native Go scanner (internal/scan) for speed; this
// runner is kept as a faithful fallback and for test parity.
func BuildLargeFilesRunner(p *batparse.Parsed, logEnabled bool, threshold string) string {
	lines := header(p, logEnabled)
	lines = append(lines,
		"echo [GUI] Searching for files larger than "+threshold+" GB on C: drive...",
		`call :log "Large file scan started, threshold = `+threshold+` GB"`,
		`set "FF_THRESHOLD_GB=`+threshold+`"`,
		strings.TrimSpace(p.LFEncoded), // verbatim from original
	)
	lines = append(lines, p.LFCountBlock...) // verbatim count block
	lines = append(lines,
		`call :log "Large file scan finished. Found %total_count% files."`,
		"echo =====================================",
		"echo (Only first 20 files are displayed)",
		"echo [GUI] Task finished",
		"exit /b 0",
		"",
	)
	lines = append(lines, embedSections(p, []string{"log"})...)
	return strings.Join(lines, "\r\n") + "\r\n"
}
