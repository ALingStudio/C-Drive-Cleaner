package scan_test

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"cdrivecleaner-neo/internal/scan"
)

// buildTree creates a test directory tree:
//
//	root/
//	  small.txt          (100 B)
//	  big1.bin           (3 MiB)
//	  sub/
//	    big2.bin         (2 MiB)
//	    deep/
//	      big3.bin       (5 MiB)
//	      tiny.txt       (10 B)
//	  empty/
func buildTree(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	mk := func(rel string, size int) {
		p := filepath.Join(root, rel)
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(p, make([]byte, size), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	mk("small.txt", 100)
	mk("big1.bin", 3*1024*1024)
	mk(filepath.Join("sub", "big2.bin"), 2*1024*1024)
	mk(filepath.Join("sub", "deep", "big3.bin"), 5*1024*1024)
	mk(filepath.Join("sub", "deep", "tiny.txt"), 10)
	if err := os.MkdirAll(filepath.Join(root, "empty"), 0o755); err != nil {
		t.Fatal(err)
	}
	return root
}

func TestScanFindsAllOverThreshold(t *testing.T) {
	root := buildTree(t)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	res, err := scan.Run(ctx, root, 1*1024*1024, 20, nil)
	if err != nil {
		t.Fatal(err)
	}
	if res.Total != 3 {
		t.Fatalf("expected 3 matches, got %d", res.Total)
	}
	if len(res.Top) != 3 {
		t.Fatalf("expected top len 3, got %d", len(res.Top))
	}
	// sorted desc
	if !(res.Top[0].Size >= res.Top[1].Size && res.Top[1].Size >= res.Top[2].Size) {
		t.Fatalf("top not sorted desc: %+v", res.Top)
	}
	if res.Top[0].Size != 5*1024*1024 {
		t.Fatalf("largest should be 5MiB, got %d", res.Top[0].Size)
	}
}

func TestScanTopNCap(t *testing.T) {
	root := buildTree(t)
	ctx := context.Background()
	res, err := scan.Run(ctx, root, 1*1024*1024, 2, nil)
	if err != nil {
		t.Fatal(err)
	}
	if res.Total != 3 {
		t.Fatalf("total should still be 3, got %d", res.Total)
	}
	if len(res.Top) != 2 {
		t.Fatalf("top should be capped at 2, got %d", len(res.Top))
	}
	// the two largest (5MiB, 3MiB) kept
	if res.Top[0].Size != 5*1024*1024 || res.Top[1].Size != 3*1024*1024 {
		t.Fatalf("wrong top-2 kept: %+v", res.Top)
	}
}

func TestScanThresholdZeroFindsAll(t *testing.T) {
	root := buildTree(t)
	ctx := context.Background()
	res, err := scan.Run(ctx, root, 0, 20, nil)
	if err != nil {
		t.Fatal(err)
	}
	// threshold 0: every file with size > 0 matches (5 files)
	if res.Total != 5 {
		t.Fatalf("expected 5 files with threshold 0, got %d", res.Total)
	}
}

func TestScanProgressEmitted(t *testing.T) {
	root := buildTree(t)
	ctx := context.Background()
	var events []scan.Progress
	res, err := scan.Run(ctx, root, 1*1024*1024, 20, func(p scan.Progress) {
		events = append(events, p)
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(events) == 0 {
		t.Fatal("expected progress events, got none")
	}
	last := events[len(events)-1]
	if last.Percent < 99.9 {
		t.Fatalf("final progress should be ~100%%, got %.1f", last.Percent)
	}
	if res.Total != 3 {
		t.Fatalf("expected 3 matches, got %d", res.Total)
	}
}

func TestScanCancellation(t *testing.T) {
	root := buildTree(t)
	ctx, cancel := context.WithCancel(context.Background())
	cancel() // cancel immediately
	_, err := scan.Run(ctx, root, 0, 20, nil)
	if err == nil {
		t.Fatal("expected cancellation error, got nil")
	}
}

func TestScanEmptyDir(t *testing.T) {
	root := t.TempDir()
	res, err := scan.Run(context.Background(), root, 0, 20, nil)
	if err != nil {
		t.Fatal(err)
	}
	if res.Total != 0 || len(res.Top) != 0 {
		t.Fatalf("expected empty result, got %+v", res)
	}
}
