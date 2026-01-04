// ==UserScript==
// @name         Pound Surfer Pro 2.0
// @namespace    Amanda Bynes@clraik and ChadGPT ai robot helper friend
// @version      3.8.9
// @description  Automatically surfs the pound and generates a log of pet names, species and colors, with direct links to view petpage and a quick adopt link. Set filters for specific PB colors or species, get alerts in real time if your selection is found. It also features list exporting, highlighting, persistent UI, storage options and more.
// @match        https://www.neopets.com/pound/adopt.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555324/Pound%20Surfer%20Pro%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/555324/Pound%20Surfer%20Pro%2020.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Storage Keys ----------
  const SETTINGS_KEY    = 'np_pld_settings_v387';
  const LOG_KEY         = 'np_pld_log_v387';
  const RUN_FLAG        = 'np_pld_run_v387';
  const PAUSE_FLAG      = 'np_pld_pause_v387';
  const START_MS        = 'np_pld_start_ms_v387';
  const PAUSE_OFFSET    = 'np_pld_pause_offset_v387';
  const REFRESH_COUNT   = 'np_pld_refresh_count_v387';
  const LOG_VISIBLE_KEY = 'np_pld_log_visible_v387';
  const SAVE_MODE_KEY   = 'np_pld_save_mode_v387'; // persist save button color state

  // ---------- Defaults / Limits ----------
  const DEFAULT_INTERVAL_MS = 5000;
  const MIN_INTERVAL_MS     = 3000;
  const MAX_INTERVAL_MS     = 60000;
  const DEFAULT_DURATION_MS = 10 * 60 * 1000; // 10m
  const MAX_DURATION_MS     = 60 * 60 * 1000; // 60m
  const AUTO_RESUME_DELAY   = 60000;          // 60s

  let nextReloadTimer = null;
  let liveTimer = null;

  // ---------- Helpers ----------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad2 = n => String(n).padStart(2, '0');
  const fmtMMSS = ms => {
    if (!ms || ms < 0) ms = 0;
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${pad2(m)}:${pad2(s)}`;
  };

  const loadSettings = () => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
    catch { return {}; }
  };
  const saveSettings = (s) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  const readLog = () => {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch { return []; }
  };
  const writeLog = (arr) => localStorage.setItem(LOG_KEY, JSON.stringify(arr || []));

  // ---------- Desktop Notification ----------
  function desktopNotify(name, color, species, iconUrl) {
    if (Notification.permission !== 'granted') return;
    const n = new Notification('🎉 Pet Found in the Pound!', {
      body: `${color} ${species} — ${name}`,
      icon: iconUrl || 'https://images.neopets.com/themes/h5/basic/images/logo.png',
      requireInteraction: false
    });
    n.onclick = () => {
      window.open(`https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(name)}`, '_blank');
      n.close();
    };
    setTimeout(() => n.close(), 10000);
  }

  function findPetIconSrc() {
    for (let i = 0; i < 3; i++) {
      const img = document.getElementById(`pet${i}_img`);
      if (img) return img.src;
    }
    return null;
  }

  // ---------- UI ----------
  function buildUI() {
    if (document.getElementById('pld-panel')) return;

    const s = loadSettings();
    if (typeof s.intervalMs !== 'number') s.intervalMs = DEFAULT_INTERVAL_MS;
    if (typeof s.durationMs !== 'number') s.durationMs = DEFAULT_DURATION_MS;
    if (typeof s.alertsEnabled !== 'boolean') s.alertsEnabled = false;
    if (typeof s.desktopNotify !== 'boolean') s.desktopNotify = false;
    if (typeof s.filterColor !== 'boolean') s.filterColor = false;
    if (typeof s.filterSpecies !== 'boolean') s.filterSpecies = false;
    if (typeof s.filterName !== 'boolean') s.filterName = false;
    if (!Array.isArray(s.colors)) s.colors = [];
    if (!Array.isArray(s.species)) s.species = [];
    if (!Array.isArray(s.names)) s.names = [];
    if (typeof s.autoResume !== 'boolean') s.autoResume = false;
    saveSettings(s);

    if (localStorage.getItem(LOG_VISIBLE_KEY) === null) {
      localStorage.setItem(LOG_VISIBLE_KEY, 'false'); // start minimized
    }
    const logVisible = JSON.parse(localStorage.getItem(LOG_VISIBLE_KEY));
    const log = readLog();

    const isOn = localStorage.getItem(SAVE_MODE_KEY) === 'on';
    const saveBtnColor = isOn ? '#0c0' : '#c00';

    const wrap = document.createElement('div');
    wrap.id = 'pld-panel';
    wrap.style.cssText = `
      position:fixed;top:10px;right:0px;width:300px;max-height:90vh;overflow-y:auto;z-index:99999;
      background:#fff;border:2px solid #000;border-radius:10px;padding:10px;
      font:11px Arial, Helvetica, sans-serif;box-shadow:3px 3px 8px rgba(0,0,0,.4);
    `;

    const entriesHTML = log.map(p => {
      const text = `${p.name} (${p.color} ${p.species})`;
      const left = p.highlight ? `<b style="color:green;">${text}</b>` : text;
      return `
        <div class="pld-entry" data-name="${p.name.toLowerCase()}" data-color="${p.color.toLowerCase()}" data-species="${p.species.toLowerCase()}"
             style="display:flex;justify-content:space-between;align-items:center;margin:2px 0;">
          <span style="text-align:left;">${left}</span>
          <span style="white-space:nowrap;">
            <a href="https://www.neopets.com/~${encodeURIComponent(p.name)}" target="_blank">📄</a>
            <a href="https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(p.name)}" target="_blank">➡️</a>
          </span>
        </div>`;
    }).join('');

    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <b>Pound Surfer Pro 2.0</b>
        <div>
          <button id="pld-clear" title="Clear log (double-click to clear all)">🗑️</button>
          <button id="pld-save" title="Persist settings & log (green=on, red=off)"
           style="background:${saveBtnColor};color:#fff;border:1px solid #000;">💾</button>
          <button id="pld-logtoggle" title="Show/Hide Log">📖</button>
          <button id="pld-settings" title="Settings">⚙️</button>
        </div>
      </div>

      <div style="margin:6px 0 8px 0;color:#555;text-align:left;">
        <span id="pld-play"  style="cursor:pointer;">▶️</span>
        <span id="pld-pause" style="cursor:pointer;margin-left:2px;">⏸️</span>
        <span id="pld-stop"  style="cursor:pointer;margin-left:2px;">⏹️</span>
        <span id="pld-status" style="font: italic 9pt Arial; margin-left:6px;">Idle</span>
      </div>

      <div id="pld-settings-panel" style="display:none;background:#f5f5f5;border:1px solid #ccc;border-radius:6px;padding:6px;">
        <div style="display:flex;align-items:center;justify-content:space-between;font:bold 8pt Arial;gap:4px;margin-bottom:6px;">
          <span>Refresh Interval:</span>
          <select id="pld-interval" style="border:1px solid #000;background:#fff;">
            ${[3,5,7,10,15,20,30,45,60].map(v => `<option value="${v*1000}" ${v*1000===s.intervalMs?'selected':''}>${v}s</option>`).join('')}
          </select>
          <span>Run For:</span>
          <select id="pld-duration" style="border:1px solid #000;background:#fff;">
            ${[5,10,15,20,30,45,60].map(v => `<option value="${v*60000}" ${v*60000===s.durationMs?'selected':''}>${v}m</option>`).join('')}
          </select>
        </div>

        <label style="display:block;font:8pt Arial;text-align:left;margin-bottom:4px;">
          <input id="pld-enable-alerts" type="checkbox" ${s.alertsEnabled?'checked':''} style="vertical-align:middle;margin-right:6px;">
          Enable Notifications
        </label>

        <div id="pld-alert-settings" style="${s.alertsEnabled?'':'display:none;'};margin-top:4px;">
          <label style="display:block;font:8pt Arial;text-align:left;margin-bottom:4px;">
            <input id="pld-desktop-alerts" type="checkbox" ${s.desktopNotify?'checked':''} style="vertical-align:middle;margin-right:6px;">
            Enable Desktop Notifications
          </label>

          <div style="font:8pt Arial;margin-bottom:4px;text-align:left;">
            <span style="font-weight:bold;margin-right:6px;">Filter By:</span>
            <label style="margin-right:10px;"><input id="pld-filter-color"   type="checkbox" ${s.filterColor?'checked':''}   style="vertical-align:middle;margin-right:4px;">Color</label>
            <label style="margin-right:10px;"><input id="pld-filter-species" type="checkbox" ${s.filterSpecies?'checked':''} style="vertical-align:middle;margin-right:4px;">Species</label>
            <label><input id="pld-filter-name"    type="checkbox" ${s.filterName?'checked':''}    style="vertical-align:middle;margin-right:4px;">Name</label>
          </div>

          <div id="pld-color-box"   style="${s.filterColor?'':'display:none;'};margin-bottom:4px;">
            <input id="color-input"   type="text" placeholder="Filter by Color (e.g. Faerie, Ghost)"   value="${(s.colors||[]).join(', ').replace(/"/g,'&quot;')}"   style="width:100%;font:8pt Arial;border:1px solid #000;background:#fff;padding:2px;">
          </div>
          <div id="pld-species-box" style="${s.filterSpecies?'':'display:none;'};margin-bottom:4px;">
            <input id="species-input" type="text" placeholder="Filter by Species (e.g. Draik, Kacheek)" value="${(s.species||[]).join(', ').replace(/"/g,'&quot;')}" style="width:100%;font:8pt Arial;border:1px solid #000;background:#fff;padding:2px;">
          </div>
          <div id="pld-name-box"    style="${s.filterName?'':'display:none;'};margin-bottom:4px;">
            <input id="name-input"    type="text" placeholder="Filter by Name (e.g. Kitty, Sunshine)"   value="${(s.names||[]).join(', ').replace(/"/g,'&quot;')}"   style="width:100%;font:8pt Arial;border:1px solid #000;background:#fff;padding:2px;">
          </div>

          <label style="display:block;font:8pt Arial;text-align:left;margin-top:4px;">
            <input id="pld-auto-resume" type="checkbox" ${s.autoResume?'checked':''} style="vertical-align:middle;margin-right:6px;">
            Auto-Resume after notification
          </label>
        </div>
      </div>

      <input type="text" id="pld-search" placeholder="🔍 Filter log..." style="width:100%;margin-top:6px;${logVisible?'':'display:none;'}">
      <div id="pld-log" style="margin-top:6px;text-align:left;${logVisible?'':'display:none;'}">${log.length ? entriesHTML : '⚠️ No pets logged yet.'}</div>
      <div id="pld-exportrow" style="margin-top:8px;border-top:1px solid #ddd;padding-top:6px;display:${logVisible?'flex':'none'};gap:6px;">
        <button id="pld-export-csv" style="flex:1;">Export CSV</button>
        <button id="pld-export-txt" style="flex:1;">Export TXT</button>
      </div>
    `;
    document.body.appendChild(wrap);

    bindUI();
  }

  function bindUI() {
    const s = loadSettings();

    const clearBtn = document.getElementById('pld-clear');
    const saveBtn  = document.getElementById('pld-save');
    const logTog   = document.getElementById('pld-logtoggle');
    const setBtn   = document.getElementById('pld-settings');

    const playBtn  = document.getElementById('pld-play');
    const pauseBtn = document.getElementById('pld-pause');
    const stopBtn  = document.getElementById('pld-stop');

    const statusEl = document.getElementById('pld-status');
    const searchEl = document.getElementById('pld-search');
    const logEl    = document.getElementById('pld-log');

    // settings
    const intervalSel   = document.getElementById('pld-interval');
    const durationSel   = document.getElementById('pld-duration');
    const enableAlerts  = document.getElementById('pld-enable-alerts');
    const alertPanel    = document.getElementById('pld-alert-settings');
    const desktopChk    = document.getElementById('pld-desktop-alerts');
    const chkColor      = document.getElementById('pld-filter-color');
    const chkSpecies    = document.getElementById('pld-filter-species');
    const chkName       = document.getElementById('pld-filter-name');
    const colorBox      = document.getElementById('pld-color-box');
    const speciesBox    = document.getElementById('pld-species-box');
    const nameBox       = document.getElementById('pld-name-box');
    const colorInput    = document.getElementById('color-input');
    const speciesInput  = document.getElementById('species-input');
    const nameInput     = document.getElementById('name-input');
    const autoResumeChk = document.getElementById('pld-auto-resume');

    // Settings toggle
    setBtn.onclick = () => {
      const p = document.getElementById('pld-settings-panel');
      p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    };

    // Save button persistence (color state)
    saveBtn.onclick = () => {
      const green = '#0c0', red = '#c00';
      const current = localStorage.getItem(SAVE_MODE_KEY) === 'on';
      const newState = !current;
      localStorage.setItem(SAVE_MODE_KEY, newState ? 'on' : 'off');
      saveBtn.style.background = newState ? green : red;
    };

    // Log toggle
    logTog.onclick = () => {
      const newState = !(JSON.parse(localStorage.getItem(LOG_VISIBLE_KEY) || 'false'));
      localStorage.setItem(LOG_VISIBLE_KEY, String(newState));
      [searchEl, logEl, document.getElementById('pld-exportrow')].forEach(el => {
        if (el) el.style.display = newState ? '' : 'none';
      });
      if (newState) ensureNoPetsMessage();
    };

    // Smart clear: single-click = clear log; double-click = wipe everything
    let lastClick = 0, timer = null;
    clearBtn.onclick = () => {
      const now = Date.now();
      if (now - lastClick < 1500) {
        lastClick = 0; if (timer) { clearTimeout(timer); timer = null; }
        localStorage.removeItem(SETTINGS_KEY);
        localStorage.removeItem(LOG_KEY);
        localStorage.removeItem(RUN_FLAG);
        localStorage.removeItem(PAUSE_FLAG);
        localStorage.removeItem(START_MS);
        localStorage.removeItem(PAUSE_OFFSET);
        localStorage.removeItem(REFRESH_COUNT);
        localStorage.removeItem(LOG_VISIBLE_KEY);
        localStorage.removeItem(SAVE_MODE_KEY);
        alert('⚠️ All settings cleared.');
        location.reload();
      } else {
        lastClick = now;
        timer = setTimeout(() => {
          localStorage.removeItem(LOG_KEY);
          const logDiv = document.getElementById('pld-log');
          if (logDiv) logDiv.innerHTML = '⚠️ No pets logged yet.';
        }, 300);
      }
    };

    intervalSel.onchange = e => { s.intervalMs = clamp(+e.target.value, MIN_INTERVAL_MS, MAX_INTERVAL_MS); saveSettings(s); };
    durationSel.onchange = e => { s.durationMs = clamp(+e.target.value, 60000, MAX_DURATION_MS); saveSettings(s); };

    enableAlerts.onchange = () => {
      s.alertsEnabled = enableAlerts.checked;
      alertPanel.style.display = s.alertsEnabled ? 'block' : 'none';
      saveSettings(s);
      if (s.alertsEnabled) retroHighlightAndScroll(); else clearHighlights();
    };

    desktopChk.onchange = () => {
      s.desktopNotify = desktopChk.checked;
      saveSettings(s);
      if (s.desktopNotify && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    };

    chkColor.onchange = () => {
      s.filterColor = chkColor.checked; saveSettings(s);
      colorBox.style.display = s.filterColor ? 'block' : 'none';
      retroHighlightAndScroll();
    };
    chkSpecies.onchange = () => {
      s.filterSpecies = chkSpecies.checked; saveSettings(s);
      speciesBox.style.display = s.filterSpecies ? 'block' : 'none';
      retroHighlightAndScroll();
    };
    chkName.onchange = () => {
      s.filterName = chkName.checked; saveSettings(s);
      nameBox.style.display = s.filterName ? 'block' : 'none';
      retroHighlightAndScroll();
    };

    const parseCSV = (str) => (str || '')
      .toLowerCase()
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    colorInput.oninput   = () => { s.colors  = parseCSV(colorInput.value);   saveSettings(s); retroHighlightAndScroll(); };
    speciesInput.oninput = () => { s.species = parseCSV(speciesInput.value); saveSettings(s); retroHighlightAndScroll(); };
    nameInput.oninput    = () => { s.names   = parseCSV(nameInput.value);    saveSettings(s); retroHighlightAndScroll(); };

    autoResumeChk.onchange = () => { s.autoResume = autoResumeChk.checked; saveSettings(s); };

    playBtn.onclick  = startSession;
    pauseBtn.onclick = togglePause;
    stopBtn.onclick  = stopSession;

    if (searchEl) {
      searchEl.oninput = () => {
        const q = searchEl.value.toLowerCase();
        document.querySelectorAll('#pld-log .pld-entry').forEach(el => {
          el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      };
    }

    renderStatus(statusEl);
  }

  // ---------- Matching & Highlighting ----------
  function matchesActiveFilters(name, color, species, s) {
    const nameLC = name.toLowerCase();
    const colorLC = color.toLowerCase();
    const speciesLC = species.toLowerCase();

    const colorMatch   = s.filterColor   ? s.colors.some(c => c === colorLC)      : true;
    const speciesMatch = s.filterSpecies ? s.species.some(sp => sp === speciesLC) : true;
    const nameMatch    = s.filterName    ? s.names.some(n => nameLC.includes(n))  : true;

    const activeCount = (s.filterColor?1:0) + (s.filterSpecies?1:0) + (s.filterName?1:0);
    if (activeCount === 0) return false; // nothing selected -> do not notify/highlight
    return colorMatch && speciesMatch && nameMatch;
  }

  function retroHighlightAndScroll() {
    const s = loadSettings();
    let firstMatchEl = null;
    document.querySelectorAll('#pld-log .pld-entry').forEach(row => {
      const leftSpan = row.querySelector('span');
      const raw = leftSpan.textContent;
      const [nm, rest] = raw.split(' (');
      const name = nm || '';
      const inside = rest ? rest.replace(')', '') : '';
      const parts = inside.split(' ');
      const color = parts[0] || '';
      const species = parts.slice(1).join(' ') || '';

      const match = s.alertsEnabled && matchesActiveFilters(name, color, species, s);
      if (match) {
        leftSpan.innerHTML = `<b style="color:green;">${raw}</b>`;
        if (!firstMatchEl) firstMatchEl = row;
      } else {
        leftSpan.innerHTML = raw;
      }
    });
    if (firstMatchEl) firstMatchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearHighlights() {
    document.querySelectorAll('#pld-log .pld-entry span:first-child').forEach(span => {
      const raw = span.textContent;
      span.innerHTML = raw;
    });
  }

  // ---------- Logging & Export ----------
  function ensureNoPetsMessage() {
    const logDiv = document.getElementById('pld-log');
    if (!logDiv) return;
    const isVisible = logDiv.style.display !== 'none';
    if (!isVisible) return;

    const stored = readLog();
    const anyPetElems = !!document.getElementById('pet0_name') ||
                        !!document.getElementById('pet1_name') ||
                        !!document.getElementById('pet2_name');

    if (!stored.length && !anyPetElems) {
      logDiv.innerHTML = '⚠️ No pets logged yet.';
    }
  }

  function exportLog(fmt) {
    const arr = readLog();
    if (!arr.length) { alert('No pets to export.'); return; }
    const lines = (fmt === 'txt')
      ? arr.map(p => `${p.name} (${p.color} ${p.species}) - https://www.neopets.com/pound/adopt.phtml?search=${p.name}`)
      : ['Name,Color,Species,Adopt Link', ...arr.map(p => `"${p.name}","${p.color}","${p.species}","https://www.neopets.com/pound/adopt.phtml?search=${p.name}"`)];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neopets_pound_log.${fmt}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'pld-export-txt') exportLog('txt');
    if (e.target && e.target.id === 'pld-export-csv') exportLog('csv');
  });

  // Insert pet rows at TOP, alert + pause on match, optional desktop notify
  function collectPetsAndMaybeAlert() {
    const s = loadSettings();
    const logEl = document.getElementById('pld-log');
    if (!logEl) return;

    const stored = readLog();
    const seen = new Set(stored.map(p => `${p.name}|${p.color}|${p.species}`.toLowerCase()));

    let idx = 0;
    let foundAnyMatch = false;

    while (true) {
      const n  = document.getElementById(`pet${idx}_name`);
      const c  = document.getElementById(`pet${idx}_color`);
      const sp = document.getElementById(`pet${idx}_species`);
      if (!n || !c || !sp) break;

      const name    = n.textContent.trim();
      const color   = c.textContent.trim();
      const species = sp.textContent.trim();
      const key = `${name}|${color}|${species}`.toLowerCase();

      if (!seen.has(key)) {
        const row = document.createElement('div');
        row.className = 'pld-entry';
        row.setAttribute('data-name', name.toLowerCase());
        row.setAttribute('data-color', color.toLowerCase());
        row.setAttribute('data-species', species.toLowerCase());
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin:2px 0;';
        row.innerHTML = `
          <span style="text-align:left;">${name} (${color} ${species})</span>
          <span style="white-space:nowrap;">
            <a href="https://www.neopets.com/~${encodeURIComponent(name)}" target="_blank">📄</a>
            <a href="https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(name)}" target="_blank">➡️</a>
          </span>`;
        logEl.prepend(row);

        stored.unshift({ name, color, species });
        seen.add(key);

        if (s.alertsEnabled && matchesActiveFilters(name, color, species, s)) {
          const leftSpan = row.querySelector('span');
          const raw = leftSpan.textContent;
          leftSpan.innerHTML = `<b style="color:green;">${raw}</b>`;
          row.scrollIntoView({ behavior: 'smooth', block: 'start' });

          alert(`🎉 Found: ${name} (${color} ${species})`);

          if (s.desktopNotify && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              desktopNotify(name, color, species, findPetIconSrc());
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(p => {
                if (p === 'granted') desktopNotify(name, color, species, findPetIconSrc());
              });
            }
          }

          foundAnyMatch = true;
        }
      }
      idx++;
    }

    writeLog(stored);

    if (s.alertsEnabled) retroHighlightAndScroll();

    if (foundAnyMatch) {
      localStorage.setItem(PAUSE_FLAG, 'true');
      if (nextReloadTimer) { clearTimeout(nextReloadTimer); nextReloadTimer = null; }
      renderStatus(document.getElementById('pld-status'));
      if (s.autoResume) {
        setTimeout(() => {
          const running = localStorage.getItem(RUN_FLAG) === 'true';
          const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
          if (running && paused) togglePause();
        }, AUTO_RESUME_DELAY);
      }
    }

    ensureNoPetsMessage();
  }

  // ---------- Session Controls ----------
  function startSession() {
    const s = loadSettings();
    s.intervalMs = clamp(s.intervalMs || DEFAULT_INTERVAL_MS, MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    s.durationMs = clamp(s.durationMs || DEFAULT_DURATION_MS, 60000, MAX_DURATION_MS);
    saveSettings(s);

    const now = Date.now();
    localStorage.setItem(RUN_FLAG, 'true');
    localStorage.setItem(PAUSE_FLAG, 'false');
    localStorage.setItem(START_MS, String(now));
    localStorage.setItem(REFRESH_COUNT, '0');
    localStorage.removeItem(PAUSE_OFFSET);

    scheduleNextReload();
    renderStatus(document.getElementById('pld-status'));
    collectPetsAndMaybeAlert();
  }

  function togglePause() {
    const paused = localStorage.getItem(PAUSE_FLAG) === 'true';
    const now = Date.now();
    if (!paused) {
      const start = +(localStorage.getItem(START_MS) || now);
      const elapsed = now - start;
      localStorage.setItem(PAUSE_OFFSET, String(elapsed));
      localStorage.setItem(PAUSE_FLAG, 'true');
      if (nextReloadTimer) { clearTimeout(nextReloadTimer); nextReloadTimer = null; }
    } else {
      const offset = +(localStorage.getItem(PAUSE_OFFSET) || 0);
      const resumedAt = now - offset;
      localStorage.setItem(START_MS, String(resumedAt));
      localStorage.setItem(PAUSE_FLAG, 'false');
      localStorage.removeItem(PAUSE_OFFSET);
      scheduleNextReload();
    }
    renderStatus(document.getElementById('pld-status'));
  }

  function stopSession() {
    if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
    if (nextReloadTimer) { clearTimeout(nextReloadTimer); nextReloadTimer = null; }
    localStorage.setItem(RUN_FLAG, 'false');
    localStorage.setItem(PAUSE_FLAG, 'false');
    localStorage.removeItem(PAUSE_OFFSET);
    renderStatus(document.getElementById('pld-status'), true);
  }

  function renderStatus(el, forceIdle = false) {
    if (!el) return;
    const running = localStorage.getItem(RUN_FLAG) === 'true';
    const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
    const s = loadSettings();
    const start = +(localStorage.getItem(START_MS) || 0);
    const now = Date.now();
    let elapsed = 0, remain = 0;
    if (start) {
      elapsed = paused ? +(localStorage.getItem(PAUSE_OFFSET) || 0) : (now - start);
      remain = Math.max(0, (s.durationMs || DEFAULT_DURATION_MS) - elapsed);
    }

    if (forceIdle || !running) {
      el.textContent = 'Idle';
      el.style.opacity = 1;
      setTimeout(() => { el.style.transition = 'opacity 2s'; el.style.opacity = 0.3; }, 2000);
      if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
    } else if (paused) {
      el.textContent = `Paused. Remaining Session: ${fmtMMSS(remain)}`;
      if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
    } else {
      el.textContent = `Active. Remaining Session: ${fmtMMSS(remain)}`;
      if (!liveTimer) {
        liveTimer = setInterval(() => {
          const runningNow = localStorage.getItem(RUN_FLAG) === 'true';
          const pausedNow  = localStorage.getItem(PAUSE_FLAG) === 'true';
          if (!runningNow || pausedNow) return;
          const startMs = +(localStorage.getItem(START_MS) || 0);
          const nowMs   = Date.now();
          const elapsedMs = nowMs - startMs;
          const remainMs  = Math.max(0, (s.durationMs || DEFAULT_DURATION_MS) - elapsedMs);
          el.textContent = `Active. Remaining Session: ${fmtMMSS(remainMs)}`;
          if (remainMs <= 0) { stopSession(); }
        }, 1000);
      }
    }
  }

  function scheduleNextReload() {
    if (nextReloadTimer) { clearTimeout(nextReloadTimer); nextReloadTimer = null; }
    const running = localStorage.getItem(RUN_FLAG) === 'true';
    const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
    if (!running || paused) return;
    const s = loadSettings();
    const interval = clamp(s.intervalMs || DEFAULT_INTERVAL_MS, MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    nextReloadTimer = setTimeout(() => {
      const n = (+localStorage.getItem(REFRESH_COUNT) || 0) + 1;
      localStorage.setItem(REFRESH_COUNT, String(n));
      location.reload();
    }, interval);
  }

  // ---------- Init (manual-surf logging + watchdog) ----------
  function init() {
    let tries = 0;
    const checkReady = () => {
      if (document.getElementById('pet0_name') || tries >= 20) {
        buildUI();
        collectPetsAndMaybeAlert();

        const running = localStorage.getItem(RUN_FLAG) === 'true';
        const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
        const s = loadSettings();
        const start = +(localStorage.getItem(START_MS) || 0);
        if (running && !paused && start) {
          const now = Date.now();
          const elapsed = now - start;
          if (elapsed < (s.durationMs || DEFAULT_DURATION_MS)) scheduleNextReload();
          else stopSession();
        }

        setTimeout(() => {
          const panel = document.getElementById('pld-panel');
          const anyPet = document.getElementById('pet0_name') ||
                         document.getElementById('pet1_name') ||
                         document.getElementById('pet2_name');
          if ((!panel || !anyPet) && (localStorage.getItem(RUN_FLAG) === 'true')) {
            console.warn('⚠️ Pound page glitch detected – reloading.');
            location.reload();
          }
        }, 5000);
      } else {
        tries++;
        setTimeout(checkReady, 250);
      }
    };
    checkReady();
  }

  window.addEventListener('load', init);
})();
