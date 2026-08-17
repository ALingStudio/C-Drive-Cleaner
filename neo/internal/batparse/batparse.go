// Package batparse parses the ORIGINAL, UNMODIFIED "C Drive Cleaner v2.9.bat".
// The GUI never re-implements any cleaning command: every cleaning command line
// executed at runtime is copied VERBATIM from the original batch file.
package batparse

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

type Parsed struct {
	BatPath        string
	Version        string
	LogFile        string
	Sections       map[string][]string
	Order          []string
	CleanFunctions []string
	QuickOrder     []string
	DiskTestPath   string // verbatim Test-Path powershell line
	DiskInfo       string // verbatim Get-PSDrive powershell line
	LFEncoded      string // verbatim EncodedCommand powershell line (legacy scan, kept for reference)
	LFCountBlock   []string
	LineCount      int
}

var labelRe = regexp.MustCompile(`^:([A-Za-z_][A-Za-z0-9_]*)\s*$`)

// ParseSections splits bat content into label sections. Lines starting with
// "::" are comments and do NOT open a section.
func ParseSections(text string) (map[string][]string, []string, []string) {
	lines := strings.Split(strings.ReplaceAll(text, "\r\n", "\n"), "\n")
	sections := map[string][]string{}
	order := []string{}
	current := ""
	for _, line := range lines {
		if m := labelRe.FindStringSubmatch(line); m != nil {
			current = m[1]
			if _, ok := sections[current]; !ok {
				sections[current] = []string{}
				order = append(order, current)
			}
			continue
		}
		if current != "" {
			sections[current] = append(sections[current], line)
		}
	}
	return sections, order, lines
}

func trimBody(b []string) []string {
	out := append([]string{}, b...)
	for len(out) > 0 && strings.TrimSpace(out[len(out)-1]) == "" {
		out = out[:len(out)-1]
	}
	return out
}

var (
	testPathRe = regexp.MustCompile(`powershell -NoProfile -Command "if \(Test-Path`)
	diskInfoRe = regexp.MustCompile(`powershell -NoProfile -Command "\$d = Get-PSDrive`)
	encodedRe  = regexp.MustCompile(`^\s*powershell -NoProfile -EncodedCommand [A-Za-z0-9+/=]+\s*$`)
	countBegRe = regexp.MustCompile(`^set "total_count="\s*$`)
	countEndRe = regexp.MustCompile(`^if "%total_count%"=="" set total_count=0`)
	verRe      = regexp.MustCompile(`C Drive Cleaner (v[\d.]+)`)
)

// Parse performs a full parse of the bat file.
func Parse(path string) (*Parsed, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return ParseText(string(raw), path)
}

// ParseText parses bat content (used by tests and embedded resources).
func ParseText(text, path string) (*Parsed, error) {
	sections, order, lines := ParseSections(text)

	cleanFns := []string{
		"clear_temp", "clear_recycle", "clear_prefetch", "clear_recent",
		"clear_ie_cache", "clear_logs", "clear_thumb", "clear_update_cache",
		"clear_browser_cache", "clear_restore_points", "clear_patch_cache",
	}
	for _, n := range cleanFns {
		if _, ok := sections[n]; !ok {
			return nil, fmt.Errorf("bat parse error: missing section %s", n)
		}
	}
	for _, h := range []string{"log", "get_before", "show_freed", "red", "yellow"} {
		if _, ok := sections[h]; !ok {
			return nil, fmt.Errorf("bat parse error: missing helper %s", h)
		}
	}

	// disk_usage nests :disk_loop, search both
	diskSec := append(append([]string{}, sections["disk_usage"]...), sections["disk_loop"]...)
	var testPath, diskInfo string
	for _, l := range diskSec {
		if testPath == "" && testPathRe.MatchString(l) {
			testPath = l
		}
		if diskInfo == "" && diskInfoRe.MatchString(l) {
			diskInfo = l
		}
	}
	if testPath == "" || diskInfo == "" {
		return nil, fmt.Errorf("bat parse error: disk_usage powershell lines not found")
	}

	lfSec := sections["large_files"]
	var encoded string
	countBlock := []string{}
	grab := false
	for _, l := range lfSec {
		if encoded == "" && encodedRe.MatchString(l) {
			encoded = l
		}
		if countBegRe.MatchString(strings.TrimSpace(l)) {
			grab = true
		}
		if grab {
			countBlock = append(countBlock, l)
			if countEndRe.MatchString(strings.TrimSpace(l)) {
				break
			}
		}
	}
	if encoded == "" {
		return nil, fmt.Errorf("bat parse error: large_files EncodedCommand not found")
	}
	if len(countBlock) < 3 {
		return nil, fmt.Errorf("bat parse error: large_files count block not found")
	}

	version := "v2.9"
	for _, l := range sections["menu"] {
		if m := verRe.FindStringSubmatch(l); m != nil {
			version = m[1]
			break
		}
	}

	trimmed := map[string][]string{}
	for k, v := range sections {
		trimmed[k] = trimBody(v)
	}

	return &Parsed{
		BatPath:        path,
		Version:        version,
		LogFile:        `C:\Log\CleanLog.txt`,
		Sections:       trimmed,
		Order:          order,
		CleanFunctions: cleanFns,
		QuickOrder: []string{
			"clear_temp", "clear_recycle", "clear_prefetch", "clear_recent",
			"clear_ie_cache", "clear_logs", "clear_thumb", "clear_update_cache",
			"clear_browser_cache",
		},
		DiskTestPath: testPath,
		DiskInfo:     diskInfo,
		LFEncoded:    encoded,
		LFCountBlock: countBlock,
		LineCount:    len(lines),
	}, nil
}
