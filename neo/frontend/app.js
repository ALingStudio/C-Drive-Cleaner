'use strict';
/* C Drive Cleaner neo - renderer logic (i18n + fast-scan progress) */

/* Static mock bridge: only used when running outside the app shell
   (screenshot tooling / plain browser preview). */
if (!window.cdc) {
  window.cdc = {
    info: async () => ({
      appVersion: 'neo 1.0', batVersion: 'v2.9', appName: 'C Drive Cleaner neo',
      batSha256: '9b9890679eca503d851ce45751ea59eeedc1a4415c2f402d38d1dd162d8c93d9',
      simulation: true, admin: null, logFile: 'C:\\Log\\CleanLog.txt', platform: 'linux',
    }),
    getSettings: async () => ({ logEnabled: true, lang: '' }),
    setSettings: async (p) => p,
    busy: async () => false,
    quickClean: async () => ({ ok: true }),
    advancedClean: async () => ({ ok: true }),
    diskUsage: async () => ({ ok: true }),
    largeFiles: async () => ({ ok: true }),
    cancel: async () => ({}),
    consoleMode: async () => ({}),
    diskDirect: async () => ({ total: 237.86, used: 148.32, free: 89.54, simulated: true }),
    readCleanLog: async () => ({ exists: false, path: 'C:\\Log\\CleanLog.txt' }),
    appLogPath: async () => ({ path: 'C:\\Users\\Demo\\AppData\\Roaming\\c-drive-cleaner-neo\\logs\\app.log' }),
    exportAppLog: async () => ({ ok: false }),
    openPath: async () => null,
    openExternal: async () => {},
    onOutput: () => {},
    onDone: () => {},
    onLargeProgress: () => {},
    minimize: () => {}, maximize: () => {}, close: () => {},
  };
}

const FN_META = {
  clear_temp:          { danger: false, en: 'Temporary files',        desc: '清理用户与系统 Temp 目录', desc_en: 'Cleans user & system Temp directories' },
  clear_recycle:       { danger: false, en: 'Recycle Bin',            desc: '清空回收站', desc_en: 'Empties the Recycle Bin' },
  clear_prefetch:      { danger: false, en: 'Prefetch files',         desc: '清理 Windows\\Prefetch', desc_en: 'Cleans Windows\\Prefetch' },
  clear_recent:        { danger: false, en: 'Recent documents',       desc: '清理最近使用的文档列表', desc_en: 'Cleans the recent documents list' },
  clear_ie_cache:      { danger: false, en: 'IE cache',               desc: '清理 IE 浏览器缓存', desc_en: 'Cleans IE browser cache' },
  clear_logs:          { danger: false, en: 'System logs',            desc: '清理 Application/System/Security/Setup 日志', desc_en: 'Cleans Application/System/Security/Setup logs' },
  clear_thumb:         { danger: false, en: 'Thumbnail cache',        desc: '清理 thumbcache_*.db', desc_en: 'Cleans thumbcache_*.db' },
  clear_update_cache:  { danger: false, en: 'Windows Update cache',   desc: '停止 wuauserv 后清理更新下载缓存', desc_en: 'Stops wuauserv, cleans update download cache' },
  clear_browser_cache: { danger: false, en: 'Browser caches',         desc: 'Chrome / Edge / Firefox 所有配置', desc_en: 'Chrome / Edge / Firefox, all profiles' },
  clear_restore_points:{ danger: true,  en: 'System restore points',
    warn: '警告：将删除所有系统还原点，之后无法回滚系统。',
    warn_en: 'WARNING: This deletes ALL system restore points. You will NOT be able to roll back the system afterwards.' },
  clear_patch_cache:   { danger: true,  en: 'Installer patch cache',
    warn: '警告：删除补丁缓存可能导致部分 Windows 更新无法卸载。',
    warn_en: 'WARNING: Deleting patch cache may prevent uninstalling some Windows updates.' },
};

const QUICK_ORDER = [
  'clear_temp','clear_recycle','clear_prefetch','clear_recent','clear_ie_cache',
  'clear_logs','clear_thumb','clear_update_cache','clear_browser_cache',
];

let appInfo = null;
let settings = { logEnabled: true, lang: '' };
let currentTerm = null;
let currentKind = null;
let diskCache = {};
let largeRows = [];

const $ = (id) => document.getElementById(id);
const isZh = () => (window.__lang || 'zh-CN').startsWith('zh');

/* ---------------- toast ---------------- */
let toastTimer = null;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------- navigation ---------------- */
function gotoPage(name) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  $('page-' + name).classList.add('active');
  document.querySelector('.nav-item[data-page="' + name + '"]').classList.add('active');
}
document.querySelectorAll('.nav-item').forEach((n) =>
  n.addEventListener('click', () => gotoPage(n.dataset.page)));
document.querySelectorAll('.feature[data-goto]').forEach((f) =>
  f.addEventListener('click', () => gotoPage(f.dataset.goto)));

/* ---------------- titlebar ---------------- */
$('btn-min').onclick = () => window.cdc.minimize();
$('btn-max').onclick = () => window.cdc.maximize();
$('btn-close').onclick = () => window.cdc.close();

/* ---------------- terminal helpers ---------------- */
function termLine(el, text) {
  const span = document.createElement('span');
  let cls = '';
  if (/^\[STEP:/.test(text)) cls = 't-step';
  else if (/warning/i.test(text)) cls = 't-warn';
  else if (/completed|cleaned|emptied|deleted|Freed space|No files found/.test(text)) cls = 't-ok';
  else if (/^\[stderr\]|^\[error\]/.test(text)) cls = 't-warn';
  else if (/^\[SIMULATION/.test(text) || /\(SIMULATED\)/.test(text) || /^\[would run\]/.test(text)) cls = 't-dim';
  else if (/fast scanner|Scan finished|Neo/.test(text)) cls = 't-step';
  if (cls) span.className = cls;
  span.textContent = text + '\n';
  el.appendChild(span);
  el.scrollTop = el.scrollHeight;
}
function termClear(el) { el.innerHTML = ''; }

/* ---------------- steps UI ---------------- */
function buildSteps(el, fns) {
  el.innerHTML = '';
  for (const fn of fns) {
    const li = document.createElement('li');
    li.dataset.fn = fn;
    li.innerHTML = '<span class="s-ico"></span><span>' + itemName(fn) + '</span>';
    el.appendChild(li);
  }
}
function stepState(el, fn, state) {
  const li = el.querySelector('li[data-fn="' + fn + '"]');
  if (!li) return;
  li.classList.remove('running', 'done');
  if (state) li.classList.add(state);
}
function finishRunningSteps(el) {
  el.querySelectorAll('li.running').forEach((li) => {
    li.classList.remove('running');
    li.classList.add('done');
  });
}

/* ---------------- run control ---------------- */
function setRunningUI(kind, running) {
  const map = {
    quick: ['quick-start', 'quick-cancel'],
    advanced: ['adv-start', 'adv-cancel'],
    large: ['large-go', 'large-cancel'],
    disk: ['disk-go', null],
  };
  const ids = map[kind] || [];
  const startId = ids[0], cancelId = ids[1];
  if (startId) $(startId).disabled = running;
  if (cancelId) $(cancelId).classList.toggle('hidden', !running);
}

async function startRun(kind, termEl, opts) {
  opts = opts || {};
  if (await window.cdc.busy()) { toast(t('toast.busy')); return; }
  termClear(termEl);
  currentTerm = termEl;
  currentKind = kind;
  setRunningUI(kind, true);
  if (kind === 'quick') $('quick-status').textContent = t('common.running');
  let res;
  if (kind === 'quick') res = await window.cdc.quickClean();
  else if (kind === 'advanced') res = await window.cdc.advancedClean(opts.items);
  else if (kind === 'disk') res = await window.cdc.diskUsage(opts.letter);
  else if (kind === 'large') res = await window.cdc.largeFiles(opts.threshold);
  if (res && res.error) {
    setRunningUI(kind, false);
    currentTerm = null;
    if (res.error === 'busy') toast(t('toast.busy'));
    else if (res.error === 'empty') toast(t('toast.empty'));
    else if (res.error === 'invalid-letter') $('disk-error').classList.remove('hidden');
    else if (res.error === 'invalid-size') $('large-error').classList.remove('hidden');
  }
}

window.cdc.onOutput((line) => {
  if (!currentTerm) return;
  const stepM = /^\[STEP:(clear_[a-z_]+)\]$/.exec(line);
  if (stepM) {
    const el = currentKind === 'advanced' ? $('adv-steps') : $('quick-steps');
    finishRunningSteps(el);
    stepState(el, stepM[1], 'running');
  }
  if (currentKind === 'disk') {
    const m = /^(Total|Used|Free)\s*:\s*([\d.]+)\s*GB/.exec(line.trim());
    if (m) {
      const key = { Total: 'total', Used: 'used', Free: 'free' }[m[1]];
      diskCache._last = diskCache._last || {};
      diskCache._last[key] = parseFloat(m[2]);
    }
  }
  if (currentKind === 'large') {
    const rowM = /^\s*([\d.]+)\s+GB\s{2}(.+)$/.exec(line);
    if (rowM && !/SIMULATED/.test(line)) {
      largeRows.push({ gb: parseFloat(rowM[1]), path: rowM[2].trim() });
      renderLargeTable();
    }
    const cntM = /Total files found:\s*(\d+)/.exec(line);
    if (cntM) $('large-count').textContent = t('large.count', { n: cntM[1] });
  }
  if (!/^\[STEP:/.test(line)) termLine(currentTerm, line);
});

window.cdc.onDone((info) => {
  const kind = info.kind || currentKind;
  setRunningUI(kind, false);
  if (kind === 'quick') {
    finishRunningSteps($('quick-steps'));
    $('quick-status').textContent = info.code === 0 ? t('common.done') : t('common.done') + ' (' + info.code + ')';
  }
  if (kind === 'advanced') finishRunningSteps($('adv-steps'));
  if (kind === 'disk') renderDiskResult();
  if (kind === 'large') {
    // finalize progress bar
    $('large-progress-bar').style.width = '100%';
    $('large-progress-pct').textContent = '100%';
    setTimeout(() => $('large-progress-card').classList.add('hidden'), 800);
  }
  if (currentTerm) termLine(currentTerm, '[GUI] ' + t('task.end', { c: info.code }));
  currentTerm = null;
  currentKind = null;
});

/* fast-scan live progress */
window.cdc.onLargeProgress((p) => {
  if (!p) return;
  const pct = Math.max(0, Math.min(100, Math.round(p.percent || 0)));
  $('large-progress-bar').style.width = pct + '%';
  $('large-progress-pct').textContent = pct + '%';
  const detail = t('large.detail', { s: p.scanned || 0, m: p.matched || 0 });
  $('large-progress-detail').textContent = p.current ? detail + ' · ' + p.current : detail;
});

/* ---------------- quick page ---------------- */
$('quick-start').onclick = () => {
  $('quick-result').classList.add('hidden');
  startRun('quick', $('quick-term'));
};
$('quick-cancel').onclick = () => window.cdc.cancel();
$('home-quick-btn').onclick = () => { gotoPage('quick'); $('quick-start').click(); };
$('home-adv-btn').onclick = () => gotoPage('advanced');

/* ---------------- advanced page ---------------- */
const advSelection = new Set();
function buildToggleItem(fn) {
  const meta = FN_META[fn];
  const item = document.createElement('div');
  item.className = 'toggle-item';
  const desc = meta.danger ? (isZh() ? meta.warn : meta.warn_en) : (isZh() ? meta.desc : meta.desc_en);
  item.innerHTML =
    '<div class="ti-info">' +
      '<div class="ti-name">' + itemName(fn) + ' <span class="muted" style="font-weight:400">· ' + meta.en + '</span></div>' +
      '<div class="ti-desc">' + desc + '</div>' +
    '</div>' +
    '<label class="switch"><input type="checkbox" data-fn="' + fn + '" ' + (advSelection.has(fn) ? 'checked' : '') + '><span class="slider"></span></label>';
  const cb = item.querySelector('input');
  cb.addEventListener('change', () => {
    if (cb.checked) advSelection.add(fn); else advSelection.delete(fn);
    $('adv-count').textContent = advSelection.size;
  });
  return item;
}
function buildAdvToggles() {
  const safe = $('adv-safe-list'), danger = $('adv-danger-list');
  safe.innerHTML = ''; danger.innerHTML = '';
  for (const fn of QUICK_ORDER) safe.appendChild(buildToggleItem(fn));
  danger.appendChild(buildToggleItem('clear_restore_points'));
  danger.appendChild(buildToggleItem('clear_patch_cache'));
  $('adv-count').textContent = advSelection.size;
}

$('adv-start').onclick = () => {
  if (!advSelection.size) { toast(t('toast.empty')); return; }
  const items = QUICK_ORDER.concat(['clear_restore_points', 'clear_patch_cache']).filter((f) => advSelection.has(f));
  const stepsEl = $('adv-steps');
  buildSteps(stepsEl, items);
  stepsEl.classList.remove('hidden');
  $('adv-result').classList.add('hidden');
  startRun('advanced', $('adv-term'), { items: items });
};
$('adv-cancel').onclick = () => window.cdc.cancel();

/* ---------------- disk page ---------------- */
$('disk-go').onclick = async () => {
  const letter = $('disk-input').value.trim().toUpperCase();
  $('disk-error').classList.add('hidden');
  if (!/^[A-Z]$/.test(letter)) { $('disk-error').classList.remove('hidden'); return; }
  diskCache._last = null;
  $('disk-result-card').classList.add('hidden');
  await startRun('disk', $('disk-term'), { letter: letter });
};
$('disk-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('disk-go').click(); });

function renderDiskResult() {
  const d = diskCache._last;
  if (!d || d.total == null) return;
  $('disk-result-card').classList.remove('hidden');
  $('disk-result-title').textContent = t('disk.title') + ' · ' + $('disk-input').value.trim().toUpperCase() + ':';
  $('disk-total').textContent = d.total.toFixed(2) + ' GB';
  $('disk-used').textContent = (d.used || 0).toFixed(2) + ' GB';
  $('disk-free').textContent = (d.free || 0).toFixed(2) + ' GB';
  const pct = d.total > 0 ? Math.min(100, ((d.used || 0) / d.total) * 100) : 0;
  $('disk-bar').style.width = pct.toFixed(1) + '%';
  $('disk-caption').textContent = t('disk.pct', { p: pct.toFixed(1) });
  if ($('disk-input').value.trim().toUpperCase() === 'C') {
    $('hero-ring-text').textContent = d.free.toFixed(1) + ' GB';
    const frac = d.total > 0 ? (d.free / d.total) : 0;
    $('hero-ring').setAttribute('stroke-dasharray', Math.max(6, 289 * frac) + ' 290');
  }
}

/* ---------------- large files page ---------------- */
$('large-go').onclick = async () => {
  $('large-error').classList.add('hidden');
  const raw = $('large-input').value.trim();
  if (!/^[0-9.]+$/.test(raw) || raw === '' || raw === '.') { $('large-error').classList.remove('hidden'); return; }
  largeRows = [];
  renderLargeTable();
  $('large-count').textContent = t('common.running');
  $('large-result-card').classList.remove('hidden');
  // reset + show progress bar
  $('large-progress-bar').style.width = '0%';
  $('large-progress-pct').textContent = '0%';
  $('large-progress-detail').textContent = '';
  $('large-progress-card').classList.remove('hidden');
  await startRun('large', $('large-term'), { threshold: raw });
};
$('large-cancel').onclick = () => window.cdc.cancel();
$('large-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('large-go').click(); });

function renderLargeTable() {
  const tbody = $('large-table').querySelector('tbody');
  tbody.innerHTML = '';
  for (const r of largeRows) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td'); td1.className = 'sz'; td1.textContent = r.gb.toFixed(2) + ' GB';
    const td2 = document.createElement('td'); td2.className = 'fp'; td2.textContent = r.path;
    tr.appendChild(td1); tr.appendChild(td2);
    tbody.appendChild(tr);
  }
  if (largeRows.length) $('large-count').textContent = largeRows.length + ' / 20';
}

/* ---------------- settings page ---------------- */
function refreshLogStatus() {
  $('st-log').textContent = settings.logEnabled ? '✓' : '✗';
}
$('sw-log').addEventListener('change', async () => {
  settings = await window.cdc.setSettings({ logEnabled: $('sw-log').checked, lang: settings.lang });
  refreshLogStatus();
  toast($('sw-log').checked ? t('toast.logon') : t('toast.logoff'));
});
$('log-refresh').onclick = async () => {
  const r = await window.cdc.readCleanLog();
  const v = $('clean-log-viewer');
  if (r.exists) {
    v.textContent = r.text || '(empty)';
    v.scrollTop = v.scrollHeight;
  } else {
    v.textContent = r.error ? ('Error: ' + r.error) : t('log.none');
  }
};
$('log-open-folder').onclick = async () => {
  const r = await window.cdc.readCleanLog();
  const dir = (r.path || 'C:\\Log\\CleanLog.txt').split('\\').slice(0, -1).join('\\');
  const err = await window.cdc.openPath(dir);
  if (err) toast(err);
};
$('app-log-export').onclick = async () => {
  const r = await window.cdc.exportAppLog();
  if (r && r.ok && r.filePath) toast(r.filePath);
};

/* ---------------- language ---------------- */
function initLangSelect() {
  const sel = $('sel-lang');
  sel.innerHTML = '';
  for (const code of Object.keys(LANG_NAMES)) {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = LANG_NAMES[code];
    sel.appendChild(o);
  }
  sel.value = window.__lang;
  sel.onchange = async () => {
    settings.lang = sel.value;
    settings = await window.cdc.setSettings({ logEnabled: settings.logEnabled, lang: sel.value });
    switchLang(sel.value);
  };
}
function switchLang(lang) {
  applyLang(lang);
  $('sel-lang').value = lang;
  buildAdvToggles();
  buildSteps($('quick-steps'), QUICK_ORDER);
  $('quick-status').textContent = t('common.ready');
  refreshLogStatus();
  updateModeText();
}

function updateModeText() {
  if (!appInfo) return;
  $('home-mode-desc').textContent = appInfo.simulation ? t('home.mode.sim') : t('home.mode.win');
  if (appInfo.simulation) {
    $('st-admin').textContent = t('st.admin.na');
  } else {
    $('st-admin').textContent = appInfo.admin ? t('st.admin.got') : t('st.admin.none');
  }
}

/* ---------------- console mode ---------------- */
async function launchConsole() {
  const r = await window.cdc.consoleMode();
  if (r && r.error === 'simulation') toast(t('toast.consim'));
  else toast(t('toast.conok'));
}
$('home-console-btn').onclick = launchConsole;
$('about-console-btn').onclick = launchConsole;
$('about-repo').onclick = (e) => { e.preventDefault(); window.cdc.openExternal('https://github.com/ALingStudio/C-Drive-Cleaner'); };
$('nav-user').onclick = () => window.cdc.openExternal('https://github.com/ALingStudio');

/* ---------------- home auto disk check ---------------- */
async function autoDiskCheck() {
  try {
    const r = await window.cdc.diskDirect('C');
    if (r && r.error) { $('st-cfree').textContent = t('fail'); return; }
    const free = Number(r.free), total = Number(r.total);
    $('st-cfree').textContent = free.toFixed(2) + ' GB' + (r.simulated ? ' (demo)' : '');
    $('hero-ring-text').textContent = free.toFixed(1) + ' GB';
    const frac = total > 0 ? free / total : 0;
    $('hero-ring').setAttribute('stroke-dasharray', Math.max(6, 289 * frac).toFixed(0) + ' 290');
  } catch (e) {
    $('st-cfree').textContent = t('fail');
  }
}

/* ---------------- boot ---------------- */
(async function boot() {
  appInfo = await window.cdc.info();
  settings = await window.cdc.getSettings();

  const lang = (settings.lang && LANG_NAMES[settings.lang]) ? settings.lang : detectSystemLang();
  window.__lang = lang;
  applyLang(lang);

  $('sw-log').checked = !!settings.logEnabled;
  refreshLogStatus();
  initLangSelect();
  buildAdvToggles();
  buildSteps($('quick-steps'), QUICK_ORDER);
  $('quick-status').textContent = t('common.ready');

  $('tb-ver').textContent = appInfo.appVersion;
  $('hero-ver').textContent = appInfo.appVersion;
  $('about-batver').textContent = appInfo.batVersion;
  $('about-guiver').textContent = appInfo.appVersion;
  $('about-sha').textContent = appInfo.batSha256;
  $('about-sha').title = appInfo.batSha256;
  $('st-sha').textContent = appInfo.batSha256.slice(0, 12) + '…';
  $('st-sha').title = appInfo.batSha256;
  $('about-platform').textContent = appInfo.platform;
  $('app-log-path').textContent = (await window.cdc.appLogPath()).path;

  if (appInfo.runningFromTemp) {
    const w = document.getElementById('home-temp-warn');
    if (w) w.classList.remove('hidden');
  }
  if (appInfo.simulation) {
    $('nav-mode').textContent = 'SIM';
    $('st-admin-dot').className = 'dot';
  } else {
    $('nav-mode').textContent = appInfo.admin ? 'Admin · Windows' : 'Windows';
    $('st-admin-dot').className = appInfo.admin ? 'dot dot-green' : 'dot';
  }
  updateModeText();
  autoDiskCheck();
})();
