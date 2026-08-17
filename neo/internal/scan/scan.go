// Package scan implements the neo large-file scanner.
//
// Why it is much faster than the legacy PowerShell EncodedCommand scan:
//   - No powershell.exe process startup (1-2 s saved before work even starts)
//   - No runspace-pool / job marshalling overhead
//   - Native OS directory enumeration with a goroutine worker pool
//   - Top-N maintained with a bounded min-heap (no O(n²) array appends,
//     no need to materialize every match in memory)
//   - Single pass, no per-directory script dispatch
package scan

import (
	"container/heap"
	"context"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"sync"
	"sync/atomic"
	"time"
)

// Hit is one file that exceeds the threshold.
type Hit struct {
	Path string
	Size int64
}

// Progress is emitted periodically during the scan.
type Progress struct {
	Percent float64 `json:"percent"` // 0-100, based on completed top-level units
	Scanned int64   `json:"scanned"` // files examined so far
	Matched int64   `json:"matched"` // files exceeding threshold so far
	Current string  `json:"current"` // directory currently being processed
}

// Result is the final scan outcome.
type Result struct {
	Total int64 // all files exceeding threshold
	Top   []Hit // largest first, capped at TopN
}

// ------- bounded min-heap of the largest hits -------
type hitHeap []Hit

func (h hitHeap) Len() int            { return len(h) }
func (h hitHeap) Less(i, j int) bool  { return h[i].Size < h[j].Size } // min at top
func (h hitHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *hitHeap) Push(x interface{}) { *h = append(*h, x.(Hit)) }
func (h *hitHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

// Run scans root recursively and returns files larger than threshold bytes.
// Progress callbacks are throttled to at most ~4 per second plus one per
// completed top-level unit. Cancellation is honored via ctx.
func Run(ctx context.Context, root string, threshold int64, topN int, onProgress func(Progress)) (*Result, error) {
	if topN <= 0 {
		topN = 20
	}

	entries, err := os.ReadDir(root)
	if err != nil {
		return nil, err
	}

	var dirs []string
	var rootFiles []os.DirEntry
	for _, e := range entries {
		if e.IsDir() {
			dirs = append(dirs, filepath.Join(root, e.Name()))
		} else {
			rootFiles = append(rootFiles, e)
		}
	}
	totalUnits := int64(len(dirs) + 1) // +1 for root-level files

	var (
		scanned int64
		matched int64
		doneU   int64
		hits    hitHeap
		hitsMu  sync.Mutex
		lastEmit int64 // unix nano of last progress emit
	)

	emit := func(force bool, current string) {
		if onProgress == nil {
			return
		}
		now := time.Now().UnixNano()
		if !force && now-atomic.LoadInt64(&lastEmit) < int64(250*time.Millisecond) {
			return
		}
		atomic.StoreInt64(&lastEmit, now)
		d := atomic.LoadInt64(&doneU)
		onProgress(Progress{
			Percent: float64(d) / float64(totalUnits) * 100,
			Scanned: atomic.LoadInt64(&scanned),
			Matched: atomic.LoadInt64(&matched),
			Current: current,
		})
	}

	addHit := func(h Hit) {
		hitsMu.Lock()
		if hits.Len() < topN {
			heap.Push(&hits, h)
		} else if h.Size > hits[0].Size {
			heap.Pop(&hits)
			heap.Push(&hits, h)
		}
		hitsMu.Unlock()
	}

	// scanDir iteratively walks one subtree.
	scanDir := func(dir string) {
		stack := []string{dir}
		for len(stack) > 0 {
			select {
			case <-ctx.Done():
				return
			default:
			}
			d := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			ents, err := os.ReadDir(d)
			if err != nil {
				continue // permission errors etc. - silently skip (parity with original)
			}
			for _, e := range ents {
				full := filepath.Join(d, e.Name())
				if e.IsDir() {
					stack = append(stack, full)
					continue
				}
				atomic.AddInt64(&scanned, 1)
				info, err := e.Info()
				if err != nil {
					continue
				}
				if info.Size() > threshold {
					atomic.AddInt64(&matched, 1)
					addHit(Hit{Path: full, Size: info.Size()})
				}
			}
		}
	}

	workers := runtime.NumCPU() * 2
	if workers < 8 {
		workers = 8
	}
	if workers > 24 {
		workers = 24
	}
	if len(dirs) < workers {
		workers = len(dirs)
		if workers < 1 {
			workers = 1
		}
	}

	jobs := make(chan string, len(dirs)+1)
	var wg sync.WaitGroup

	// Unit 0: root-level files.
	wg.Add(1)
	go func() {
		defer wg.Done()
		for _, e := range rootFiles {
			select {
			case <-ctx.Done():
				return
			default:
			}
			atomic.AddInt64(&scanned, 1)
			info, err := e.Info()
			if err != nil {
				continue
			}
			if info.Size() > threshold {
				atomic.AddInt64(&matched, 1)
				addHit(Hit{Path: filepath.Join(root, e.Name()), Size: info.Size()})
			}
		}
		atomic.AddInt64(&doneU, 1)
		emit(true, root)
	}()

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for dir := range jobs {
				select {
				case <-ctx.Done():
					return
				default:
				}
				scanDir(dir)
				atomic.AddInt64(&doneU, 1)
				emit(true, dir)
			}
		}()
	}

	for _, d := range dirs {
		jobs <- d
	}
	close(jobs)
	wg.Wait()

	if ctx.Err() != nil {
		return nil, ctx.Err()
	}

	top := []Hit(hits)
	sort.Slice(top, func(i, j int) bool { return top[i].Size > top[j].Size })

	return &Result{
		Total: atomic.LoadInt64(&matched),
		Top:   top,
	}, nil
}
