// ==UserScript==
// @name         TORN Faction Spy - Gym Energy & Xanax Tracker
// @namespace    torn-spy-tracker
// @version      1.0.0
// @description  Track faction members gym energy spent + xanax taken deltas (7d/30d/since last fetch) using Torn API, stored in localStorage, with export/import.
// @match        https://www.torn.com/factions.php*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @author       WinterValor [3945658]
// @downloadURL https://update.greasyfork.org/scripts/563470/TORN%20Faction%20Spy%20-%20Gym%20Energy%20%20Xanax%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563470/TORN%20Faction%20Spy%20-%20Gym%20Energy%20%20Xanax%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Only activate on factions.php?step=your
  const params = new URLSearchParams(location.search);
  if (params.get('step') !== 'your') return;

  /********************************************************************
   * Storage
   ********************************************************************/
  const STORAGE_KEY = 'torn_spy_tracker_v1';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return migrateState(parsed);
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function defaultState() {
    return {
      version: 1,
      apiKey: '',
      lastUpdatedMs: null,
      roster: {
        lastFetchMemberIds: [],
        lastFetchUsernamesById: {}
      },
      members: {
        // [id]: { snapshots: [{tsMs, gymenergy, xantaken}], usernameHistory: [{tsMs, username}] }
      },
      ui: {
        buttonPos: { x: 20, y: 220 },
        panelPos: { x: 80, y: 220 },
        expanded: false
      },
      exportSettings: {
        includeApiKey: false
      }
    };
  }

  function migrateState(s) {
    // Simple forward-compat hook
    if (!s || typeof s !== 'object') return defaultState();
    if (!s.version) return { ...defaultState(), ...s, version: 1 };
    // Ensure required paths
    const d = defaultState();
    return {
      ...d,
      ...s,
      roster: { ...d.roster, ...(s.roster || {}) },
      ui: { ...d.ui, ...(s.ui || {}) },
      exportSettings: { ...d.exportSettings, ...(s.exportSettings || {}) },
      members: s.members || d.members
    };
  }

  let state = loadState();

  /********************************************************************
   * Torn API helpers (GM_xmlhttpRequest to avoid CORS headaches)
   ********************************************************************/
  function gmGetJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { accept: 'application/json' },
        onload: (resp) => {
          try {
            const data = JSON.parse(resp.responseText);
            // Torn API often returns {error:{code,message}} on failure
            if (data && data.error) {
              reject(new Error(`API error ${data.error.code}: ${data.error.error || data.error.message || 'Unknown error'}`));
              return;
            }
            resolve(data);
          } catch (e) {
            reject(new Error('Failed to parse API response as JSON'));
          }
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Request timed out')),
        timeout: 30000
      });
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function tornUrlFactionGymEnergy(apiKey) {
    const key = encodeURIComponent(apiKey);
    return `https://api.torn.com/v2/faction/contributors?stat=gymenergy&key=${key}`;
  }

  function tornUrlUserXanTaken(userId, apiKey) {
    const key = encodeURIComponent(apiKey);
    return `https://api.torn.com/v2/user/${encodeURIComponent(userId)}/personalstats?stat=xantaken&key=${key}`;
  }

  async function fetchFactionGymEnergy(apiKey) {
    const data = await gmGetJson(tornUrlFactionGymEnergy(apiKey));
    if (!data || !Array.isArray(data.contributors)) throw new Error('Unexpected response for contributors');
    return data.contributors; // [{id, username, value, in_faction}]
  }

  async function fetchUserXanTaken(userId, apiKey) {
    const data = await gmGetJson(tornUrlUserXanTaken(userId, apiKey));
    if (!data || !Array.isArray(data.personalstats)) throw new Error('Unexpected response for personalstats');
    const entry = data.personalstats.find((x) => x && x.name === 'xantaken');
    return entry ? Number(entry.value) : 0;
  }

  /********************************************************************
   * Snapshot logic
   ********************************************************************/
  function ensureMember(id) {
    const key = String(id);
    if (!state.members[key]) {
      state.members[key] = { snapshots: [], usernameHistory: [] };
    }
    return state.members[key];
  }

  function recordUsername(id, username, tsMs) {
    const m = ensureMember(id);
    const last = m.usernameHistory[m.usernameHistory.length - 1];
    if (!last || last.username !== username) {
      m.usernameHistory.push({ tsMs, username });
    }
  }

  function recordSnapshot(id, username, gymenergy, xantaken, tsMs) {
    const m = ensureMember(id);
    recordUsername(id, username, tsMs);

    m.snapshots.push({
      tsMs,
      gymenergy: Number(gymenergy),
      xantaken: xantaken == null ? null : Number(xantaken)
    });

    // Keep snapshots sorted + bounded
    m.snapshots.sort((a, b) => a.tsMs - b.tsMs);
    if (m.snapshots.length > 600) {
      m.snapshots.splice(0, m.snapshots.length - 600);
    }
  }

  function getLatestSnapshot(id) {
    const m = state.members[String(id)];
    if (!m || !m.snapshots.length) return null;
    return m.snapshots[m.snapshots.length - 1];
  }

  function getSnapshotAtOrBefore(id, targetTsMs) {
    const m = state.members[String(id)];
    if (!m || !m.snapshots.length) return null;
    // binary search
    let lo = 0, hi = m.snapshots.length - 1;
    let ans = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const s = m.snapshots[mid];
      if (s.tsMs <= targetTsMs) {
        ans = s;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }

  function computeDelta(id, field, mode) {
    const m = state.members[String(id)];
    if (!m || m.snapshots.length === 0) return { delta: null, latest: null };

    const latest = m.snapshots[m.snapshots.length - 1];
    const latestVal = latest[field];
    if (latestVal == null) return { delta: null, latest };

    let base = null;

    if (mode === 'since_last_fetch') {
      if (m.snapshots.length < 2) return { delta: null, latest };
      base = m.snapshots[m.snapshots.length - 2];
    } else if (mode === '7d' || mode === '30d') {
      const days = mode === '7d' ? 7 : 30;
      const target = Date.now() - days * 24 * 60 * 60 * 1000;
      base = getSnapshotAtOrBefore(id, target) || m.snapshots[0];
    }

    if (!base) return { delta: null, latest };
    const baseVal = base[field];
    if (baseVal == null) return { delta: null, latest };

    const delta = Number(latestVal) - Number(baseVal);
    return { delta: Number.isFinite(delta) ? Math.max(0, delta) : null, latest };
  }

  function formatNumber(n) {
    if (n == null) return '—';
    try {
      return new Intl.NumberFormat().format(n);
    } catch {
      return String(n);
    }
  }

  function formatTime(ms) {
    if (!ms) return 'Never';
    const d = new Date(ms);
    return d.toLocaleString();
  }

  /********************************************************************
   * UI (Purple & Gold theme)
   ********************************************************************/
  const THEME = {
    bg0: 'rgb(48,25,48)',      // deep purple
    bg1: 'rgb(73,38,75)',      // mid purple
    gold: 'rgb(249,215,23)',   // bright gold
    gold2: 'rgb(233,135,20)',  // orange-gold
    text: 'rgba(255,255,255,0.92)',
    textDim: 'rgba(255,255,255,0.70)',
    border: 'rgba(249,215,23,0.28)',
    shadow: 'rgba(0,0,0,0.45)'
  };

  const style = document.createElement('style');
  style.textContent = `
  .tst-root { position: fixed; z-index: 999999; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }

  .tst-btn {
    width: 44px; height: 44px; border-radius: 14px;
    background: radial-gradient(120% 120% at 30% 30%, ${THEME.gold}, ${THEME.gold2});
    color: rgba(20,10,20,0.95);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; letter-spacing: 0.5px;
    box-shadow: 0 10px 24px ${THEME.shadow};
    cursor: grab;
    user-select: none;
    border: 1px solid rgba(0,0,0,0.25);
  }
  .tst-btn:active { cursor: grabbing; transform: translateY(1px); }

  /* ---------- PANEL LAYOUT (prevents infinite height) ---------- */
  .tst-panel {
    width: 440px; max-width: min(440px, calc(100vw - 24px));
    background: linear-gradient(180deg, ${THEME.bg1}, ${THEME.bg0});
    color: ${THEME.text};
    border: 1px solid ${THEME.border};
    border-radius: 16px;
    box-shadow: 0 18px 44px ${THEME.shadow};
    overflow: hidden;
    user-select: none;

    display: flex;
    flex-direction: column;
    max-height: 80vh; /* <- key */
  }

  .tst-header {
    padding: 10px 12px;
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(180deg, rgba(249,215,23,0.18), rgba(249,215,23,0.04));
    border-bottom: 1px solid ${THEME.border};
    cursor: grab;
  }

  .tst-title { display:flex; gap:10px; align-items:center; font-weight: 800; }

  .tst-badge {
    padding: 2px 8px; border-radius: 999px;
    border: 1px solid rgba(249,215,23,0.35);
    background: rgba(0,0,0,0.20);
    color: ${THEME.gold};
    font-size: 12px; font-weight: 700;
  }

  .tst-close {
    width: 28px; height: 28px; border-radius: 10px;
    border: 1px solid rgba(249,215,23,0.35);
    background: rgba(0,0,0,0.22);
    color: ${THEME.text};
    cursor: pointer;
  }
  .tst-close:hover { filter: brightness(1.08); }

  .tst-tabs { display: flex; gap: 6px; padding: 10px 10px 0; }

  .tst-tab {
    flex: 1;
    padding: 8px 10px;
    border-radius: 12px 12px 0 0;
    background: rgba(0,0,0,0.20);
    border: 1px solid rgba(249,215,23,0.22);
    border-bottom: none;
    cursor: pointer;
    color: ${THEME.textDim};
    text-align: center;
    font-weight: 700;
    font-size: 13px;
  }

  .tst-tab.active {
    color: ${THEME.text};
    background: rgba(249,215,23,0.10);
    border-color: rgba(249,215,23,0.35);
  }

  /* Body should scroll inside the panel */
  .tst-body {
    padding: 12px 12px 14px;
    border-top: 1px solid rgba(249,215,23,0.22);
    background: rgba(0,0,0,0.14);
    user-select: text;

    flex: 1;                 /* <- key */
    overflow: auto;          /* <- key */
    -webkit-overflow-scrolling: touch;
  }

  .tst-row { display:flex; gap: 10px; align-items:center; margin: 8px 0; }
  .tst-col { display:flex; flex-direction: column; gap: 6px; }
  .tst-label { font-size: 12px; color: ${THEME.textDim}; }
  .tst-note { font-size: 12px; color: ${THEME.textDim}; line-height: 1.35; }

  .tst-btn2 {
    padding: 9px 12px;
    border-radius: 12px;
    border: 1px solid rgba(249,215,23,0.35);
    background: radial-gradient(140% 140% at 30% 30%, rgba(249,215,23,0.22), rgba(0,0,0,0.25));
    color: ${THEME.text};
    cursor: pointer;
    font-weight: 800;
    letter-spacing: 0.2px;
  }
  .tst-btn2:disabled { opacity: 0.55; cursor: not-allowed; }

  .tst-input, .tst-select {
    width: 100%;
    padding: 9px 10px;
    border-radius: 12px;
    border: 1px solid rgba(249,215,23,0.30);
    background: rgba(0,0,0,0.26);
    color: ${THEME.text};
    outline: none;
  }
  .tst-input::placeholder { color: rgba(255,255,255,0.35); }

  .tst-divider { height: 1px; background: rgba(249,215,23,0.22); margin: 12px 0; }

  /* ---------- TABLE WRAP SCROLL (member list scrolls) ---------- */
  .tst-tablewrap {
    border: 1px solid rgba(249,215,23,0.25);
    border-radius: 14px;

    max-height: 52vh;  /* <- key */
    overflow: auto;    /* <- key */
    -webkit-overflow-scrolling: touch;
  }

  .tst-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .tst-table th, .tst-table td {
    padding: 10px 10px;
    border-bottom: 1px solid rgba(249,215,23,0.12);
  }

  .tst-table th {
    text-align: left;
    font-size: 12px;
    color: ${THEME.textDim};
    background: rgba(0,0,0,0.18);
  }

  .tst-table tr:hover td { background: rgba(249,215,23,0.06); }

  .tst-right { text-align: right; }
  .tst-mono { font-variant-numeric: tabular-nums; }

  .tst-status {
    padding: 8px 10px;
    border-radius: 12px;
    border: 1px solid rgba(249,215,23,0.22);
    background: rgba(0,0,0,0.18);
    color: ${THEME.textDim};
    font-size: 12px;
    line-height: 1.35;
  }

  .tst-smallchk { display:flex; gap:8px; align-items:center; font-size: 12px; color: ${THEME.textDim}; }

  .tst-linkbtn {
    padding: 8px 10px;
    border-radius: 12px;
    border: 1px solid rgba(249,215,23,0.28);
    background: rgba(0,0,0,0.18);
    color: ${THEME.text};
    cursor: pointer;
    font-weight: 700;
  }

  /* ---------- FORCE WHITE TEXT (Torn page CSS was overriding) ---------- */
  .tst-panel, .tst-panel * {
    color: rgba(255,255,255,0.92) !important;
  }

  .tst-table th {
    color: rgba(255,255,255,0.75) !important;
  }

  .tst-table td {
    color: rgba(255,255,255,0.92) !important;
  }

  .tst-tab { color: rgba(255,255,255,0.70) !important; }
  .tst-tab.active { color: rgba(255,255,255,0.92) !important; }

  .tst-label, .tst-note, .tst-status, .tst-smallchk {
    color: rgba(255,255,255,0.70) !important;
  }

  .tst-input, .tst-select {
    color: rgba(255,255,255,0.92) !important;
    background: rgba(0,0,0,0.26) !important;
  }

  .tst-select option {
    color: rgba(255,255,255,0.92) !important;
    background: rgb(30, 15, 30) !important;
  }
`;
document.head.appendChild(style);


  // Root container
  const root = document.createElement('div');
  root.className = 'tst-root';
  document.body.appendChild(root);

  // Floating button
  const btn = document.createElement('div');
  btn.className = 'tst-btn';
  btn.textContent = 'S';
  root.appendChild(btn);

  // Panel
  const panel = document.createElement('div');
  panel.className = 'tst-panel';
  panel.style.display = state.ui.expanded ? 'block' : 'none';
  root.appendChild(panel);

  // Positioning
  function applyPositions() {
    // Button position
    btn.style.left = `${state.ui.buttonPos.x}px`;
    btn.style.top = `${state.ui.buttonPos.y}px`;
    btn.style.position = 'fixed';

    // Panel position
    panel.style.left = `${state.ui.panelPos.x}px`;
    panel.style.top = `${state.ui.panelPos.y}px`;
    panel.style.position = 'fixed';
  }
  applyPositions();

  function clampToViewport(pos, w, h) {
    const pad = 8;
    return {
      x: Math.min(Math.max(pad, pos.x), window.innerWidth - w - pad),
      y: Math.min(Math.max(pad, pos.y), window.innerHeight - h - pad),
    };
  }

  function ensureUiOnScreen() {
      // Clamp button
      const bRect = btn.getBoundingClientRect();
      state.ui.buttonPos = clampToViewport(state.ui.buttonPos, bRect.width, bRect.height);

      // Temporarily show panel to measure it if it's hidden
      const wasHidden = panel.style.display === 'none';
      if (wasHidden) panel.style.display = 'block';

      const pRect = panel.getBoundingClientRect();
      state.ui.panelPos = clampToViewport(state.ui.panelPos, pRect.width, pRect.height);

      if (wasHidden && !state.ui.expanded) panel.style.display = 'none';

      applyPositions();
      saveState();
  }

  // Draggable helper
  function makeDraggable(handleEl, moveEl, getPos, setPos, onSave) {
    let dragging = false;
    let startX = 0, startY = 0;
    let baseX = 0, baseY = 0;

    const onPointerDown = (e) => {
      dragging = true;
      handleEl.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const p = getPos();
      baseX = p.x;
      baseY = p.y;
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const next = { x: baseX + dx, y: baseY + dy };

      // clamp based on element size
      const rect = moveEl.getBoundingClientRect();
      const clamped = clampToViewport(next, rect.width, rect.height);

      setPos(clamped);
      applyPositions();
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      try { handleEl.releasePointerCapture(e.pointerId); } catch {}
      onSave?.();
    };

    handleEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  // Button drag
  makeDraggable(
    btn,
    btn,
    () => ({ ...state.ui.buttonPos }),
    (p) => { state.ui.buttonPos = p; },
    () => { saveState(); }
  );

  // Build panel content
  panel.innerHTML = `
    <div class="tst-header" id="tst-header">
      <div class="tst-title">
        <div style="width:10px;height:10px;border-radius:999px;background:${THEME.gold};box-shadow:0 0 12px rgba(249,215,23,0.35)"></div>
        <div>Faction Spy</div>
        <div class="tst-badge">v1</div>
      </div>
      <button class="tst-close" id="tst-close" title="Close">✕</button>
    </div>

    <div class="tst-tabs">
      <div class="tst-tab active" data-tab="fetch">Fetch</div>
      <div class="tst-tab" data-tab="energy">Energy</div>
      <div class="tst-tab" data-tab="xanax">Xanax</div>
      <div class="tst-tab" data-tab="settings">Settings</div>
    </div>

    <div class="tst-body">
      <div class="tst-tabpane" data-pane="fetch"></div>
      <div class="tst-tabpane" data-pane="energy" style="display:none"></div>
      <div class="tst-tabpane" data-pane="xanax" style="display:none"></div>
      <div class="tst-tabpane" data-pane="settings" style="display:none"></div>
    </div>
  `;

  // Panel drag by header
  const header = panel.querySelector('#tst-header');
  makeDraggable(
    header,
    panel,
    () => ({ ...state.ui.panelPos }),
    (p) => { state.ui.panelPos = p; },
    () => { saveState(); }
  );

  // Toggle open/close
    function setExpanded(expanded) {
        state.ui.expanded = expanded;
        panel.style.display = expanded ? 'block' : 'none';
        saveState();

        if (expanded) ensureUiOnScreen(); // <- ADD THIS
    }

  btn.addEventListener('click', (e) => {
    // If user was dragging, click can happen; ignore if moved significantly is complex—keep simple.
    setExpanded(!state.ui.expanded);
  });

  panel.querySelector('#tst-close').addEventListener('click', () => setExpanded(false));

  // Tabs
  const tabEls = Array.from(panel.querySelectorAll('.tst-tab'));
  const paneEls = Array.from(panel.querySelectorAll('.tst-tabpane'));

  function showTab(name) {
    tabEls.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    paneEls.forEach(p => p.style.display = (p.dataset.pane === name) ? 'block' : 'none');
    renderActiveTab();
  }
  tabEls.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

  // Pane refs
  const fetchPane = panel.querySelector('[data-pane="fetch"]');
  const energyPane = panel.querySelector('[data-pane="energy"]');
  const xanaxPane = panel.querySelector('[data-pane="xanax"]');
  const settingsPane = panel.querySelector('[data-pane="settings"]');

  // UI state
  let isFetching = false;
  let fetchProgress = { done: 0, total: 0, currentId: null };
  let fetchStatusText = '';

  // Renderers
  function renderFetchPane() {
    fetchPane.innerHTML = `
      <div class="tst-row">
        <button class="tst-btn2" id="tst-fetch-btn" ${isFetching ? 'disabled' : ''}>Fetch data</button>
        <div class="tst-col" style="flex:1">
          <div class="tst-label">Last updated</div>
          <div class="tst-mono">${formatTime(state.lastUpdatedMs)}</div>
        </div>
      </div>

      <div class="tst-status" id="tst-fetch-status">
        ${fetchStatusText || 'Click “Fetch data” to record a new snapshot for current faction members.'}
      </div>

      <div class="tst-divider"></div>
      <div class="tst-note">
        Notes:
        <ul style="margin:6px 0 0 18px; padding:0; color:${THEME.textDim}">
          <li>Gym energy is fetched in one call; Xanax requires one call per member (throttled).</li>
          <li>Only current members (from the last fetch) are shown in Energy/Xanax tabs; ex-members’ data is kept.</li>
        </ul>
      </div>
    `;

    fetchPane.querySelector('#tst-fetch-btn').addEventListener('click', onFetchClicked);
  }

  function renderEnergyOrXanaxTable(pane, field, title) {
    const currentIds = state.roster.lastFetchMemberIds || [];
    const usernames = state.roster.lastFetchUsernamesById || {};

    const modeSelectId = `${field}-mode`;

    // Default selection per field stored in DOM only
    const existing = pane.querySelector(`#${modeSelectId}`);
    const selectedMode = existing ? existing.value : '7d';

    // Build rows
    const rows = currentIds.map((id) => {
      const name = usernames[String(id)] || (state.members[String(id)]?.usernameHistory?.slice(-1)[0]?.username) || `#${id}`;
      const { delta, latest } = computeDelta(id, field, selectedMode);
      const latestVal = latest ? latest[field] : null;
      return { id, name, delta, latestVal };
    });

    // Sort by delta desc (null last)
    rows.sort((a, b) => {
      const av = a.delta == null ? -1 : a.delta;
      const bv = b.delta == null ? -1 : b.delta;
      return bv - av;
    });

    const hasRoster = currentIds.length > 0;

    pane.innerHTML = `
      <div class="tst-row" style="justify-content: space-between;">
        <div class="tst-col" style="flex:1">
          <div style="font-weight:800; font-size:14px;">${title}</div>
          <div class="tst-label">Based on snapshots saved to localStorage</div>
        </div>
        <div style="width: 180px;">
          <select class="tst-select" id="${modeSelectId}">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="since_last_fetch">Since last fetch</option>
          </select>
        </div>
      </div>

      <div class="tst-divider"></div>

      ${
        !hasRoster
          ? `<div class="tst-status">No roster yet. Go to the Fetch tab and click “Fetch data”.</div>`
          : `
            <div class="tst-tablewrap">
              <table class="tst-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th class="tst-right">Δ in range</th>
                    <th class="tst-right">Latest total</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    rows.map(r => `
                      <tr>
                        <td><span class="tst-mono">[${r.id}]</span> ${escapeHtml(r.name)}</td>
                        <td class="tst-right tst-mono" style="color:${THEME.gold}; font-weight:800;">${formatNumber(r.delta)}</td>
                        <td class="tst-right tst-mono">${formatNumber(r.latestVal)}</td>
                      </tr>
                    `).join('')
                  }
                </tbody>
              </table>
            </div>
          `
      }

      <div class="tst-divider"></div>
      <div class="tst-note">
        “Since last fetch” compares each member’s latest snapshot to their previous snapshot.
      </div>
    `;

    const sel = pane.querySelector(`#${modeSelectId}`);
    sel.value = selectedMode;
    sel.addEventListener('change', () => renderActiveTab());
  }

  function renderSettingsPane() {
    settingsPane.innerHTML = `
      <div class="tst-col">
        <div style="font-weight:800; font-size:14px;">Settings</div>
        <div class="tst-label">API key (stored in localStorage on this browser)</div>
        <input class="tst-input" id="tst-apikey" placeholder="Paste your Torn API key..." value="${escapeAttr(state.apiKey || '')}" />
        <div class="tst-note">
          Tip: Use an API key with only the permissions you need.
        </div>

        <div class="tst-divider"></div>

        <div class="tst-row" style="justify-content: space-between;">
          <button class="tst-linkbtn" id="tst-export">Export data</button>
          <button class="tst-linkbtn" id="tst-import">Import data</button>
        </div>

        <label class="tst-smallchk">
          <input type="checkbox" id="tst-include-key" ${state.exportSettings.includeApiKey ? 'checked' : ''} />
          Include API key in export (not recommended)
        </label>

        <div class="tst-divider"></div>

        <div class="tst-note">
          Export creates a JSON file with all recorded snapshots. Import will overwrite your current stored data.
        </div>
      </div>
    `;

    const apiInput = settingsPane.querySelector('#tst-apikey');
    apiInput.addEventListener('input', () => {
      state.apiKey = apiInput.value.trim();
      saveState();
    });

    const includeKey = settingsPane.querySelector('#tst-include-key');
    includeKey.addEventListener('change', () => {
      state.exportSettings.includeApiKey = includeKey.checked;
      saveState();
    });

    settingsPane.querySelector('#tst-export').addEventListener('click', onExport);
    settingsPane.querySelector('#tst-import').addEventListener('click', onImport);
  }

  function renderActiveTab() {
    const active = tabEls.find(t => t.classList.contains('active'))?.dataset.tab || 'fetch';
    if (active === 'fetch') renderFetchPane();
    if (active === 'energy') renderEnergyOrXanaxTable(energyPane, 'gymenergy', 'Energy spent');
    if (active === 'xanax') renderEnergyOrXanaxTable(xanaxPane, 'xantaken', 'Xanax taken');
    if (active === 'settings') renderSettingsPane();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  /********************************************************************
   * Fetch workflow
   ********************************************************************/
  function setFetchStatus(text) {
    fetchStatusText = text;
    // re-render fetch pane if visible
    const active = tabEls.find(t => t.classList.contains('active'))?.dataset.tab;
    if (active === 'fetch') renderFetchPane();
  }

  async function onFetchClicked() {
    if (isFetching) return;

    const apiKey = (state.apiKey || '').trim();
    if (!apiKey) {
      setFetchStatus('No API key set. Go to Settings and paste your Torn API key.');
      showTab('settings');
      return;
    }

    isFetching = true;
    fetchProgress = { done: 0, total: 0, currentId: null };
    setFetchStatus('Starting fetch…');
    renderActiveTab();

    try {
      const tsMs = Date.now();

      // 1) Get gymenergy contributors (roster + totals)
      setFetchStatus('Fetching faction gym energy contributors…');
      const contributors = await fetchFactionGymEnergy(apiKey);

      // Keep only in_faction true (should already be)
      const current = contributors.filter(c => c && c.in_faction);

      const ids = current.map(c => String(c.id));
      const usernamesById = {};
      const gymById = {};
      current.forEach(c => {
        usernamesById[String(c.id)] = c.username;
        gymById[String(c.id)] = Number(c.value);
      });

      // 2) For each member, fetch xantaken (throttle ~54/min)
      fetchProgress.total = ids.length;
      fetchProgress.done = 0;

      const xansById = {};

      // ~1100ms per call => ~54/min; + one contributors call keeps us comfortably <60/min
      const delayMs = 1100;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        fetchProgress.currentId = id;
        fetchProgress.done = i;

        setFetchStatus(`Fetching xantaken ${i + 1}/${ids.length} (ID ${id})…`);

        try {
          const x = await fetchUserXanTaken(id, apiKey);
          xansById[id] = x;
        } catch (e) {
          xansById[id] = null; // store null; show as —
        }

        // Be nice to the API
        await sleep(delayMs);
      }

      // 3) Record snapshot for each current member
      ids.forEach((id) => {
        const username = usernamesById[id] || `#${id}`;
        recordSnapshot(
          id,
          username,
          gymById[id] ?? null,
          xansById[id] ?? null,
          tsMs
        );
      });

      // 4) Update roster + last updated
      state.roster.lastFetchMemberIds = ids;
      state.roster.lastFetchUsernamesById = usernamesById;
      state.lastUpdatedMs = tsMs;
      saveState();

      fetchProgress.done = ids.length;
      setFetchStatus(`Done. Saved snapshot for ${ids.length} members at ${formatTime(tsMs)}.`);
    } catch (e) {
      setFetchStatus(`Fetch failed: ${e?.message || String(e)}`);
    } finally {
      isFetching = false;
      fetchProgress.currentId = null;
      renderActiveTab();
    }
  }

  /********************************************************************
   * Export / Import
   ********************************************************************/
  function onExport() {
    const exportObj = JSON.parse(JSON.stringify(state));
    if (!state.exportSettings.includeApiKey) {
      exportObj.apiKey = '';
    }

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const a = document.createElement('a');
    a.href = url;
    a.download = `torn-faction-spy-export-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function onImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.style.display = 'none';

    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const next = migrateState(parsed);

        // Preserve current UI positions if missing
        if (!next.ui) next.ui = { ...state.ui };

        state = next;
        saveState();
        applyPositions();
        ensureUiOnScreen();
        setFetchStatus('Import complete. Data loaded from file.');
        renderActiveTab();
      } catch (e) {
        setFetchStatus(`Import failed: ${e?.message || String(e)}`);
        renderActiveTab();
      } finally {
        input.remove();
      }
    });

    document.body.appendChild(input);
    input.click();
  }

  /********************************************************************
   * Initial render
   ********************************************************************/
  renderActiveTab();
})();