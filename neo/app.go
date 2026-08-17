package main

import (
	"bufio"
	"context"
	"crypto/sha256"
	"embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"cdrivecleaner-neo/internal/batparse"
	"cdrivecleaner-neo/internal/runner"
	"cdrivecleaner-neo/internal/scan"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed resources/*.bat
var batFS embed.FS

const (
	appDisplayName = "C Drive Cleaner neo"
	appNeoVersion  = "neo 1.0"
	batFileName    = "C Drive Cleaner v2.9.bat"
)

type App struct {
	ctx     context.Context
	parsed  *batparse.Parsed
	batSHA  string
	batRaw  []byte
	logPath string

	mu          sync.Mutex
	running     bool
	runningKind string
	cancelReq   bool
	cmd         *exec.Cmd
	largeCancel context.CancelFunc
	simCancel   chan struct{}
}

func NewApp() *App {
	return &App{}
}

// ------------------------------------------------------------------ helpers

func isWindows() bool { return runtime.GOOS == "windows" }

func dataDir() string {
	base, err := os.UserConfigDir()
	if err != nil {
		base = os.TempDir()
	}
	return filepath.Join(base, "c-drive-cleaner-neo")
}

func (a *App) appLog(line string) {
	dir := filepath.Join(dataDir(), "logs")
	_ = os.MkdirAll(dir, 0o755)
	f, err := os.OpenFile(a.logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()
	stamp := time.Now().Format("2006-01-02 15:04:05")
	fmt.Fprintf(f, "%s | %s\n", stamp, line)
}

// cleanLog appends to C:\Log\CleanLog.txt in the original format when global
// logging is enabled (parity with the original bat's :log helper).
func (a *App) cleanLog(msg string) {
	if !a.loadSettings().LogEnabled {
		return
	}
	dir := `C:\Log`
	_ = os.MkdirAll(dir, 0o755)
	f, err := os.OpenFile(`C:\Log\CleanLog.txt`, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()
	fmt.Fprintf(f, "%s - %s\n", time.Now().Format("2006-01-02 15:04:05.00"), msg)
}

func (a *App) settingsPath() string { return filepath.Join(dataDir(), "settings.json") }

type Settings struct {
	LogEnabled bool   `json:"logEnabled"`
	Lang       string `json:"lang"`
}

func (a *App) loadSettings() Settings {
	s := Settings{LogEnabled: true} // neo: logging ON by default
	raw, err := os.ReadFile(a.settingsPath())
	if err == nil {
		_ = json.Unmarshal(raw, &s)
	}
	return s
}

func (a *App) saveSettings(s Settings) {
	_ = os.MkdirAll(dataDir(), 0o755)
	raw, _ := json.MarshalIndent(s, "", "  ")
	_ = os.WriteFile(a.settingsPath(), raw, 0o644)
}

func (a *App) isAdmin() interface{} {
	if !isWindows() {
		return nil
	}
	cmd := exec.Command("net", "session")
	cmd.Stdout, cmd.Stderr = nil, nil
	return cmd.Run() == nil
}

// ------------------------------------------------------------------ startup

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.logPath = filepath.Join(dataDir(), "logs", "app.log")

	raw, err := batFS.ReadFile("resources/" + batFileName)
	if err != nil {
		a.appLog("FATAL: embedded bat missing: " + err.Error())
		wailsruntime.MessageDialog(ctx, wailsruntime.MessageDialogOptions{
			Title: appDisplayName, Message: "内置原版脚本缺失: " + err.Error(),
		})
		wailsruntime.Quit(ctx)
		return
	}
	a.batRaw = raw
	sum := sha256.Sum256(raw)
	a.batSHA = hex.EncodeToString(sum[:])

	parsed, err := batparse.ParseText(string(raw), batFileName)
	if err != nil {
		a.appLog("FATAL bat parse error: " + err.Error())
		wailsruntime.MessageDialog(ctx, wailsruntime.MessageDialogOptions{
			Title: appDisplayName, Message: "无法解析原版脚本: " + err.Error(),
		})
		wailsruntime.Quit(ctx)
		return
	}
	a.parsed = parsed
	a.appLog(fmt.Sprintf("bat parsed OK: %s, sha256=%s, windows=%v", parsed.Version, a.batSHA, isWindows()))
}

// ------------------------------------------------------------------ IPC API

func (a *App) Info() map[string]interface{} {
	runningFromTemp := false
	if isWindows() {
		exe, _ := os.Executable()
		runningFromTemp = strings.HasPrefix(strings.ToLower(exe), strings.ToLower(os.TempDir())+`\`)
	}
	return map[string]interface{}{
		"appVersion":      appNeoVersion,
		"batVersion":      a.parsed.Version,
		"batSha256":       a.batSHA,
		"platform":        runtime.GOOS,
		"simulation":      !isWindows(),
		"admin":           a.isAdmin(),
		"logFile":         a.parsed.LogFile,
		"runningFromTemp": runningFromTemp,
		"appName":         appDisplayName,
	}
}

func (a *App) GetSettings() Settings { return a.loadSettings() }

func (a *App) SetSettings(logEnabled bool, lang string) Settings {
	s := a.loadSettings()
	s.LogEnabled = logEnabled
	s.Lang = lang
	a.saveSettings(s)
	a.appLog(fmt.Sprintf("settings updated: %+v", s))
	return s
}

func (a *App) Busy() bool {
	a.mu.Lock()
	defer a.mu.Unlock()
	return a.running
}

type runResult = map[string]interface{}

func (a *App) startRun(kind string) bool {
	a.mu.Lock()
	defer a.mu.Unlock()
	if a.running {
		return false
	}
	a.running = true
	a.runningKind = kind
	a.cancelReq = false
	return true
}

func (a *App) endRun() {
	a.mu.Lock()
	a.running = false
	a.runningKind = ""
	a.mu.Unlock()
}

func (a *App) emit(line string) {
	if a.ctx != nil {
		wailsruntime.EventsEmit(a.ctx, "run:output", line)
	}
}

func (a *App) emitDone(code int, kind string) {
	if a.ctx != nil {
		wailsruntime.EventsEmit(a.ctx, "run:done", map[string]interface{}{"code": code, "kind": kind})
	}
}

func (a *App) writeWorker(text string) (string, error) {
	dir := filepath.Join(dataDir(), "run")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", err
	}
	p := filepath.Join(dir, fmt.Sprintf("worker-%d.bat", time.Now().UnixMilli()))
	return p, os.WriteFile(p, []byte(text), 0o644)
}

// runWorkerBat executes the generated worker with cmd.exe, streaming output.
func (a *App) runWorkerBat(text, kind string) {
	workerPath, err := a.writeWorker(text)
	if err != nil {
		a.emit("[error] " + err.Error())
		a.endRun()
		a.emitDone(1, kind)
		return
	}
	a.appLog(fmt.Sprintf("worker written: %s (kind=%s)", workerPath, kind))
	defer os.Remove(workerPath)

	cmd := exec.Command("cmd.exe", "/d", "/c", workerPath)
	hideWindow(cmd)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		a.emit("[error] " + err.Error())
		a.endRun()
		a.emitDone(1, kind)
		return
	}
	stderr, _ := cmd.StderrPipe()
	if err := cmd.Start(); err != nil {
		a.emit("[error] " + err.Error())
		a.endRun()
		a.emitDone(1, kind)
		return
	}
	a.mu.Lock()
	a.cmd = cmd
	a.mu.Unlock()

	scanLines := func(r interface{ Read([]byte) (int, error) }, prefix string) {
		sc := bufio.NewScanner(r)
		sc.Buffer(make([]byte, 1024*1024), 1024*1024)
		for sc.Scan() {
			line := strings.TrimRight(sc.Text(), "\r")
			if prefix != "" && strings.TrimSpace(line) == "" {
				continue
			}
			if prefix != "" {
				line = prefix + line
			}
			a.emit(line)
		}
	}
	done := make(chan struct{})
	go func() { scanLines(stderr, "[stderr] "); close(done) }()
	scanLines(stdout, "")
	<-done

	err = cmd.Wait()
	code := 0
	if err != nil {
		if ee, ok := err.(*exec.ExitError); ok {
			code = ee.ExitCode()
		} else {
			code = 1
		}
	}
	a.mu.Lock()
	a.cmd = nil
	a.mu.Unlock()
	a.appLog(fmt.Sprintf("task %s exited code=%d", kind, code))
	a.endRun()
	a.emitDone(code, kind)
}

// ------------------------------------------------------------------ tasks

func (a *App) RunQuick() runResult {
	if !a.startRun("quick") {
		return runResult{"error": "busy"}
	}
	s := a.loadSettings()
	a.appLog("=== Quick Clean requested ===")
	if !isWindows() {
		go a.simClean(a.parsed.QuickOrder, "quick")
		return runResult{"ok": true, "simulation": true}
	}
	text := runner.BuildCleanRunner(a.parsed, s.LogEnabled, a.parsed.QuickOrder)
	go a.runWorkerBat(text, "quick")
	return runResult{"ok": true}
}

func (a *App) RunAdvanced(items []string) runResult {
	if !a.startRun("advanced") {
		return runResult{"error": "busy"}
	}
	want := map[string]bool{}
	for _, it := range items {
		want[it] = true
	}
	fns := []string{}
	for _, f := range a.parsed.CleanFunctions {
		if want[f] {
			fns = append(fns, f)
		}
	}
	if len(fns) == 0 {
		a.endRun()
		return runResult{"error": "empty"}
	}
	s := a.loadSettings()
	a.appLog("=== Advanced Clean requested: " + strings.Join(fns, ", ") + " ===")
	if !isWindows() {
		go a.simClean(fns, "advanced")
		return runResult{"ok": true, "simulation": true}
	}
	text := runner.BuildCleanRunner(a.parsed, s.LogEnabled, fns)
	go a.runWorkerBat(text, "advanced")
	return runResult{"ok": true}
}

var letterRe = regexp.MustCompile(`^[A-Z]$`)

func (a *App) RunDisk(letter string) runResult {
	if !a.startRun("disk") {
		return runResult{"error": "busy"}
	}
	L := strings.ToUpper(strings.TrimSpace(letter))
	if !letterRe.MatchString(L) {
		a.endRun()
		return runResult{"error": "invalid-letter"}
	}
	s := a.loadSettings()
	a.appLog("=== Disk Usage requested: " + L + ": ===")
	if !isWindows() {
		go a.simDisk(L)
		return runResult{"ok": true, "simulation": true}
	}
	text := runner.BuildDiskRunner(a.parsed, s.LogEnabled, L)
	go a.runWorkerBat(text, "disk")
	return runResult{"ok": true}
}

var sizeRe = regexp.MustCompile(`^[0-9.]+$`)

// RunLarge validates input and starts the large-file scan.
// neo 1.0: uses the native Go concurrent scanner (internal/scan) — much
// faster than the legacy PowerShell runspace approach.
func (a *App) RunLarge(threshold string) runResult {
	if !a.startRun("large") {
		return runResult{"error": "busy"}
	}
	raw := strings.TrimSpace(threshold)
	if raw == "" || raw == "." || !sizeRe.MatchString(raw) {
		a.endRun()
		return runResult{"error": "invalid-size"}
	}
	val, err := strconv.ParseFloat(raw, 64)
	if err != nil || val < 0 {
		a.endRun()
		return runResult{"error": "invalid-size"}
	}
	norm := strconv.FormatFloat(val, 'f', -1, 64)
	a.appLog("=== Large Files requested: threshold=" + norm + " GB ===")
	if !isWindows() {
		go a.simLarge(norm)
		return runResult{"ok": true, "simulation": true}
	}
	go a.runLargeNative(norm, val)
	return runResult{"ok": true}
}

// runLargeNative performs the fast native scan with live progress events.
func (a *App) runLargeNative(norm string, val float64) {
	defer a.endRun()

	a.cleanLog("Large file scan started, threshold = " + norm + " GB")
	a.emit("[GUI] Searching for files larger than " + norm + " GB on C: drive...")
	a.emit("[GUI] Neo fast scanner: native multi-threaded engine")

	threshold := int64(val * 1073741824)
	ctx, cancel := context.WithCancel(context.Background())
	a.mu.Lock()
	a.largeCancel = cancel
	a.mu.Unlock()
	defer func() {
		a.mu.Lock()
		a.largeCancel = nil
		a.mu.Unlock()
		cancel()
	}()

	start := time.Now()
	res, err := scan.Run(ctx, `C:\`, threshold, 20, func(p scan.Progress) {
		if a.ctx != nil {
			wailsruntime.EventsEmit(a.ctx, "large:progress", map[string]interface{}{
				"percent": p.Percent,
				"scanned": p.Scanned,
				"matched": p.Matched,
				"current": p.Current,
			})
		}
	})

	if err != nil {
		if ctx.Err() != nil {
			a.emit("[GUI] Scan cancelled by user")
			a.appLog("large scan cancelled")
			a.emitDone(1, "large")
			return
		}
		a.emit("[error] " + err.Error())
		a.emitDone(1, "large")
		return
	}

	// final progress: 100%
	if a.ctx != nil {
		wailsruntime.EventsEmit(a.ctx, "large:progress", map[string]interface{}{
			"percent": 100.0, "scanned": res.Total, "matched": res.Total, "current": "",
		})
	}

	elapsed := time.Since(start).Seconds()
	a.emit("  Size(GB)  File Path")
	if len(res.Top) == 0 {
		a.emit("No files found.")
	} else {
		for _, h := range res.Top {
			a.emit(fmt.Sprintf("%8.2f GB  %s", float64(h.Size)/1073741824, h.Path))
		}
	}
	a.emit("Total files found: " + strconv.FormatInt(res.Total, 10))
	a.emit("=====================================")
	a.emit("(Only first 20 files are displayed)")
	a.emit(fmt.Sprintf("[GUI] Scan finished in %.1fs (native engine)", elapsed))
	a.cleanLog(fmt.Sprintf("Large file scan finished. Found %d files. (%.1fs)", res.Total, elapsed))
	a.appLog(fmt.Sprintf("large scan done: %d matches in %.1fs", res.Total, elapsed))
	a.emit("[GUI] Task finished")
	a.emitDone(0, "large")
}

// DiskUsageDirect returns structured disk info for the home auto-check.
// Uses the same Get-PSDrive call as the original bat.
func (a *App) DiskUsageDirect(letter string) map[string]interface{} {
	L := strings.ToUpper(strings.TrimSpace(letter))
	if !letterRe.MatchString(L) {
		return map[string]interface{}{"error": "invalid-letter"}
	}
	if !isWindows() {
		return map[string]interface{}{"total": 237.86, "used": 148.32, "free": 89.54, "simulated": true}
	}
	cmd := exec.Command("powershell", "-NoProfile", "-Command",
		fmt.Sprintf(`$d = Get-PSDrive %s; Write-Host ('{0}|{1}|{2}' -f [math]::Round(($d.Used + $d.Free)/1GB,2), [math]::Round($d.Used/1GB,2), [math]::Round($d.Free/1GB,2))`, L))
	hideWindow(cmd)
	out, err := cmd.Output()
	if err != nil {
		return map[string]interface{}{"error": "query-failed"}
	}
	parts := strings.Split(strings.TrimSpace(string(out)), "|")
	if len(parts) != 3 {
		return map[string]interface{}{"error": "parse-failed"}
	}
	total, e1 := strconv.ParseFloat(parts[0], 64)
	used, e2 := strconv.ParseFloat(parts[1], 64)
	free, e3 := strconv.ParseFloat(parts[2], 64)
	if e1 != nil || e2 != nil || e3 != nil {
		return map[string]interface{}{"error": "parse-failed"}
	}
	a.appLog(fmt.Sprintf("auto disk check %s: total=%.2f used=%.2f free=%.2f", L, total, used, free))
	return map[string]interface{}{"total": total, "used": used, "free": free}
}

func (a *App) Cancel() runResult {
	a.mu.Lock()
	if !a.running {
		a.mu.Unlock()
		return runResult{"ok": false}
	}
	a.cancelReq = true
	kind := a.runningKind
	cmd := a.cmd
	lc := a.largeCancel
	sc := a.simCancel
	a.mu.Unlock()

	a.appLog("cancel requested (kind=" + kind + ")")
	if kind == "large" && lc != nil {
		lc()
	}
	if cmd != nil && cmd.Process != nil {
		kill := exec.Command("taskkill", "/pid", strconv.Itoa(cmd.Process.Pid), "/t", "/f")
		hideWindow(kill)
		_ = kill.Run()
	}
	if sc != nil {
		select {
		case <-sc:
		default:
			close(sc)
		}
	}
	return runResult{"ok": true}
}

// ConsoleMode launches the ORIGINAL bat (unmodified) in its own console.
func (a *App) ConsoleMode() runResult {
	a.appLog("=== Launch original console bat ===")
	if !isWindows() {
		return runResult{"error": "simulation"}
	}
	dir := filepath.Join(dataDir(), "original")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return runResult{"error": err.Error()}
	}
	p := filepath.Join(dir, batFileName)
	if err := os.WriteFile(p, a.batRaw, 0o644); err != nil {
		return runResult{"error": err.Error()}
	}
	cmd := exec.Command("cmd.exe", "/c", "start", "", p)
	hideWindow(cmd)
	if err := cmd.Run(); err != nil {
		return runResult{"error": err.Error()}
	}
	return runResult{"ok": true}
}

func (a *App) ReadCleanLog() map[string]interface{} {
	p := a.parsed.LogFile
	st, err := os.Stat(p)
	if err != nil {
		return map[string]interface{}{"exists": false, "path": p}
	}
	data, err := os.ReadFile(p)
	if err != nil {
		return map[string]interface{}{"exists": false, "path": p, "error": err.Error()}
	}
	const max = 256 * 1024
	if len(data) > max {
		data = data[len(data)-max:]
	}
	return map[string]interface{}{"exists": true, "path": p, "size": st.Size(), "text": string(data)}
}

func (a *App) AppLogPath() string { return a.logPath }

func (a *App) ExportAppLog() runResult {
	target, err := wailsruntime.SaveFileDialog(a.ctx, wailsruntime.SaveDialogOptions{
		Title:           "导出应用日志",
		DefaultFilename: fmt.Sprintf("CDriveCleanerNeo-app-%s.log", time.Now().Format("2006-01-02")),
	})
	if err != nil || target == "" {
		return runResult{"ok": false}
	}
	data, err := os.ReadFile(a.logPath)
	if err != nil {
		return runResult{"ok": false, "error": err.Error()}
	}
	if err := os.WriteFile(target, data, 0o644); err != nil {
		return runResult{"ok": false, "error": err.Error()}
	}
	return runResult{"ok": true, "filePath": target}
}

func (a *App) OpenPath(p string) string {
	if !isWindows() {
		return "simulation"
	}
	cmd := exec.Command("explorer", p)
	hideWindow(cmd)
	if err := cmd.Run(); err != nil {
		return err.Error()
	}
	return ""
}

// ------------------------------------------------------------------ simulation

func (a *App) simSleep(ms int, cancel chan struct{}) bool {
	select {
	case <-time.After(time.Duration(ms) * time.Millisecond):
		return true
	case <-cancel:
		return false
	}
}

func (a *App) simClean(fns []string, kind string) {
	defer a.endRun()
	a.mu.Lock()
	a.simCancel = make(chan struct{})
	cancel := a.simCancel
	a.mu.Unlock()
	a.emit("[SIMULATION MODE - no real changes on this OS]")
	if !a.simSleep(300, cancel) {
		a.emitDone(1, kind)
		return
	}
	echoRe := regexp.MustCompile(`^echo (.+)$`)
	for _, fn := range fns {
		a.emit("[STEP:" + fn + "]")
		for _, line := range a.parsed.Sections[fn] {
			t := strings.TrimSpace(line)
			if m := echoRe.FindStringSubmatch(t); m != nil && !strings.HasPrefix(m[1], "[GUI]") {
				a.emit(m[1])
			} else if t != "" && !strings.HasPrefix(t, "::") && t != "exit /b" && !strings.HasPrefix(t, "call :log") {
				a.emit("  [would run] " + t)
			}
		}
		if !a.simSleep(220, cancel) {
			a.emitDone(1, kind)
			return
		}
	}
	a.emit("")
	a.emit("Clean completed!")
	a.emit("Freed space: 1.28 GB  (SIMULATED)")
	a.emit("[GUI] Task finished")
	a.emitDone(0, kind)
}

func (a *App) simDisk(letter string) {
	defer a.endRun()
	a.mu.Lock()
	a.simCancel = make(chan struct{})
	cancel := a.simCancel
	a.mu.Unlock()
	a.emit("[SIMULATION MODE - no real changes on this OS]")
	a.emit("[GUI] Checking disk usage...")
	a.simSleep(400, cancel)
	a.emit("")
	a.emit("====== Disk Usage for " + letter + ": ======")
	a.emit("Total  : 237.86 GB  (SIMULATED)")
	a.emit("Used   : 148.32 GB  (SIMULATED)")
	a.emit("Free   : 89.54 GB  (SIMULATED)")
	a.emit("===================================")
	a.emit("[GUI] Task finished")
	a.emitDone(0, "disk")
}

func (a *App) simLarge(threshold string) {
	defer a.endRun()
	a.mu.Lock()
	a.simCancel = make(chan struct{})
	cancel := a.simCancel
	a.mu.Unlock()
	a.emit("[SIMULATION MODE - no real changes on this OS]")
	a.emit("[GUI] Searching for files larger than " + threshold + " GB on C: drive...")
	// simulated progress sequence
	for i := 1; i <= 5; i++ {
		a.simSleep(220, cancel)
		if a.ctx != nil {
			wailsruntime.EventsEmit(a.ctx, "large:progress", map[string]interface{}{
				"percent": float64(i) * 20, "scanned": int64(i * 23000), "matched": int64(i),
				"current": `C:\Users`,
			})
		}
	}
	a.emit("  Size(GB)  File Path")
	samples := [][2]interface{}{
		{4.21, `C:\Users\Demo\Videos\holiday-4k.mp4`},
		{2.87, `C:\Backup\system-image-2026.vhdx`},
		{1.94, `C:\Users\Demo\Downloads\win11-iso.iso`},
		{1.12, `C:\Games\demo\assets.pak`},
	}
	th, _ := strconv.ParseFloat(threshold, 64)
	count := 0
	for _, s := range samples {
		gb := s[0].(float64)
		if gb > th {
			a.emit(fmt.Sprintf("%8.2f GB  %s", gb, s[1]))
			count++
		}
	}
	a.emit(fmt.Sprintf("Total files found: %d  (SIMULATED)", count))
	a.emit("=====================================")
	a.emit("(Only first 20 files are displayed)")
	a.emit("[GUI] Scan finished in 1.2s (native engine, SIMULATED)")
	a.emit("[GUI] Task finished")
	a.emitDone(0, "large")
}
