// ==UserScript==
// @name         Live RW Hits And Xanax Used
// @namespace    https://torn.com/
// @version      2.3.1
// @description  Floating live panel: Ranked War hits vs armory Xanax withdrawals, with API key input stored locally. 
// @author       Dozzi
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/559793/Live%20RW%20Hits%20And%20Xanax%20Used.user.js
// @updateURL https://update.greasyfork.org/scripts/559793/Live%20RW%20Hits%20And%20Xanax%20Used.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========= USER SETTINGS =========
  const REFRESH_MS = 45_000;     // refresh every 45s
  const SUS_THRESHOLD = 1;       // flag SUS if XanaxWithdrawn >= this AND hits === 0
  const MAX_ROWS = 60;           // safety for huge factions
  const STORAGE_KEY = 'dozzi_torn_api_key_v2';
  const STORAGE_KEY_WINDOW_HRS = 'dozzi_rw_window_hours_v1';
  // =================================

  const state = {
    fromTs: null,
    toTs: null,
    members: {},
    hitsByUser: new Map(),
    xansByUser: new Map(),
    lastUpdated: null,
    minimized: false,
    apiKey: loadApiKey(),
    windowHours: loadWindowHours()
  };

  function nowUnix() { return Math.floor(Date.now() / 1000); }

  function loadWindowHours() {
    try {
      const v = Number(localStorage.getItem(STORAGE_KEY_WINDOW_HRS));
      return Number.isFinite(v) && v > 0 ? v : 24;
    } catch {
      return 24;
    }
  }

  function saveWindowHours(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return;
    state.windowHours = n;
    try { localStorage.setItem(STORAGE_KEY_WINDOW_HRS, String(n)); } catch { /* ignore */ }
  }

  function computeWindow() {
    const toTs = nowUnix();
    const fromTs = Math.max(0, toTs - Math.floor(state.windowHours) * 3600);
    state.fromTs = fromTs;
    state.toTs = toTs;
  }

  function loadApiKey() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; }
    catch { return ''; }
  }

  function saveApiKey(key) {
    try { localStorage.setItem(STORAGE_KEY, key); }
    catch { /* ignore */ }
    state.apiKey = key;
  }

  function clearApiKey() {
    try { localStorage.removeItem(STORAGE_KEY); }
    catch { /* ignore */ }
    state.apiKey = '';
  }

  function apiGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (r) => {
          try {
            const data = JSON.parse(r.responseText);
            if (data && data.error) reject(data.error);
            else resolve(data);
          } catch (e) { reject(e); }
        },
        onerror: reject,
        ontimeout: reject
      });
    });
  }

  // ---- UI ----
  function ensurePanel() {
    let panel = document.getElementById('dozzi-rw-panel');
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = 'dozzi-rw-panel';
    panel.style.position = 'fixed';
    panel.style.top = '120px';
    panel.style.right = '20px';
    panel.style.width = '460px';
    panel.style.zIndex = '999999';
    panel.style.background = '#0b0f14';
    panel.style.border = '1px solid #2a3a4a';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.45)';
    panel.style.color = '#d7e2ee';
    panel.style.font = '12px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial';
    panel.style.userSelect = 'none';

    panel.innerHTML = `
      <div id="dozzi-rw-header" style="cursor:move; padding:10px 10px 8px; border-bottom:1px solid #1f2a35; display:flex; gap:10px; align-items:center; justify-content:space-between;">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div style="font-weight:800; font-size:13px;">⚔️ Live RW Hits And Xanax Used</div>
          <div id="dozzi-rw-sub" style="opacity:.85; font-size:11px;">Booting up…</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button id="dozzi-rw-refresh" style="padding:4px 8px; border-radius:8px; border:1px solid #2a3a4a; background:#0f1620; color:#d7e2ee; cursor:pointer;">Refresh</button>
          <button id="dozzi-rw-min" style="padding:4px 8px; border-radius:8px; border:1px solid #2a3a4a; background:#0f1620; color:#d7e2ee; cursor:pointer;">Min</button>
        </div>
      </div>

      <div id="dozzi-rw-body" style="padding:10px;">
        <div style="border:1px solid #1f2a35; border-radius:10px; background:#0f1620; padding:8px; margin-bottom:10px;">
          <div style="opacity:.8; font-size:11px; margin-bottom:6px;">API key (stored locally in your browser)</div>
          <div style="display:flex; gap:6px; align-items:center; margin-bottom:8px;">
            <input id="dozzi-api-input" type="password" placeholder="Paste your Torn API key here"
              style="flex:1; padding:6px 8px; border-radius:8px; border:1px solid #2a3a4a; background:#0b0f14; color:#d7e2ee; outline:none;" />
            <button id="dozzi-api-save" style="padding:6px 10px; border-radius:8px; border:1px solid #2a3a4a; background:#0b0f14; color:#d7e2ee; cursor:pointer;">Save</button>
            <button id="dozzi-api-clear" style="padding:6px 10px; border-radius:8px; border:1px solid #2a3a4a; background:#0b0f14; color:#ffb4b4; cursor:pointer;">Clear</button>
          </div>

          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <div style="opacity:.8; font-size:11px;">Window (hours):</div>
            <input id="dozzi-window-hours" type="number" min="1" step="1"
              style="width:90px; padding:6px 8px; border-radius:8px; border:1px solid #2a3a4a; background:#0b0f14; color:#d7e2ee; outline:none;" />
            <button id="dozzi-window-save" style="padding:6px 10px; border-radius:8px; border:1px solid #2a3a4a; background:#0b0f14; color:#d7e2ee; cursor:pointer;">Apply</button>
            <div id="dozzi-api-hint" style="opacity:.75; font-size:11px;">
              Tip: Make an API key with <b>Faction</b> access.
            </div>
          </div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
          <div style="flex:1; min-width:160px; padding:8px; border:1px solid #1f2a35; border-radius:10px; background:#0f1620;">
            <div style="opacity:.75; font-size:11px;">Window</div>
            <div id="dozzi-rw-window" style="font-weight:800; margin-top:2px;">—</div>
          </div>
          <div style="flex:1; min-width:140px; padding:8px; border:1px solid #1f2a35; border-radius:10px; background:#0f1620;">
            <div style="opacity:.75; font-size:11px;">Last update</div>
            <div id="dozzi-rw-updated" style="font-weight:800; margin-top:2px;">—</div>
          </div>
        </div>

        <div id="dozzi-rw-tablewrap" style="max-height:420px; overflow:auto; border:1px solid #1f2a35; border-radius:10px;">
          <table style="width:100%; border-collapse:collapse;">
            <thead style="position:sticky; top:0; background:#0f1620;">
              <tr>
                <th style="text-align:left; padding:8px; border-bottom:1px solid #1f2a35;">Member</th>
                <th style="text-align:right; padding:8px; border-bottom:1px solid #1f2a35;">Hits</th>
                <th style="text-align:right; padding:8px; border-bottom:1px solid #1f2a35;">Xans</th>
                <th style="text-align:right; padding:8px; border-bottom:1px solid #1f2a35;">X/H</th>
                <th style="text-align:left; padding:8px; border-bottom:1px solid #1f2a35;">Flag</th>
              </tr>
            </thead>
            <tbody id="dozzi-rw-tbody">
              <tr><td colspan="5" style="padding:10px; opacity:.8;">Enter API key above, then Save.</td></tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top:8px; opacity:.7; font-size:11px;">
          “Xans” = <b>armory withdrawals</b> in the last <b>X hours</b>. Pulling Xans with zero hits = <b>SUS</b>.
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    makeDraggable(panel, panel.querySelector('#dozzi-rw-header'));

    panel.querySelector('#dozzi-rw-refresh').addEventListener('click', () => refreshAll(true));
    panel.querySelector('#dozzi-rw-min').addEventListener('click', toggleMinimize);

    const apiInput = panel.querySelector('#dozzi-api-input');
    apiInput.value = state.apiKey ? state.apiKey : '';

    panel.querySelector('#dozzi-api-save').addEventListener('click', () => {
      const k = (apiInput.value || '').trim();
      saveApiKey(k);
      setStatus(k ? 'API key saved locally. Updating…' : 'API key cleared.');
      refreshAll(true);
    });

    panel.querySelector('#dozzi-api-clear').addEventListener('click', () => {
      apiInput.value = '';
      clearApiKey();
      setStatus('API key cleared. Paste it again to run.');
      render();
    });

    apiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') panel.querySelector('#dozzi-api-save').click();
    });

    const wh = panel.querySelector('#dozzi-window-hours');
    wh.value = String(state.windowHours);

    panel.querySelector('#dozzi-window-save').addEventListener('click', () => {
      const v = Number(wh.value);
      if (!Number.isFinite(v) || v < 1) {
        setStatus('Window hours must be 1 or higher.');
        return;
      }
      saveWindowHours(Math.floor(v));
      setStatus(`Window set to last ${state.windowHours}h. Updating…`);
      refreshAll(true);
    });

    return panel;
  }

  function toggleMinimize() {
    const panel = ensurePanel();
    state.minimized = !state.minimized;
    const body = panel.querySelector('#dozzi-rw-body');
    body.style.display = state.minimized ? 'none' : 'block';
    panel.querySelector('#dozzi-rw-min').textContent = state.minimized ? 'Max' : 'Min';
  }

  function makeDraggable(panel, handle) {
    let isDown = false, startX = 0, startY = 0, startTop = 0, startRight = 0;

    handle.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = panel.getBoundingClientRect();
      startTop = rect.top;
      startRight = window.innerWidth - rect.right;

      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      panel.style.top = Math.max(0, startTop + dy) + 'px';
      panel.style.right = Math.max(0, startRight - dx) + 'px';
    });

    window.addEventListener('mouseup', () => { isDown = false; });
  }

  function setStatus(text) {
    const panel = ensurePanel();
    panel.querySelector('#dozzi-rw-sub').textContent = text;
  }

  function fmtTime(ts) {
    if (!ts) return '—';
    return new Date(ts * 1000).toLocaleString();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[c]));
  }

  function render() {
    const panel = ensurePanel();
    const tbody = panel.querySelector('#dozzi-rw-tbody');

    panel.querySelector('#dozzi-rw-window').textContent =
      state.fromTs ? `${fmtTime(state.fromTs)} → ${fmtTime(state.toTs)} (last ${state.windowHours}h)` : '—';

    panel.querySelector('#dozzi-rw-updated').textContent =
      state.lastUpdated ? new Date(state.lastUpdated).toLocaleTimeString() : '—';

    if (!state.apiKey) {
      tbody.innerHTML = `<tr><td colspan="5" style="padding:10px; opacity:.8;">Paste API key above and hit <b>Save</b>.</td></tr>`;
      return;
    }

    const memberEntries = Object.entries(state.members || {});
    const rows = [];

    for (const [id, m] of memberEntries) {
      const uid = Number(id);
      const hits = state.hitsByUser.get(uid) || 0;
      const xans = state.xansByUser.get(uid) || 0;
      const xph = hits > 0 ? (xans / hits) : (xans > 0 ? Infinity : 0);

      let flag = '—';
      if (hits > 0 && xans > 0) flag = 'WAR USE';
      else if (hits > 0 && xans === 0) flag = 'NO XANS';
      else if (hits === 0 && xans >= SUS_THRESHOLD) flag = 'SUS';

      rows.push({ uid, name: m.name || `#${id}`, hits, xans, xph, flag });
    }

    rows.sort((a, b) => (b.hits - a.hits) || (b.xans - a.xans));
    const sliced = rows.slice(0, MAX_ROWS);

    tbody.innerHTML = sliced.map(r => {
      const flagColor =
        r.flag === 'SUS' ? '#ff6b6b' :
        r.flag === 'WAR USE' ? '#7CFC98' :
        r.flag === 'NO XANS' ? '#ffd166' : '#d7e2ee';

      const xphText = (r.xph === Infinity) ? '∞' : (Math.round(r.xph * 100) / 100).toFixed(2);

      return `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #101820;">${escapeHtml(r.name)}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #101820;">${r.hits}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #101820;">${r.xans}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #101820;">${xphText}</td>
          <td style="padding:8px; border-bottom:1px solid #101820; color:${flagColor}; font-weight:800;">${r.flag}</td>
        </tr>
      `;
    }).join('') || `<tr><td colspan="5" style="padding:10px; opacity:.8;">No member data.</td></tr>`;
  }

  // ---- Data fetch logic (FIXED: NO rankedwars endpoint) ----
  async function getMembers(apiKey) {
    const url = `https://api.torn.com/faction/?selections=members&key=${apiKey}`;
    const data = await apiGet(url);
    return data?.members || {};
  }

  async function getWarHitsByUser(apiKey, fromTs, toTs) {
    const url = `https://api.torn.com/faction/?selections=attacks&from=${fromTs}&to=${toTs}&key=${apiKey}`;
    const data = await apiGet(url);
    const attacks = data?.attacks || {};
    const hits = new Map();

    for (const a of Object.values(attacks)) {
      const attacker = Number(a.attacker_id || 0);
      if (!attacker) continue;

      // Ranked war hit flag (this is the cleanest signal available)
      if (a.ranked_war !== true) continue;

      hits.set(attacker, (hits.get(attacker) || 0) + 1);
    }
    return hits;
  }

  async function getArmoryXansByUser(apiKey, fromTs, toTs) {
    const url = `https://api.torn.com/faction/?selections=armorynews&from=${fromTs}&to=${toTs}&key=${apiKey}`;
    const data = await apiGet(url);
    const logs = data?.armorynews || {};
    const xans = new Map();

    for (const entry of Object.values(logs)) {
      const userId = Number(entry.user_id || 0);
      if (!userId) continue;

      const itemName = (entry.item || '').toString().toLowerCase();
      if (!itemName.includes('xanax')) continue;

      // Only count withdrawals/takes
      const text = (entry.text || entry.message || '').toString().toLowerCase();
      const isWithdraw =
        (entry.action && String(entry.action).toLowerCase().includes('withdraw')) ||
        (entry.type && String(entry.type).toLowerCase().includes('withdraw')) ||
        text.includes('withdrew') || text.includes('withdraw') || text.includes('took') || text.includes('taken');

      if (!isWithdraw) continue;

      const qty = Number(entry.quantity || 1);
      xans.set(userId, (xans.get(userId) || 0) + (Number.isFinite(qty) ? qty : 1));
    }
    return xans;
  }

  async function refreshAll(manual = false) {
    ensurePanel();

    const apiKey = (state.apiKey || '').trim();
    if (!apiKey) {
      setStatus('Paste your API key into the panel and hit Save.');
      render();
      return;
    }

    try {
      setStatus(manual ? 'Refreshing…' : 'Updating…');

      computeWindow();

      state.members = await getMembers(apiKey);
      const [hitsMap, xansMap] = await Promise.all([
        getWarHitsByUser(apiKey, state.fromTs, state.toTs),
        getArmoryXansByUser(apiKey, state.fromTs, state.toTs)
      ]);

      state.hitsByUser = hitsMap || new Map();
      state.xansByUser = xansMap || new Map();
      state.lastUpdated = Date.now();

      setStatus(`Live. Last ${state.windowHours}h. Xans with zero hits = SUS.`);
      render();

    } catch (err) {
      console.error(err);
      state.lastUpdated = Date.now();
      setStatus(`⚠️ API error: ${err?.error || err?.code || err?.toString?.() || 'unknown'} (check key perms)`);
      render();
    }
  }

  // Only run on faction pages
  if (!location.href.includes('factions.php')) return;

  ensurePanel();
  refreshAll(false);
  setInterval(() => refreshAll(false), REFRESH_MS);

})();
