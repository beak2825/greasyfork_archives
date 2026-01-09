// ==UserScript==
// @name         Torn Full Progress Tracker (Monthly Dashboard)
// @namespace    https://greasyfork.org/users/yourname
// @version      1.3
// @description  Track Torn progress across stats, crimes, gym, racing, playtime, net worth with monthly snapshots, date-range filtering, figures, tabs, and charts.
// @author       Amandus
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562023/Torn%20Full%20Progress%20Tracker%20%28Monthly%20Dashboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562023/Torn%20Full%20Progress%20Tracker%20%28Monthly%20Dashboard%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // CONFIG
  // =========================
  const STORAGE_KEY = 'torn_progress_snapshots_v1';
  const SETTINGS_KEY = 'torn_progress_settings_v1';
  const CHART_JS_CDN = 'https://cdn.jsdelivr.net/npm/chart.js';
  const SNAPSHOT_FREQUENCY = 'daily'; // 'daily' or 'monthly'
  const DEFAULT_SECTIONS = [
    'basic',
    'stats',          // battle stats
    'personalstats',  // crimes, racing, playtime, gym totals, etc.
    'networth',       // net worth totals
    'money',          // cash, bank, points
  ];

  // =========================
  // STATE
  // =========================
  let settings = loadSettings();
  let chartInstance = null;

  // =========================
  // UTILITIES
  // =========================
  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
        apiKey: '',
        sections: DEFAULT_SECTIONS,
      };
    } catch {
      return { apiKey: '', sections: DEFAULT_SECTIONS };
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function loadSnapshots() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveSnapshots(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function monthKeyFromDate(date = new Date()) {
    return date.toISOString().slice(0, 7); // YYYY-MM
  }

  function dayKeyFromDate(date = new Date()) {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  function shouldSnapshotToday(snapshots) {
    const today = dayKeyFromDate();
    return !snapshots.__daily || snapshots.__daily !== today;
  }

  function safeGet(obj, path, fallback = null) {
    try {
      const parts = path.split('.');
      let cur = obj;
      for (const p of parts) cur = cur[p];
      return cur ?? fallback;
    } catch {
      return fallback;
    }
  }

  // =========================
  // API
  // =========================
  async function fetchUserData(apiKey, sections) {
    const url = `https://api.torn.com/user/?selections=${encodeURIComponent(sections.join(','))}&key=${apiKey}`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => {
          try {
            const data = JSON.parse(res.responseText);
            if (data.error) {
              reject(new Error(`API Error: ${data.error.error}`));
            } else {
              resolve(data);
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: (err) => reject(err),
      });
    });
  }

  function normalizeSnapshot(raw) {
    const now = new Date();
    const snapshot = {
      timestamp: now.toISOString(),
      monthKey: monthKeyFromDate(now),
      dayKey: dayKeyFromDate(now),

      // Basic
      level: safeGet(raw, 'level'),
      rank: safeGet(raw, 'rank'),
      faction: safeGet(raw, 'faction'),
      life: safeGet(raw, 'life.current'),
      energy: safeGet(raw, 'energy.current'),
      nerve: safeGet(raw, 'nerve.current'),

      // Money
      money: {
        cash: safeGet(raw, 'money_onhand') ?? safeGet(raw, 'money'),
        bank: safeGet(raw, 'money_bank'),
        points: safeGet(raw, 'points'),
      },

      // Networth
      networth: {
        total: safeGet(raw, 'networth.total'),
        // Optional breakdowns if available:
        // items: safeGet(raw, 'networth.items'),
        // bazaar: safeGet(raw, 'networth.bazaar'),
        // display: safeGet(raw, 'networth.display'),
      },

      // Battle stats
      stats: {
        strength: safeGet(raw, 'strength') ?? safeGet(raw, 'stats.strength'),
        defense: safeGet(raw, 'defense') ?? safeGet(raw, 'stats.defense'),
        speed: safeGet(raw, 'speed') ?? safeGet(raw, 'stats.speed'),
        dexterity: safeGet(raw, 'dexterity') ?? safeGet(raw, 'stats.dexterity'),
        total: safeGet(raw, 'stats.total'),
      },

      // Personal stats (broad coverage)
      personal: {
        crimes: {
          committed: safeGet(raw, 'personalstats.crimes'),
          success: safeGet(raw, 'personalstats.crimesuccess'),
          fail: safeGet(raw, 'personalstats.crimefail'),
          respect: safeGet(raw, 'personalstats.crimerespect'),
        },
        gym: {
          trains: safeGet(raw, 'personalstats.gymtrains'),
          energyused: safeGet(raw, 'personalstats.energyused'),
          statgain: safeGet(raw, 'personalstats.statgain'),
        },
        racing: {
          racesentered: safeGet(raw, 'personalstats.racesentered'),
          raceswon: safeGet(raw, 'personalstats.raceswon'),
          bestlap: safeGet(raw, 'personalstats.bestlap'),
        },
        playtime: {
          activity: safeGet(raw, 'personalstats.activity'),
          timeonline: safeGet(raw, 'personalstats.timeonline'),
          logins: safeGet(raw, 'personalstats.logins'),
        },
        combat: {
          attackswon: safeGet(raw, 'personalstats.attackswon'),
          attackslost: safeGet(raw, 'personalstats.attackslost'),
          defendswon: safeGet(raw, 'personalstats.defendswon'),
          defendslost: safeGet(raw, 'personalstats.defendslost'),
        },
      },
    };

    return snapshot;
  }

  function saveMonthlySnapshot(snapshots, snapshot) {
    const monthKey = snapshot.monthKey;
    snapshots[monthKey] = snapshots[monthKey] || [];
    snapshots[monthKey].push(snapshot);
    snapshots.__daily = snapshot.dayKey; // mark last snapshot day
    saveSnapshots(snapshots);
  }

  // =========================
  // UI
  // =========================
  function injectStyles() {
    GM_addStyle(`
      #tpt-panel {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 99999;
        width: 480px;
        background: #1f2328;
        color: #e6edf3;
        border: 1px solid #30363d;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Noto Sans', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
      }
      #tpt-panel header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-bottom: 1px solid #30363d;
      }
      #tpt-panel .body {
        padding: 12px;
      }
      #tpt-panel input, #tpt-panel select, #tpt-panel button {
        background: #0d1117;
        color: #e6edf3;
        border: 1px solid #30363d;
        border-radius: 6px;
        padding: 6px 8px;
        margin: 4px 0;
      }
      #tpt-panel .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      #tpt-panel .section {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed #30363d;
      }
      #tpt-panel .figures {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      #tpt-panel .figure {
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 6px;
        padding: 8px;
      }
      #tpt-close {
        cursor: pointer;
        opacity: 0.8;
      }
      #tpt-close:hover { opacity: 1; }
      #tpt-panel .tabs {
        display: flex;
        gap: 6px;
        margin-top: 8px;
        flex-wrap: wrap;
      }
      #tpt-panel .tab {
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #30363d;
        background: #0d1117;
        cursor: pointer;
      }
      #tpt-panel .tab.active {
        background: #2b3137;
        border-color: #3b82f6;
      }
    `);
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'tpt-panel';
    panel.innerHTML = `
      <header>
        <strong>Torn Progress Tracker</strong>
        <span id="tpt-close">✕</span>
      </header>
      <div class="body">
        <div class="grid">
          <div>
            <label><small>API Key</small></label>
            <input type="password" id="tpt-api" placeholder="Enter API key" value="${settings.apiKey || ''}">
          </div>
          <div>
            <label><small>Sections</small></label>
            <input type="text" id="tpt-sections" value="${(settings.sections || DEFAULT_SECTIONS).join(',')}" title="Comma-separated selections">
          </div>
          <div>
            <label><small>Start (YYYY-MM)</small></label>
            <input type="month" id="tpt-start">
          </div>
          <div>
            <label><small>End (YYYY-MM)</small></label>
            <input type="month" id="tpt-end">
          </div>
        </div>

        <div class="tabs">
          <button class="tab active" data-tab="stats">Stats</button>
          <button class="tab" data-tab="networth">Net worth</button>
          <button class="tab" data-tab="crimes">Crimes</button>
          <button class="tab" data-tab="gym">Gym</button>
          <button class="tab" data-tab="racing">Racing</button>
          <button class="tab" data-tab="playtime">Playtime</button>
        </div>

        <div class="section">
          <canvas id="tpt-chart" height="220"></canvas>
        </div>
        <div class="section figures" id="tpt-figures"></div>

        <div style="margin-top:8px;">
          <button id="tpt-save">Save Settings</button>
          <button id="tpt-snapshot">Snapshot Now</button>
          <button id="tpt-export">Export</button>
          <button id="tpt-import">Import</button>
          <button id="tpt-clear">Clear</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('tpt-close').addEventListener('click', () => panel.remove());
    document.getElementById('tpt-save').addEventListener('click', onSaveSettings);
    document.getElementById('tpt-snapshot').addEventListener('click', onSnapshotNow);
    document.getElementById('tpt-export').addEventListener('click', onExport);
    document.getElementById('tpt-import').addEventListener('click', onImport);
    document.getElementById('tpt-clear').addEventListener('click', onClear);

    document.getElementById('tpt-start').addEventListener('change', renderRange);
    document.getElementById('tpt-end').addEventListener('change', renderRange);

    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderRange();
      });
    });
  }

  function onSaveSettings() {
    const api = document.getElementById('tpt-api').value.trim();
    const sections = document.getElementById('tpt-sections').value.split(',').map(s => s.trim()).filter(Boolean);
    settings.apiKey = api;
    settings.sections = sections.length ? sections : DEFAULT_SECTIONS;
    saveSettings();
    renderRange();
  }

  async function onSnapshotNow() {
    if (!settings.apiKey) {
      alert('Please enter your API key.');
      return;
    }
    try {
      const raw = await fetchUserData(settings.apiKey, settings.sections);
      const snapshot = normalizeSnapshot(raw);
      const snapshots = loadSnapshots();
      saveMonthlySnapshot(snapshots, snapshot);
      renderRange();
    } catch (e) {
      console.error(e);
      alert(`Snapshot failed: ${e.message}`);
    }
  }

  function onExport() {
    const data = loadSnapshots();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `torn_progress_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          saveSnapshots(data);
          renderRange();
        } catch {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function onClear() {
    if (confirm('Clear all stored snapshots?')) {
      saveSnapshots({});
      renderRange();
    }
  }

  function ensureChartJs(callback) {
    if (typeof Chart !== 'undefined') {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = CHART_JS_CDN;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function computeGain(arr) {
    if (!arr.length || arr[0] == null || arr[arr.length - 1] == null) return null;
    return arr[arr.length - 1] - arr[0];
  }

  function renderFigures(figs) {
    const container = document.getElementById('tpt-figures');
    container.innerHTML = '';
    figs.forEach(f => {
      const div = document.createElement('div');
      div.className = 'figure';
      div.innerHTML = `<div style="font-size:12px;opacity:0.8;">${f.label}</div><div style="font-weight:600;">${f.value ?? '—'}</div>`;
      container.appendChild(div);
    });
  }

  function renderRange() {
    const start = document.getElementById('tpt-start').value || '';
    const end = document.getElementById('tpt-end').value || '';
    const snapshots = loadSnapshots();
    const months = Object.keys(snapshots)
      .filter(k => k !== '__daily')
      .filter(k => (!start || k >= start) && (!end || k <= end))
      .sort();

    const tab = document.querySelector('.tab.active').dataset.tab;

    // Collect monthly end-of-month values
    const labels = [];
    const series = {
      strength: [],
      defense: [],
      speed: [],
      dexterity: [],
      networth: [],
      crimesCommitted: [],
      crimesSuccess: [],
      crimesFail: [],
      gymTrains: [],
      gymStatGain: [],
      gymEnergyUsed: [],
      racesEntered: [],
      racesWon: [],
      bestLap: [],
      timeOnline: [],
      logins: [],
      activity: [],
    };

    months.forEach(m => {
      const arr = snapshots[m] || [];
      if (!arr.length) return;
      const last = arr[arr.length - 1];
      labels.push(m);

      series.strength.push(last.stats.strength ?? null);
      series.defense.push(last.stats.defense ?? null);
      series.speed.push(last.stats.speed ?? null);
      series.dexterity.push(last.stats.dexterity ?? null);

      series.networth.push(last.networth.total ?? null);

      series.crimesCommitted.push(last.personal.crimes.committed ?? null);
      series.crimesSuccess.push(last.personal.crimes.success ?? null);
      series.crimesFail.push(last.personal.crimes.fail ?? null);

      series.gymTrains.push(last.personal.gym.trains ?? null);
      series.gymStatGain.push(last.personal.gym.statgain ?? null);
      series.gymEnergyUsed.push(last.personal.gym.energyused ?? null);

      series.racesEntered.push(last.personal.racing.racesentered ?? null);
      series.racesWon.push(last.personal.racing.raceswon ?? null);
      series.bestLap.push(last.personal.racing.bestlap ?? null);

      series.timeOnline.push(last.personal.playtime.timeonline ?? null);
      series.logins.push(last.personal.playtime.logins ?? null);
      series.activity.push(last.personal.playtime.activity ?? null);
    });

    // Figures per tab
    let figs = [];
    let datasets = [];
    let type = 'line';
    let options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } },
      scales: { y: { title: { display: true, text: '' } } },
    };

    if (tab === 'stats') {
      type = 'line';
      datasets = [
        { label: 'Strength', data: series.strength, borderColor: '#ef4444', tension: 0.2 },
        { label: 'Defense', data: series.defense, borderColor: '#3b82f6', tension: 0.2 },
        { label: 'Speed', data: series.speed, borderColor: '#f59e0b', tension: 0.2 },
        { label: 'Dexterity', data: series.dexterity, borderColor: '#22c55e', tension: 0.2 },
      ];
      figs = [
        { label: 'Months covered', value: labels.length },
        { label: 'Strength gain', value: computeGain(series.strength) },
        { label: 'Defense gain', value: computeGain(series.defense) },
        { label: 'Speed gain', value: computeGain(series.speed) },
        { label: 'Dexterity gain', value: computeGain(series.dexterity) },
      ];
      options.scales.y.title.text = 'Battle stats';
    } else if (tab === 'networth') {
      type = 'line';
      datasets = [
        { label: 'Net worth', data: series.networth, borderColor: '#a855f7', tension: 0.2 },
      ];
      figs = [
        { label: 'Months covered', value: labels.length },
        { label: 'Net worth change', value: computeGain(series.networth) },
      ];
      options.scales.y.title.text = 'Net worth';
    } else if (tab === 'crimes') {
      type = 'bar';
      datasets = [
        { label: 'Committed', data: series.crimesCommitted, backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
        { label: 'Success', data: series.crimesSuccess, backgroundColor: '#22c55e', borderColor: '#22c55e' },
        { label: 'Fail', data: series.crimesFail, backgroundColor: '#ef4444', borderColor: '#ef4444' },
      ];
      figs = [
        { label: 'Months covered', value: labels.length },
        { label: 'Committed (Δ)', value: computeGain(series.crimesCommitted) },
        { label: 'Success (Δ)', value: computeGain(series.crimesSuccess) },
        { label: 'Fail (Δ)', value: computeGain(series.crimesFail) },
      ];
      options.scales.y.title.text = 'Crimes totals';
    } else if (tab === 'gym') {
      type = 'bar';
      datasets = [
        { label: 'Trains', data: series.gymTrains, backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
        { label: 'Stat gain', data: series.gymStatGain, backgroundColor: '#22c55e', borderColor: '#22c55e' },
        { label: 'Energy used', data: series.gymEnergyUsed, backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
      ];
      figs = [
        { label: 'Months covered', value: labels.length },
        { label: 'Trains (Δ)', value: computeGain(series.gymTrains) },
        { label: 'Stat gain (Δ)', value: computeGain(series.gymStatGain) },
        { label: 'Energy used (Δ)', value: computeGain(series.gymEnergyUsed) },
      ];
      options.scales.y.title.text = 'Gym totals';
    } else if (tab === 'racing') {
      type = 'bar';
      datasets = [
        { label: 'Races entered', data: series.racesEntered, backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
        { label: 'Races won', data: series.racesWon, backgroundColor: '#22c55e', borderColor: '#22c55e' },
      ];
      figs = [
        { label: 'Months covered', value: labels.length },
        { label: 'Entered (Δ)', value: computeGain(series.racesEntered) },
        { label: 'Won (Δ)', value: computeGain(series.racesWon) },
        { label: 'Best lap (latest)', value: series.bestLap.length ? series.bestLap[series.bestLap.length - 1] : null },
      ];
      options.scales.y.title.text = 'Racing totals';
    } else if (tab === 'playtime') {
      type = 'bar';
      datasets = [
        { label: 'Time online', data: series.timeOnline, backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
        { label: 'Logins', data: series.logins, backgroundColor: '#22c55e', borderColor: '#22c55e' },
        { label: 'Activity', data: series.activity, backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
      ];
      figs = [
        { label: 'Months covered', value: labels.length },
        { label: 'Time online (Δ)', value: computeGain(series.timeOnline) },
        { label: 'Logins (Δ)', value: computeGain(series.logins) },
        { label: 'Activity (Δ)', value: computeGain(series.activity) },
      ];
      options.scales.y.title.text = 'Playtime totals';
    }

    renderFigures(figs);

    ensureChartJs(() => {
      const ctx = document.getElementById('tpt-chart').getContext('2d');
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type,
        data: { labels, datasets },
        options,
      });
    });
  }

  // =========================
  // BOOTSTRAP
  // =========================
  async function init() {
    injectStyles();
    createPanel();

    // Auto snapshot (daily or monthly)
    const snapshots = loadSnapshots();
    if (SNAPSHOT_FREQUENCY === 'daily') {
      if (shouldSnapshotToday(snapshots) && settings.apiKey) {
        try {
          const raw = await fetchUserData(settings.apiKey, settings.sections);
          const snap = normalizeSnapshot(raw);
          saveMonthlySnapshot(snapshots, snap);
        } catch (e) {
          console.warn('Auto snapshot failed:', e.message);
        }
      }
    } else {
      // Monthly: only snapshot if month has no entries yet
      const monthKey = monthKeyFromDate();
      if ((!snapshots[monthKey] || !snapshots[monthKey].length) && settings.apiKey) {
        try {
          const raw = await fetchUserData(settings.apiKey, settings.sections);
          const snap = normalizeSnapshot(raw);
          saveMonthlySnapshot(snapshots, snap);
        } catch (e) {
          console.warn('Auto snapshot failed:', e.message);
        }
      }
    }

    renderRange();
  }

  const readyInterval = setInterval(() => {
    if (document.body) {
      clearInterval(readyInterval);
      init();
    }
  }, 500);
})();