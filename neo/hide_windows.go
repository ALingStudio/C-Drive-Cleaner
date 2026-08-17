//go:build windows

package main

import (
	"os/exec"
	"syscall"
)

// hideWindow prevents console windows from flashing when spawning cmd/powershell.
func hideWindow(cmd *exec.Cmd) {
	if cmd.SysProcAttr == nil {
		cmd.SysProcAttr = &syscall.SysProcAttr{}
	}
	cmd.SysProcAttr.HideWindow = true
}
