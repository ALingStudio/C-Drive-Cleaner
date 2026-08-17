'use strict';
/* bridge.js - maps window.cdc to Wails bindings when running inside the app.
   In plain browser / screenshot mode window.go is absent and app.js falls
   back to its static mock. */
(function () {
  if (!(window.go && window.go.main && window.go.main.App)) return;
  const A = window.go.main.App;
  const R = window.runtime;
  window.cdc = {
    info: () => A.Info(),
    getSettings: () => A.GetSettings(),
    setSettings: (patch) => A.SetSettings(!!patch.logEnabled, patch.lang || ''),
    busy: () => A.Busy(),
    quickClean: () => A.RunQuick(),
    advancedClean: (items) => A.RunAdvanced(items || []),
    diskUsage: (letter) => A.RunDisk(letter),
    largeFiles: (threshold) => A.RunLarge(threshold),
    cancel: () => A.Cancel(),
    consoleMode: () => A.ConsoleMode(),
    diskDirect: (letter) => A.DiskUsageDirect(letter),
    readCleanLog: () => A.ReadCleanLog(),
    appLogPath: async () => ({ path: await A.AppLogPath() }),
    exportAppLog: () => A.ExportAppLog(),
    openPath: (p) => A.OpenPath(p),
    openExternal: (url) => { R.BrowserOpenURL(url); },
    onOutput: (cb) => R.EventsOn('run:output', (line) => cb(line)),
    onDone: (cb) => R.EventsOn('run:done', (info) => cb(info)),
    onLargeProgress: (cb) => R.EventsOn('large:progress', (p) => cb(p)),
    minimize: () => R.WindowMinimise(),
    maximize: () => R.WindowToggleMaximise(),
    close: () => R.Quit(),
  };
})();
