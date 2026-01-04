// ==UserScript==
// @name         JFK – Torn Payouts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Fetches War/OC reports from JFK backend, lists payouts, pays via Torn, tracks paid rows, auto/manual mark-paid. Auto-detects faction ID. Auto light/dark to match Torn.
// @match        https://www.torn.com/factions.php*
// @author       HuzGPT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      api.justferkillin.com
// @connect      api.torn.com
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/547859/JFK%20%E2%80%93%20Torn%20Payouts.user.js
// @updateURL https://update.greasyfork.org/scripts/547859/JFK%20%E2%80%93%20Torn%20Payouts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ========================
     *  Config
     *  ======================== */
    const API_BASE = 'https://api.justferkillin.com/api';
    const GM_API_KEY = 'JFK_TORN_API_KEY';
    const GM_FACTION_ID = 'JFK_FACTION_ID';
    const PREFS_KEY = 'JFK_PAYOUTS_PREFS_V1';
    const KEY_PAID_PREFIX = 'JFK_PAYOUTS_PAID_';
    const PAGE_SIZE = 10;

    /** ========================
     *  State
     *  ======================== */
    let state = {
        mode: 'war',
        pageWar: 1,
        pageOC: 1,
        listWar: [],
        listOC: [],
        selectedReportId: null,
        currentReport: null,
        paidSet: new Set(),
        factionId: GM_getValue(GM_FACTION_ID) || null,
    };

    /** ========================
     *  Utils
     *  ======================== */
    /**
     * Gets the API key from localStorage ONLY (forced sync with website login).
     * NOTE: The backend stores only ONE api_key per user. This function ONLY uses
     * localStorage to ensure the script uses the exact same key as the website,
     * preventing key conflicts between script and website.
     */
    function ensureApiKey() {
        // ONLY use localStorage - this is the source of truth synced with website login
        let key = null;
        try {
            key = localStorage.getItem('tornApiKey');
        } catch (e) {
            console.warn('[Payouts] localStorage not accessible:', e);
        }

        // If no key in localStorage, prompt user (one-time setup)
        if (!key) {
            key = prompt('Enter your Torn API key (must match website login):');
            if (key) {
                try {
                    localStorage.setItem('tornApiKey', key);
                    // Also save to GM for backwards compat, but we won't read from it
                    GM_setValue(GM_API_KEY, key);
                } catch (e) {
                    console.error('[Payouts] Failed to save API key:', e);
                }
            }
        }
        return key;
    }

    function setFactionId(fid) {
        state.factionId = Number(fid) || null;
        if (state.factionId) GM_setValue(GM_FACTION_ID, state.factionId);
    }

    function fmtMoneyCompact(n) {
        n = Number(n) || 0;
        const abs = Math.abs(n);
        if (abs >= 1e12) return (n / 1e12).toFixed(n % 1e12 ? 1 : 0).replace(/\.0$/, '') + 'T';
        if (abs >= 1e9) return (n / 1e9).toFixed(n % 1e9 ? 1 : 0).replace(/\.0$/, '') + 'B';
        if (abs >= 1e6) return (n / 1e6).toFixed(n % 1e6 ? 1 : 0).replace(/\.0$/, '') + 'M';
        if (abs >= 1e3) return (n / 1e3).toFixed(n % 1e3 ? 1 : 0).replace(/\.0$/, '') + 'K';
        return String(n);
    }

    function fmtMoney(x) {
        return (Number(x) || 0).toLocaleString('en-GB');
    }

    function fmtDate(ts) {
        if (!ts) return '';
        const d = new Date(Number(ts) * 1000);
        if (isNaN(d)) return '';
        return d.toISOString().slice(0, 10);
    }

    function isDark() {
        const bg = window.getComputedStyle(document.body).backgroundColor;
        const m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return false;
        const [r, g, b] = m.slice(1).map(Number).map(v => v / 255);
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return lum < 0.5;
    }

    function getRFC() {
        const m = document.cookie.match(/(?:^|;\s*)(?:rfc_v|rfc_id)=([^;]+)/);
        return m ? m[1] : null;
    }

    function paidStoreKey(id) {
        return `${KEY_PAID_PREFIX}${id}`;
    }

    function loadPaidSet(id) {
        try {
            const a = JSON.parse(localStorage.getItem(paidStoreKey(id)) || '[]');
            state.paidSet = new Set(Array.isArray(a) ? a : []);
        } catch {
            state.paidSet = new Set();
        }
    }

    function savePaidSet(id) {
        localStorage.setItem(paidStoreKey(id), JSON.stringify([...state.paidSet]));
    }

    function loadPrefs() {
        try {
            const p = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
            if (p.mode) state.mode = p.mode;
            if (p.selectedReportId) state.selectedReportId = p.selectedReportId;
        } catch { /* noop */ }
    }

    function savePrefs() {
        localStorage.setItem(PREFS_KEY, JSON.stringify({
            mode: state.mode,
            selectedReportId: state.selectedReportId
        }));
    }

    /** ========================
     *  Networking via GM_xmlhttpRequest
     *  ======================== */
    function gmFetch(method, path, query = {}, body = null) {
        const base = API_BASE.replace(/\/+$/, '');
        const url = new URL(base + path);
        Object.entries(query || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
        });
        const Authorization = ensureApiKey() || '';

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url: url.toString(),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Authorization,
                },
                data: body ? JSON.stringify(body) : undefined,
                timeout: 30000,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try { resolve(JSON.parse(resp.responseText)); }
                        catch { resolve(resp.responseText); }
                    } else {
                        reject(new Error(resp.responseText || `HTTP ${resp.status}`));
                    }
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Request timed out')),
            });
        });
    }

    // Torn API (to detect faction_id)
    function gmFetchTornUserProfile() {
        const key = ensureApiKey();
        const url = `https://api.torn.com/user/?selections=profile&key=${encodeURIComponent(key)}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                timeout: 15000,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try { resolve(JSON.parse(resp.responseText)); }
                        catch { reject(new Error('Failed to parse Torn profile')); }
                    } else {
                        reject(new Error(`Torn API HTTP ${resp.status}`));
                    }
                },
                onerror: () => reject(new Error('Torn API network error')),
                ontimeout: () => reject(new Error('Torn API timed out')),
            });
        });
    }

    async function detectAndSetFactionId(forcePromptIfFail = false) {
        if (state.factionId) return state.factionId;
        try {
            const prof = await gmFetchTornUserProfile();
            const fid = prof?.faction?.faction_id || prof?.faction?.factionId || prof?.faction_id || null;
            if (fid) {
                setFactionId(fid);
                return state.factionId;
            }
            throw new Error('No faction in profile');
        } catch (e) {
            console.warn('Faction auto-detect failed:', e.message);
            if (forcePromptIfFail) {
                const entered = prompt('Enter your Owner Faction ID (needed to list War reports):', state.factionId || '');
                if (entered) { setFactionId(entered); return state.factionId; }
            }
            throw e;
        }
    }

    /** ========================
     *  Backend wrappers
     *  ======================== */
    async function apiGET(path, params = {}) { return gmFetch('GET', path, params, null); }
    async function apiPOST(path, body) { return gmFetch('POST', path, null, body); }
    async function apiGETWarReport(id) {
        const body = await gmFetch('GET', `/war-reports/${encodeURIComponent(id)}`, null, null);
        return body.report || body;
    }
    async function apiGETOCReport(id) {
        return gmFetch('GET', `/oc-reports/${encodeURIComponent(id)}`, null, null);
    }
    async function apiPATCHMarkPaid(reportId) {
        return gmFetch('PATCH', `/war-reports/${encodeURIComponent(reportId)}/mark-paid`, null, {});
    }

    /** ========================
     *  Styles (dark+light tokens; surfaces)
     *  ======================== */
    const style = document.createElement('style');
    style.textContent = `
  /* Base container */
  #jfk-payments-panel{
    display:none; max-height:560px; overflow:auto; border:1px solid var(--line);
    border-radius:14px; box-shadow:var(--shadow); padding:12px 12px 8px; margin:14px 0 18px;
    background:var(--bg); color:var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji";
    scrollbar-width: thin; scrollbar-color:var(--scrollbar) transparent;
  }
  #jfk-payments-panel::-webkit-scrollbar{ width:10px; height:10px; }
  #jfk-payments-panel::-webkit-scrollbar-track{ background:transparent; }
  #jfk-payments-panel::-webkit-scrollbar-thumb{
    background:var(--scrollbar); border-radius:9999px; border:2px solid transparent; background-clip:padding-box;
  }
  
  /* DARK THEME TOKENS */
  #jfk-payments-panel.tm-dark{
    --bg:#0f1115; --surface:#141821; --text:#ffffff; --muted:#cbd5e1; --line:#1e2230;
    --ring:rgba(90,164,255,.35); --shadow:0 12px 36px rgba(0,0,0,.45);
    --btn-bg:#232838; --btn-text:#ffffff; --btn-hover:#2b3346;
    --ghost-border:#2a2f3a; --danger-bg:#ef5350; --danger-hover:#ff6b6b;
    --seg-bg:#171a23; --seg-active:#ffffff; --seg-text:#ffffff;
    --scrollbar:#2b3342;
  }
  
  /* LIGHT THEME TOKENS */
  #jfk-payments-panel.tm-light{
    --bg:#ffffff; --surface:#ffffff; --text:#111827; --muted:#6b7280; --line:#e5e7eb;
    --ring:rgba(51,154,240,.35); --shadow:0 10px 28px rgba(16,24,40,.08);
    --btn-bg:#0f172a; --btn-text:#ffffff; --btn-hover:#111827;
    --ghost-border:#d1d5db; --danger-bg:#b42318; --danger-hover:#a3160f;
    --seg-bg:#f3f4f6; --seg-active:#0f172a; --seg-text:#0f172a;
    --scrollbar:#d1d5db;
  }
  
  /* Header layout */
  #jfk-payments-panel header{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; flex-wrap:wrap; }
  #jfk-payments-panel .left-controls, #jfk-payments-panel .right-controls{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  
  /* Segmented control */
  #jfk-payments-panel .seg{ display:inline-flex; align-items:center; gap:2px; background:var(--seg-bg); border:1px solid var(--line); border-radius:9999px; padding:2px; height:34px; }
  #jfk-payments-panel .seg button{
    appearance:none; border:0; background:transparent; color:var(--seg-text);
    padding:6px 10px; border-radius:9999px; font-weight:700; cursor:pointer; line-height:1; font-size:13px;
    transition: background 120ms ease, color 120ms ease, transform 60ms ease;
  }
  #jfk-payments-panel .seg button:hover{ background:rgba(0,0,0,.06); }
  #jfk-payments-panel.tm-dark .seg button:hover{ background:rgba(255,255,255,.06); }
  #jfk-payments-panel .seg button.active{ background:var(--seg-active); color:var(--bg); }
  
  /* Select + small button */
  #jfk-payments-panel select, #jfk-payments-panel button.small{
    appearance:none; border:1px solid var(--line); background:var(--surface); color:var(--text);
    padding:7px 10px; border-radius:12px; font-weight:600; cursor:pointer; height:34px; line-height:18px; font-size:13px;
    transition: box-shadow 120ms ease, border-color 120ms ease, background 120ms ease;
  }
  #jfk-payments-panel select:focus, #jfk-payments-panel button.small:focus{ outline:none; box-shadow:0 0 0 3px var(--ring); }
  #jfk-payments-panel select{ max-width:380px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  
  /* Buttons */
  #jfk-payments-panel .btn{
    appearance:none; border:1px solid transparent; border-radius:14px; padding:7px 12px; height:34px;
    background:var(--btn-bg); color:var(--btn-text); cursor:pointer; font-weight:800; font-size:13px; letter-spacing:.01em;
    transition: transform 40ms ease, filter 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  #jfk-payments-panel .btn:hover{ background:var(--btn-hover); }
  #jfk-payments-panel .btn:active{ transform:translateY(1px); }
  #jfk-payments-panel .btn.ghost{ background:var(--surface); color:var(--text); border:1px solid var(--ghost-border); }
  #jfk-payments-panel .btn.danger{ background:var(--danger-bg); color:#fff; }
  #jfk-payments-panel .btn:disabled{ opacity:.55; cursor:default; }
  
  /* Table */
  #jfk-payments-table{ width:100%; border-collapse:collapse; table-layout:fixed; margin-top:4px; }
  #jfk-payments-table col.col-name{ width:40%; }
  #jfk-payments-table col.col-cut{ width:30%; }
  #jfk-payments-table col.col-act{ width:30%; }
  
  #jfk-payments-table th, #jfk-payments-table td{
    padding:10px 6px; border-bottom:1px solid var(--line); word-break:break-word; font-size:14px; vertical-align:middle;
  }
  #jfk-payments-table th{ text-align:left; font-weight:700; color:var(--text); }
  #jfk-payments-table td{ color:var(--text); }
  #jfk-payments-table th:nth-child(2), #jfk-payments-table td:nth-child(2){ text-align:right; }
  #jfk-payments-table th:nth-child(3), #jfk-payments-table td:nth-child(3){ text-align:right; }
  
  /* Row pay button */
  .pay-btn{
    appearance:none; border:1px solid var(--line); background:var(--surface); color:var(--text);
    border-radius:10px; padding:5px 10px; font-weight:700; font-size:13px; cursor:pointer;
    transition: background 120ms ease, border-color 120ms ease, transform 40ms ease;
  }
  #jfk-payments-panel.tm-dark .pay-btn:hover{ background:#1b2030; }
  #jfk-payments-panel.tm-light .pay-btn:hover{ filter:brightness(0.96); }
  .pay-btn:active{ transform:translateY(1px); }
  .pay-btn:disabled{ opacity:.55; cursor:default; }
  
  /* Totals footer */
  #jfk-payments-table tfoot td{
    border-bottom:0 !important;
    padding-top:12px; padding-bottom:6px; vertical-align:middle;
  }
  #jfk-payments-table tfoot tr{ border-top:1px solid var(--line); }
  #jfk-total-row td{ font-weight:800; }
  #jfk-total-cut{ font-weight:800; font-size:18px; text-align:right; }
  
  /* Compact header */
  #jfk-payments-panel header{ flex-wrap: nowrap; gap:6px; overflow-x:auto; }
  #jfk-payments-panel .left-controls{ flex:1; min-width:0; }
  #jfk-payments-panel .right-controls{ gap:6px; white-space:nowrap; }
  
  /* Smaller controls */
  #jfk-payments-panel .seg{ height:28px; padding:2px; }
  #jfk-payments-panel .seg button{ padding:4px 8px; font-size:12px; }
  #jfk-payments-panel select, #jfk-payments-panel button.small{ height:28px; padding:5px 8px; font-size:12px; border-radius:10px; }
  #jfk-payments-panel select{ max-width:320px; }
  #jfk-payments-panel .btn{ height:28px; padding:5px 10px; font-size:12px; border-radius:12px; }
  .pay-btn{ padding:4px 8px; font-size:12px; border-radius:8px; }
  #jfk-payments-table th, #jfk-payments-table td{ padding:8px 6px; font-size:13px; }
  #jfk-total-cut{ font-size:16px; }
  
  /* Notes */
  .note{ font-size:12px; color:var(--muted); margin-top:8px; display:block; }
  `;
    document.head.appendChild(style);

    /** ========================
     *  UI
     *  ======================== */
    function applyTheme(panel) {
        if (!panel) return;
        const dark = isDark();
        panel.classList.toggle('tm-dark', dark);
        panel.classList.toggle('tm-light', !dark);
    }

    function insertTopButton() {
        const wrap = document.querySelector('.links-top-wrap');
        if (!wrap) return null;
        const btn = document.createElement('a');
        btn.id = 'jfk-payouts-toggle';
        btn.className = 'custom-calc t-clear h c-pointer m-icon line-h24 right';
        btn.href = '#';
        btn.innerHTML = `<span>PAYOUTS</span>`;
        wrap.appendChild(btn);
        return btn;
    }

    function buildPanel() {
        const header = document.querySelector('.content-title.m-bottom10');
        if (!header) return null;
        let panel = document.getElementById('jfk-payments-panel');
        if (panel) return panel;

        panel = document.createElement('div');
        panel.id = 'jfk-payments-panel';
        panel.innerHTML = `
  <header>
    <div class="left-controls">
      <div class="seg" id="jfk-seg">
        <button data-mode="war" class="active">War</button>
        <button data-mode="oc">OC</button>
      </div>
      <select id="jfk-report-select" title="Select a report…"><option value="">Select a report…</option></select>
      <button class="small" id="jfk-load-more" title="Load more">+10</button>
      <span class="note" id="jfk-report-meta"></span>
    </div>
    <div class="right-controls" >
      <button class="btn ghost" id="jfk-set-apikey">API Key</button>
      <button class="btn ghost" id="jfk-set-faction">Faction</button>
      <button class="btn ghost" id="jfk-oc-mark-paid">Mark Report Paid</button>
      <button class="btn ghost" id="jfk-mark-paid">Mark Paid</button>
      <button class="btn danger" id="jfk-clear-paid">Clear Paid</button>
    </div>
  </header>
  
  <table id="jfk-payments-table" style="display:none">
    <colgroup>
      <col class="col-name" />
      <col class="col-cut" />
      <col class="col-act" />
    </colgroup>
    <thead>
      <tr><th>Member</th><th>Cut</th><th>Action</th></tr>
    </thead>
    <tbody id="jfk-rows"></tbody>
    <tfoot>
      <tr id="jfk-total-row">
        <td>Total</td>
        <td id="jfk-total-cut">0</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
  `;
        header.parentNode.insertBefore(panel, header.nextElementSibling);

        applyTheme(panel);
        new MutationObserver(() => applyTheme(panel))
            .observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });

        // Toggle War/OC
        const seg = panel.querySelector('#jfk-seg');
        seg.addEventListener('click', (e) => {
            const b = e.target.closest('button[data-mode]');
            if (!b) return;
            seg.querySelectorAll('button').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            state.mode = b.dataset.mode;
            state.selectedReportId = null;
            savePrefs();
            refreshReportList(true);
        });

        // Controls
        panel.querySelector('#jfk-load-more').addEventListener('click', () => loadMoreReports());
        panel.querySelector('#jfk-report-select').addEventListener('change', async (e) => {
            const id = e.target.value || null;
            state.selectedReportId = id;
            savePrefs();
            if (id) await loadAndRenderReport(id); else renderRows(null);
        });
        panel.querySelector('#jfk-set-apikey').addEventListener('click', async () => {
            // Get current key from localStorage ONLY
            let cur = '';
            try {
                cur = localStorage.getItem('tornApiKey') || '';
            } catch (e) {
                console.warn('[Payouts] localStorage not accessible:', e);
            }
            const v = prompt('Enter your Torn API key (must match website login):', cur);
            if (v) {
                try {
                    // Save to localStorage (source of truth)
                    localStorage.setItem('tornApiKey', v);
                    // Also save to GM for backwards compat, but we won't read from it
                    GM_setValue(GM_API_KEY, v);
                    alert('Saved. This key must match your website login.');
                } catch (e) {
                    console.error('[Payouts] Failed to save API key:', e);
                    alert('Failed to save API key.');
                }
            }
            try { await detectAndSetFactionId(true); } catch { /* ignore */ }
        });
        panel.querySelector('#jfk-set-faction').addEventListener('click', async () => {
            const cur = state.factionId || '';
            const v = prompt('Owner Faction ID:', cur);
            if (v) {
                setFactionId(v);
                alert(`Faction set to ${state.factionId}`);
                if (state.mode === 'war') await refreshReportList(true);
            }
        });
        panel.querySelector('#jfk-clear-paid').addEventListener('click', () => {
            if (!state.selectedReportId) return;
            if (!confirm('Clear paid statuses for this report?')) return;
            state.paidSet.clear();
            savePaidSet(state.selectedReportId);
            renderRows(state.currentReport);
        });
        panel.querySelector('#jfk-mark-paid').addEventListener('click', async () => {
            if (state.mode !== 'war' || !state.selectedReportId) return;
            if (!confirm('Mark this war as PAID?')) return;
            try {
                await apiPATCHMarkPaid(state.selectedReportId);
                alert('War marked as PAID.');
            } catch (e) {
                alert(`Failed to mark paid: ${e.message}`);
            }
        });

        // NEW: Mark OC report paid (idempotent)
        panel.querySelector('#jfk-oc-mark-paid').addEventListener('click', async () => {
            if (state.mode !== 'oc' || !state.selectedReportId) return;
            if (!state.factionId) { alert('Set your Owner Faction first.'); return; }
            if (!confirm('Mark ALL OCs in this report as paid? This is idempotent.')) return;

            try {
                await apiPOST(`/oc-reports/${encodeURIComponent(state.selectedReportId)}/mark-paid`, {
                    owner_faction_id: Number(state.factionId),
                    marked_by_user_id: null,
                });
                alert('OC Report marked as PAID.');
            } catch (e) {
                alert(`Failed to mark report paid: ${e.message}`);
            }
        });

        return panel;
    }

    /** ========================
     *  Lists
     *  ======================== */
    function summarizeWarItem(it) {
        const s = it.summary || {};
        const start = fmtDate(s.start);
        const vsName = s.enemy_name || 'Opponent';
        const pool = fmtMoneyCompact(s?.totals?.pool_total || 0);
        const label = `${vsName} • ${start} • ${pool}`;
        return {
            text: label,
            title: `${s.owner_name || 'Our faction'} vs ${s.enemy_name || 'Opponent'} • Start: ${start} • Pool: ${fmtMoney(s?.totals?.pool_total || 0)}`
        };
    }

    function summarizeOCItem(it) {
        const s = it.summary || {};
        const p = it.params || {};
        const from = fmtDate(p.from_ts);
        const to = fmtDate(p.to_ts);
        const pay = fmtMoneyCompact(s?.members_cut_final || 0);
        const label = `${from} → ${to} • ${pay}`;
        return {
            text: label,
            title: `${it.title || 'OC Payouts'} • ${from} → ${to} • Members payout: ${fmtMoney(s?.members_cut_final || 0)}`
        };
    }

    function populateReportSelect(selectEl, items, mode) {
        selectEl.innerHTML = `<option value="">Select a report…</option>`;
        items.forEach(it => {
            const o = document.createElement('option');
            o.value = it._id;
            const summary = mode === 'war' ? summarizeWarItem(it) : summarizeOCItem(it);
            o.textContent = summary.text;
            o.title = summary.title;
            selectEl.appendChild(o);
        });
    }

    async function refreshReportList(reset) {
        const panel = document.getElementById('jfk-payments-panel'); if (!panel) return;
        const sel = panel.querySelector('#jfk-report-select');

        try {
            if (state.mode === 'war') {
                if (!state.factionId) await detectAndSetFactionId(true);
                if (reset) { state.pageWar = 1; state.listWar = []; }
                const body = await apiGET('/war-reports', { ownerId: state.factionId, page: state.pageWar, limit: PAGE_SIZE });
                const items = body.items || [];
                state.listWar = state.listWar.concat(items);
                populateReportSelect(sel, state.listWar, 'war');
            } else {
                if (reset) { state.pageOC = 1; state.listOC = []; }
                const body = await apiGET('/oc-reports', { page: state.pageOC, limit: PAGE_SIZE });
                const items = body.items || [];
                state.listOC = state.listOC.concat(items);
                populateReportSelect(sel, state.listOC, 'oc');
            }

            if (state.selectedReportId) sel.value = state.selectedReportId;
            if (sel.value) await loadAndRenderReport(sel.value);
            else renderRows(null);
        } catch (err) {
            alert(`Failed to load ${state.mode.toUpperCase()} reports: ${err.message}`);
        }
    }

    async function loadMoreReports() {
        if (state.mode === 'war') state.pageWar += 1; else state.pageOC += 1;
        await refreshReportList(false);
    }

    /** ========================
     *  Report & table
     *  ======================== */
    async function loadAndRenderReport(id) {
        try {
            const report = state.mode === 'war' ? await apiGETWarReport(id) : await apiGETOCReport(id);
            state.currentReport = report;
            loadPaidSet(id);
            renderRows(report);
        } catch (err) {
            alert(`Failed to load report: ${err.message}`);
        }
    }

    function participantRowsFromReport(report) {
        if (!report) return [];
        const parts = report.participants || [];
        return parts
            .filter(p => Number(p?.pay) > 0)
            .map(p => ({
                id: Number(p.user_id) || null,
                name: p.name || (p.user_id ? `Member [${p.user_id}]` : 'Unknown'),
                amount: Math.floor(Number(p.pay) || 0),
            }));
    }

    function eligiblePaymentKeys(report) {
        const rows = (report.participants || []).filter(p => Number(p?.pay) > 0 && Number(p?.user_id));
        return rows.map((p, idx) => `${p.user_id}-${Math.floor(Number(p.pay) || 0)}-${idx}`);
    }

    async function markWarPaidIfComplete() {
        if (state.mode !== 'war' || !state.currentReport || !state.selectedReportId) return;
        const keys = eligiblePaymentKeys(state.currentReport);
        if (!keys.length) return;
        const allPaid = keys.every(k => state.paidSet.has(k));
        if (!allPaid) return;
        try { await apiPATCHMarkPaid(state.selectedReportId); }
        catch (e) { console.warn('Auto mark-paid failed:', e); }
    }

    function renderRows(report) {
        const tableEl = document.getElementById('jfk-payments-table');
        const tbody = document.getElementById('jfk-rows');
        const totalEl = document.getElementById('jfk-total-cut');
        if (!tbody || !totalEl || !tableEl) return;

        // Hide when no report is selected
        if (!report) {
            tableEl.style.display = 'none';
            tbody.innerHTML = '';
            totalEl.textContent = '0';
            return;
        }

        // Show when a report is selected
        tableEl.style.display = 'table';

        tbody.innerHTML = '';
        let total = 0;

        const rows = participantRowsFromReport(report);
        rows.forEach((r, idx) => {
            total += r.amount;
            const tr = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = r.id ? `${r.name} [${r.id}]` : r.name;
            tr.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = fmtMoney(r.amount);
            tr.appendChild(td2);

            const td3 = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'pay-btn';

            const key = `${r.id || 'noid'}-${r.amount}-${idx}`;
            if (!r.id) {
                btn.textContent = 'No ID';
                btn.disabled = true;
                btn.title = 'Cannot pay without a user ID';
            } else if (state.paidSet.has(key)) {
                btn.textContent = 'Paid';
                btn.disabled = true;
            } else {
                btn.textContent = 'Pay';
                btn.addEventListener('click', () => doPay(r, key, btn));
            }
            td3.appendChild(btn);
            tr.appendChild(td3);

            tbody.appendChild(tr);
        });

        totalEl.textContent = fmtMoney(total);
        if (state.mode === 'war') markWarPaidIfComplete();
    }

    /** ========================
     *  Payment (Torn)
     *  ======================== */
    function doPay(item, key, btn) {
        const token = getRFC();
        if (!token) { alert('No RFC token found; refresh the page.'); return; }
        btn.disabled = true; btn.textContent = 'Paying…';

        fetch(`https://www.torn.com/page.php?sid=factionsGiveMoney&rfcv=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ option: 'addToBalance', receiver: Number(item.id), amount: Number(item.amount) })
        })
            .then(r => r.json())
            .then(async data => {
                if (data?.error) {
                    alert(`Error paying ${item.name}: ${data.error}`);
                    btn.disabled = false; btn.textContent = 'Retry';
                } else {
                    state.paidSet.add(key);
                    if (state.selectedReportId) savePaidSet(state.selectedReportId);
                    btn.textContent = 'Paid'; btn.disabled = true;
                    await markWarPaidIfComplete();
                }
            })
            .catch(() => {
                alert(`Network error paying ${item.name}`);
                btn.disabled = false; btn.textContent = 'Retry';
            });
    }

    /** ========================
     *  Boot
     *  ======================== */
    function applyThemeNow(panel) {
        applyTheme(panel);
        new MutationObserver(() => applyTheme(panel)).observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    }

    function init() {
        if (!/\/factions\.php/.test(location.pathname)) return;
        loadPrefs();
        const topBtn = insertTopButton();
        const panel = buildPanel();
        if (!topBtn || !panel) return;
        applyThemeNow(panel);

        topBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            if (panel.style.display === 'block') {
                panel.querySelectorAll('#jfk-seg button').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
                try { if (state.mode === 'war' && !state.factionId) await detectAndSetFactionId(true); } catch { /* ignore */ }
                await refreshReportList(true);
            }
        });
    }

    window.addEventListener('load', init);
})();
