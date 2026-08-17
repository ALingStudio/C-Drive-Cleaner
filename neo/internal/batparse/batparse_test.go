package batparse_test

import (
	"bufio"
	"encoding/base64"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
	"unicode/utf16"

	"cdrivecleaner-neo/internal/batparse"
	"cdrivecleaner-neo/internal/runner"
)

const wantSHA = "9b9890679eca503d851ce45751ea59eeedc1a4415c2f402d38d1dd162d8c93d9"

func loadParsed(t *testing.T) (*batparse.Parsed, string) {
	t.Helper()
	path := filepath.Join("..", "..", "resources", "C Drive Cleaner v2.9.bat")
	parsed, err := batparse.Parse(path)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return parsed, string(raw)
}

func TestParseStructure(t *testing.T) {
	p, _ := loadParsed(t)
	if p.Version != "v2.9" {
		t.Errorf("version = %s", p.Version)
	}
	if len(p.CleanFunctions) != 11 {
		t.Errorf("clean fns = %d", len(p.CleanFunctions))
	}
	if len(p.QuickOrder) != 9 {
		t.Errorf("quick order = %d", len(p.QuickOrder))
	}
}

func TestEncodedCommandDecodes(t *testing.T) {
	p, _ := loadParsed(t)
	fields := strings.Fields(p.LFEncoded)
	b64 := fields[len(fields)-1]
	raw, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		t.Fatal(err)
	}
	u := make([]uint16, len(raw)/2)
	for i := 0; i < len(u); i++ {
		u[i] = uint16(raw[i*2]) | uint16(raw[i*2+1])<<8
	}
	s := string(utf16.Decode(u))
	if !strings.Contains(s, "RunspaceFactory") || !strings.Contains(s, "$env:FF_THRESHOLD_GB") {
		t.Error("decoded script missing expected content")
	}
}

// orchestration-only lines the GUI is allowed to add
var orchPatterns = []string{
	`@echo off`, `chcp 437 >nul`, `title C Drive Cleaner neo - Worker`,
	`setlocal enabledelayedexpansion`, `echo [GUI] Task started`,
	`echo [GUI] Task finished`, `echo [GUI] Checking disk usage...`,
	`echo [GUI] Searching for files larger than`, `exit /b 0`, `exit /b 1`,
	`echo.`, `echo Clean completed!`, `call :get_before`,
}

var orchRes = []*regexp.Regexp{
	regexp.MustCompile(`^echo \[STEP:clear_[a-z_]+\]$`),
	regexp.MustCompile(`^call :clear_[a-z_]+$`),
	regexp.MustCompile(`^call :log `),
	regexp.MustCompile(`^set GLOBAL_LOG_ENABLED=[01]$`),
	regexp.MustCompile(`^set LOGFILE=C:\\Log\\CleanLog\.txt$`),
	regexp.MustCompile(`^set "drive_letter=[A-Z]"$`),
	regexp.MustCompile(`^set "FF_THRESHOLD_GB=[\d.]+"$`),
	regexp.MustCompile(`^echo ====== Disk Usage for %drive_letter%: ======$`),
	regexp.MustCompile(`^echo ===================================$`),
	regexp.MustCompile(`^echo =====================================$`),
	regexp.MustCompile(`^echo \(Only first 20 files are displayed\)$`),
	regexp.MustCompile(`^if %errorlevel% neq 0 \($`),
	regexp.MustCompile(`^echo Drive %drive_letter%: does not exist\.$`),
	regexp.MustCompile(`^\)$`),
	regexp.MustCompile(`^if not exist "C:\\Log" mkdir "C:\\Log" 2>nul$`),
}

func isOrch(l string) bool {
	for _, o := range orchPatterns {
		if strings.HasPrefix(l, o) {
			return true
		}
	}
	for _, r := range orchRes {
		if r.MatchString(l) {
			return true
		}
	}
	return false
}

// checkVerbatim asserts every non-orchestration, non-label line of the runner
// exists verbatim in the original bat.
func checkVerbatim(t *testing.T, runnerText, original string) []string {
	t.Helper()
	origSet := map[string]bool{}
	sc := bufio.NewScanner(strings.NewReader(original))
	sc.Buffer(make([]byte, 1024*1024), 1024*1024)
	for sc.Scan() {
		origSet[strings.TrimSpace(sc.Text())] = true
	}
	foreign := []string{}
	for _, raw := range strings.Split(runnerText, "\r\n") {
		l := strings.TrimSpace(raw)
		if l == "" || strings.HasPrefix(l, ":") || isOrch(l) {
			continue
		}
		if !origSet[l] {
			foreign = append(foreign, l)
		}
	}
	return foreign
}

func TestQuickRunnerVerbatim(t *testing.T) {
	p, original := loadParsed(t)
	r := runner.BuildCleanRunner(p, true, p.QuickOrder)
	if f := checkVerbatim(t, r, original); len(f) > 0 {
		t.Errorf("foreign lines: %v", f[:min(5, len(f))])
	}
	// control-flow: orchestration must precede every function section
	lines := strings.Split(r, "\r\n")
	foundStart := false
	for _, l := range lines {
		l = strings.TrimSpace(l)
		if l == "echo [GUI] Task started" {
			foundStart = true
			break
		}
		if strings.HasPrefix(l, ":clear_") {
			t.Fatal("layout bug: function section appears before orchestration")
		}
	}
	if !foundStart {
		t.Fatal("orchestration start marker not found")
	}
}

func TestAdvancedRunnerVerbatim(t *testing.T) {
	p, original := loadParsed(t)
	r := runner.BuildCleanRunner(p, false, p.CleanFunctions)
	if f := checkVerbatim(t, r, original); len(f) > 0 {
		t.Errorf("foreign lines: %v", f[:min(5, len(f))])
	}
}

func TestDiskRunner(t *testing.T) {
	p, _ := loadParsed(t)
	r := runner.BuildDiskRunner(p, false, "C")
	if !strings.Contains(r, strings.TrimSpace(p.DiskTestPath)) {
		t.Error("missing verbatim Test-Path line")
	}
	if !strings.Contains(r, strings.TrimSpace(p.DiskInfo)) {
		t.Error("missing verbatim Get-PSDrive line")
	}
}

func TestLargeFilesRunnerLegacy(t *testing.T) {
	p, _ := loadParsed(t)
	r := runner.BuildLargeFilesRunner(p, true, "1")
	if !strings.Contains(r, strings.TrimSpace(p.LFEncoded)) {
		t.Error("missing verbatim EncodedCommand line")
	}
	for _, l := range p.LFCountBlock {
		if !strings.Contains(r, strings.TrimSpace(l)) {
			t.Errorf("missing count block line: %s", l)
		}
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
