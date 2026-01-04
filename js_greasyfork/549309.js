// ==UserScript==
// @name         Torn — War Mode: Hospital Peek + Persistent Log
// @namespace    https://torn.com/
// @version      Alpha-v2.3.8
// @description  Click a “Hospital” cell on a Faction Page to open a compact popup focused on the Status card; logs targets persistently (name, awards, time left, ETA, link). Optional one-click “Pull Xanax” (no API) from a tiny stats popup. Alt+L opens the panel, Alt+C copy callout.
// @author       Arkhimedes [3491087]
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @supportURL   TBD
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549309/Torn%20%E2%80%94%20War%20Mode%3A%20Hospital%20Peek%20%2B%20Persistent%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/549309/Torn%20%E2%80%94%20War%20Mode%3A%20Hospital%20Peek%20%2B%20Persistent%20Log.meta.js
// ==/UserScript==

(() => {
    'use strict';
    if (window.__TornWarModeV2) return;
    window.__TornWarModeV2 = true;

    // ========= Config =========
    const REQUIRE_MODIFIER   = false;     // set true to require Alt+Click
    const POPUP_NAME         = '_war_hosp_popup';
    const POPUP_W            = 480;
    const POPUP_H            = 280;

    const LOG_KEY            = 'hospwar_log_v2';
    const XANAX_CACHE_KEY    = 'hospwar_xanax_cache_v2';
    const XANAX_TTL_MS       = 6 * 3600 * 1000;
    const AUTOPRUNE_MIN_MS   = 2 * 60 * 1000;
    const PANEL_REFRESH_MS = 5000;        // panel refresh so time is up to date
    const FILTERS_DEFAULT    = 'all';     // 'all'|'lt30'|'lt120'|'lt300'
    const GRACE_TO_CLICK_MS  = 1200;      // time to click "Pull Xanax" before auto-close
    const CLOSE_ON_LEAVE     = true;      // profile popup closes when the mouse leaves after grace
    const CHAT_GAP_PX = -20;              // visual breathing room above chat
    const OUT_BADGE_MS = 8000;            // show "OUT" for 8s, then remove row

    // ========= Utils =========
    const isProfiles   = () => /\/profiles\.php\b/.test(location.pathname);
    const isStatsPage  = () => /\/personalstats\.php\b/.test(location.pathname);
    const now          = () => Date.now();
    const fmt2         = n => String(n).padStart(2,'0');
    const fmtHMS = (sec) => {
        sec = Math.max(0, sec|0);
        const h = Math.floor(sec/3600);
        const m = Math.floor((sec%3600)/60);
        const s = sec%60;
        return h ? `${h}:${fmt2(m)}:${fmt2(s)}` : `${m}:${fmt2(s)}`;
    };
    const etaStr = (ms) => new Intl.DateTimeFormat(undefined, {timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit',}).format(new Date(ms)) + ' TCT';
    const getStore = (k, d) => { try { const v = GM_getValue(k); return v==null?d:v; } catch { return d; } };
    const setStore = (k, v) => { try { GM_setValue(k, v); } catch {} };
    const uniqueId  = () => Math.random().toString(36).slice(2, 10);
    const parseIntLoose = (s) => { if(!s) return null; const m=(s+'').replace(/[, ]+/g,'').match(/-?\d+/); return m?parseInt(m[0],10):null; };
    const collapseWS = s => (s||'').replace(/\s+/g,' ').trim();

    function cleanName(raw) {
        let s = collapseWS(raw || '');
        // strip "'s Profile", "Profile", and "Profile Tutorial" suffixes
        s = s
            .replace(/['’]s\s+Profile(?:\s+Tutorial)?$/i, '')
            .replace(/\bProfile(?:\s+Tutorial)?$/i, '')
            .replace(/\bTutorial$/i, '');
        s = s.replace(/\.cls-\d[\s\S]*?\}/g, '').replace(/\{[^}]*\}/g, '').replace(/[;]+/g,' ');
        return collapseWS(s);
    }

    function isFactionRosterPage() {
        return /\/factions\.php\b/.test(location.pathname);
    }

    function calloutFor(entry) {
        if (!entry) return '';
        const leftSec = Math.max(0, Math.round(entry.seconds - (now() - entry.capturedAt)/1000));
        const awardsTxt = (entry.awards ?? '—');
        const xanaxTxt  = (entry.xanax != null) ? ` — Xanax Taken: ${entry.xanax}` : '';
        const levelTxt = (entry.level != null ? ` — Level ${entry.level}` : '');
        return `Target Name: ${entry.name}${levelTxt} — Out In: ${fmtHMS(leftSec)} — Total Awards ${awardsTxt}${xanaxTxt} — ${entry.url}`;
    }

    // ========= Persistent state & sync =========
    let LOG = getStore(LOG_KEY, []);                 // [{id,xid,name,awards,seconds,capturedAt,url,xanax?,note?}]
    let XANAX_CACHE = getStore(XANAX_CACHE_KEY, {}); // xid -> {value, ts}
    let FILTER = FILTERS_DEFAULT;
    const lastSeenXidTs = new Map();                // transient dedupe window
    let currentActiveEntry = null;                  // last popup-reported entry

    GM_addValueChangeListener(LOG_KEY, (_k, _o, n) => { if (Array.isArray(n)) { LOG = n; rerenderPanel(); } });
    GM_addValueChangeListener(XANAX_CACHE_KEY, (_k, _o, n) => { if (n && typeof n==='object') { XANAX_CACHE = n; rerenderPanel(); } });

    // ========= Panel UI =========
    let panel, tbody, filtersRow, autoPruneToggle;
    function ensurePanel() {
        if (panel) return;
        panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed', right: '10px', bottom: '10px', zIndex: 999999,
            width: '600px', maxHeight: '65vh', overflow: 'auto',
            background: 'rgba(0,0,0,0.88)', color: '#f5f5f5',
            border: '1px solid rgba(255,255,255,0.18)', borderRadius: '12px',
            boxShadow: '0 14px 36px rgba(0,0,0,.6)', display: 'none'
        });
        panel.innerHTML = `
      <div style="position:sticky;top:0;background:rgba(20,20,20,.95);padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;gap:8px;align-items:center">
        <strong style="flex:1">War Log</strong>
        <div id="warFilters" style="display:flex;gap:6px;align-items:center"></div>
        <button data-act="refresh" style="padding:4px 8px;border-radius:8px;border:0;background:#2b6;color:#fff;cursor:pointer">Refresh</button>
        <button data-act="clear"   style="padding:4px 8px;border-radius:8px;border:0;background:#a33;color:#fff;cursor:pointer">Clear</button>
        <button data-act="close"   style="padding:4px 8px;border-radius:8px;border:0;background:#555;color:#fff;cursor:pointer">×</button>
        </div>
      <table style="width:100%;border-collapse:collapse;font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif">
        <thead>
          <tr style="opacity:.85;background:rgba(255,255,255,.05)">
            <th style="text-align:left;padding:6px 8px">Name</th>
            <th style="text-align:left;padding:6px 8px">Out In</th>
            <th style="text-align:left;padding:6px 8px">ETA</th>
            <th style="text-align:left;padding:6px 8px">Lvl</th>
            <th style="text-align:left;padding:6px 8px">Awards</th>
            <th style="text-align:left;padding:6px 8px">Xanax</th>
            <th style="text-align:left;padding:6px 8px">Actions</th>
          </tr>
        </thead>
        <tbody id="warHospTbody"></tbody>
      </table>
      <div style="padding:6px 10px;opacity:.7;border-top:1px solid rgba(255,255,255,.1)">
        Hotkeys: <b>Alt+L</b> toggle panel, <b>Alt+C</b> copy War Callout for current/last target
      </div>
    `;
        document.documentElement.appendChild(panel);
        tbody = panel.querySelector('#warHospTbody');

        filtersRow = panel.querySelector('#warFilters');
        filtersRow.innerHTML = `
      <label style="display:flex;gap:4px;align-items:center">
        <span style="opacity:.7">Filter:</span>
        <select id="warFilterSel" style="background:#111;color:#eee;border:1px solid #333;border-radius:6px;padding:3px 6px">
          <option value="all">All</option>
          <option value="lt30">&lt;30s</option>
          <option value="lt120">&lt;2m</option>
          <option value="lt300">&lt;5m</option>
        </select>
      </label>
      <label style="display:flex;gap:6px;align-items:center;margin-left:10px;">
        <input id="warAutoprune" type="checkbox" checked />
        <span style="opacity:.7">Auto-prune</span>
      </label>
    `;
        const sel = filtersRow.querySelector('#warFilterSel');
        sel.value = FILTER;
        sel.addEventListener('change', () => { FILTER = sel.value; rerenderPanel(); });
        autoPruneToggle = filtersRow.querySelector('#warAutoprune');

        panel.addEventListener('click', (e) => {
            const act = e.target?.getAttribute('data-act');
            if (!act) return;
            if (act === 'refresh') { rerenderPanel(); return; }
            if (act === 'close') panel.style.display = 'none';
            if (act === 'done') {
                const id = e.target.dataset.id;           // we’ll render Actions with data-id below
                const idx = LOG.findIndex(x => x.id === id);
                if (idx >= 0) {
                    LOG.splice(idx, 1);
                    setStore(LOG_KEY, [...LOG]);
                }
                return;
            }
            if (act === 'clear') {
                setStore(LOG_KEY, []);
                lastSeenXidTs.clear();     // <-- allow immediate re-log of same XIDs
                currentActiveEntry = null;
                rerenderPanel();
                return;
            }

            if (act === 'copy') {
                const idx = +e.target.dataset.idx;
                const entry = getFiltered()[idx];
                if (entry) copyText(calloutFor(entry));
            }
            if (act === 'note') {
                const idx = +e.target.dataset.idx;
                const entry = getFiltered()[idx];
                if (!entry) return;
                const txt = prompt('Note for ' + entry.name, entry.note || '');
                if (txt !== null) {
                    const full = LOG.find(x => x.id === entry.id);
                    if (full) { full.note = txt; setStore(LOG_KEY, [...LOG]); }
                }
            }
            if (act === 'pullx') {
                const idx = +e.target.dataset.idx;
                const entry = getFiltered()[idx];
                if (entry) requestXanaxFor(entry);
            }
        });
    }

    (function ensureOutBadgeCSS(){
        if (document.querySelector('style[data-war-out-badge]')) return;
        const st = document.createElement('style');
        st.setAttribute('data-war-out-badge','1');
        st.textContent = `
            .war-out-badge{
            display:inline-block; padding:2px 6px; border-radius:999px;
            background:#2b6; color:#fff; font-weight:600; font-size:11px;
            line-height:1; vertical-align:middle; letter-spacing:.3px;
            animation:warPulse 1s ease-in-out infinite;
            }
            .war-expired-badge{
            display:inline-block; padding:2px 6px; border-radius:999px;
            background:#666; color:#fff; font-weight:600; font-size:11px; line-height:1;
            opacity:.9;
            }
            @keyframes warPulse{
            0%{box-shadow:0 0 0 0 rgba(43,182,102,.55)}
            70%{box-shadow:0 0 0 8px rgba(43,182,102,0)}
            100%{box-shadow:0 0 0 0 rgba(43,182,102,0)}
            }
        `;
        document.head.appendChild(st);
    })();


    function getFiltered() {
        if (autoPruneToggle?.checked) {
            const pruned = LOG.filter(r => (now() - (r.capturedAt + r.seconds*1000)) <= AUTOPRUNE_MIN_MS);
            if (pruned.length !== LOG.length) setStore(LOG_KEY, pruned);
        }
        const rows = LOG.map(r => {
            const leftSec = Math.max(0, Math.round(r.seconds - (now() - r.capturedAt)/1000));
            const etaMs   = r.capturedAt + r.seconds*1000;
            const expired = (leftSec === 0) && !r.revivedAt;     // natural timeout, not a med-out
            return { ...r, leftSec, etaMs, expired };
        });

        switch (FILTER) {
            case 'lt30':  return rows.filter(r => r.leftSec < 30);
            case 'lt120': return rows.filter(r => r.leftSec < 120);
            case 'lt300': return rows.filter(r => r.leftSec < 300);
            default:      return rows;
        }
    }

    function rowColor(s) { return s<30 ? 'rgba(220,70,70,.25)' : s<120 ? 'rgba(240,150,60,.22)' : s<300 ? 'rgba(250,230,80,.18)' : 'transparent'; }

    function rerenderPanel() {
        if (!panel) return;
        const rows = getFiltered();
        tbody.innerHTML = rows.map((r, i) => {
            const bg = r.revivedAt
            ? 'rgba(60,160,90,.20)'          // med-out pulse background
            : r.expired
            ? 'rgba(180,180,180,.12)'    // natural expiry (grey)
            : rowColor(r.leftSec);
            return`
        <tr style="border-bottom:1px solid rgba(255,255,255,.06);background:${bg}">
        <td style="padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff;" title="${r.url}">
          <a href="${r.url}" target="_blank" style="color:#7dd">${escapeHtml(r.name)}</a>
          ${r.note ? `<div style="opacity:.65;font-style:italic">${escapeHtml(r.note)}</div>` : ''}
        </td>

        <td style="color:#fff;padding:6px 8px;font-variant-numeric:tabular-nums">
          ${r.revivedAt
                ? '<span class="war-out-badge" title="Revived / Med\'d out">MED-OUT</span>'
            : r.expired
                ? '<span class="war-expired-badge" title="Timer finished">DONE</span>'
            : fmtHMS(r.leftSec)}
        </td>

        <td style="color:#fff;padding:6px 8px">${etaStr(r.etaMs)}</td>
        <td style="color:#fff;padding:6px 8px">${r.level ?? '—'}</td>
        <td style="color:#fff;padding:6px 8px">${r.awards ?? '—'}</td>
        <td style="color:#fff;padding:6px 8px">${r.xanax ?? '—'}</td>
        <td style="color:#fff;padding:6px 8px;display:flex;gap:6px;white-space:nowrap">
          <button data-act="copy"  data-idx="${i}" style="padding:3px 6px;border:0;border-radius:6px;background:#27a;color:#fff;cursor:pointer">Callout</button>
          <button data-act="pullx" data-idx="${i}" style="padding:3px 6px;border:0;border-radius:6px;background:#7950f2;color:#fff;cursor:pointer">Xanax</button>
          <button data-act="note"  data-idx="${i}" style="padding:3px 6px;border:0;border-radius:6px;background:#555;color:#fff;cursor:pointer">✎</button>
          <button data-act="done"  data-id="${r.id}" style="padding:3px 6px;border:0;border-radius:6px;background:#2b6;color:#fff;cursor:pointer">Done</button>
        </td>
      </tr>
        `;}).join('');
    }

    function escapeHtml(s=''){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    async function copyText(text){ try { await navigator.clipboard.writeText(text); } catch { const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } }
    function togglePanel(){ ensurePanel(); panel.style.display = (panel.style.display==='none'?'block':'none'); rerenderPanel(); }


    // ========= Shared helper for “Xanax” buttons in panel =========
    function requestXanaxFor(entry) {
        if (!entry || !entry.xid) return;
        const c = XANAX_CACHE[entry.xid];
        if (c && now() - c.ts < XANAX_TTL_MS) return;

        // Real page Torn uses:
        const statsUrl = `${location.origin}/personalstats.php?ID=${entry.xid}&stats=useractivity&from=1%20month#xanaxpull`;
        const w = window.open(statsUrl, `_war_xanax_${entry.xid}`,
                              `popup=yes,width=520,height=560,left=${screenX+40},top=${screenY+40},resizable=yes,scrollbars=yes`);
        try { w && w.focus(); } catch {}
    }

    async function warmUpStats() {
        try {
            // Touch the page once to let Torn set any cookies/branch state.
            await fetch(`${location.origin}/personalstats.php?warmup=1`, {
                credentials: 'same-origin',
                cache: 'no-store',
            });
            // Give the server a beat to commit cookies/caches.
            await new Promise(r => setTimeout(r, 250));
        } catch {}
    }

    // ========= Parent (lists): open popup + receive data =========
    if (window.top === window && !isProfiles() && !isStatsPage()) {
        ensurePanel(); rerenderPanel();
        setInterval(() => { try { rerenderPanel(); if (isFactionRosterPage()) reconcileFromVisibleFactionList(); } catch {} }, PANEL_REFRESH_MS);

        // Hotkeys
        window.addEventListener('keydown', (e) => {
            if (!e.altKey) return;
            if (e.key==='l'||e.key==='L') togglePanel();
            if (e.key==='c'||e.key==='C') {
                const entry = currentActiveEntry || LOG[LOG.length-1];
                if (entry) copyText(calloutFor(entry));
            }
        }, {passive:true});

        // DEBUG hooks
        window.__warDebug = {
            recon: () => { try { reconcileFromVisibleFactionList(); } catch(e) { console.warn(e); } },
            dump:  () => console.table(LOG.map(x => ({ name:x.name, xid:x.xid, left:x.seconds })))
        };

        function reconcileFromVisibleFactionList() {
            if (!/\/factions\.php\b/.test(location.pathname)) return;

            // Build map: XID -> status text (lowercased)
            const rows = document.querySelectorAll('li.table-row, .table-row, [class*="table-row"]');
            const live = new Map();
            rows.forEach(row => {
                const a = row.querySelector('a[href*="/profiles.php?XID="]');
                if (!a) return;
                const xid = new URL(a.getAttribute('href'), location.origin).searchParams.get('XID');
                if (!xid) return;
                const statusTxt = (row.querySelector('.table-cell.status .ellipsis, .status .ellipsis')?.textContent || '').toLowerCase();
                live.set(String(xid), statusTxt);
            });

            const nowTs = Date.now();
            let changed = false;
            const next = [];

            for (const e of LOG) {
                const st = live.get(String(e.xid));

                // If still counting down and roster says NOT in hospital → mark OUT immediately.
                if (e.seconds > 0 && st && !/hospital/.test(st)) {
                    e.seconds = 0;
                    e.revivedAt = nowTs;        // <-- flag as OUT (revived/self-med)
                    changed = true;
                }

                // Keep the row only while the OUT badge is shown.
                if (e.revivedAt && (nowTs - e.revivedAt) > OUT_BADGE_MS) {
                    changed = true;             // drop it now
                    continue;
                }

                next.push(e);
            }

            if (changed) setStore(LOG_KEY, next);
        }


        // ========= Chat dock offset: CSS-variable strategy (no per-box writes) =========
        let chatCSSInstalled = false;
        let lastChatOffsetPx = -1;
        let roPanel = null;
        let resizeTicking = false;

        function ensureChatOffsetStyles() {
            if (chatCSSInstalled) return;
            const st = document.createElement('style');
            st.setAttribute('data-war-chat-offset', '1');
            st.textContent = `
            :root { --war-chat-offset: 0px; }

            /* Raise *any* chat container/windows by the global offset.
            We include safe-area to play nice on mobile/PWA. */
            [id^="chatRoot"], [class^="chatRoot"], [class*=" chatRoot"],
            [class^="chatDock"], [class*=" chatDock"],
            [class^="torn-chat"], [class*=" torn-chat"],
            [class^="chat-window"], [class*=" chat-window"],
            [class^="chatPanel"], [class*=" chatPanel"],
            [class^="chatWrapper"], [class*=" chatWrapper"],
            [class^="chatContainer"], [class*=" chatContainer"],
            [class^="chat-box___"], [class*=" chat-box___"] {
            bottom: calc(var(--war-chat-offset) + env(safe-area-inset-bottom, 0px)) !important;
            }
        `;
            document.documentElement.appendChild(st);
            chatCSSInstalled = true;
        }

        function setChatOffset(px) {
            const val = Math.max(0, Math.ceil(px|0));
            if (val === lastChatOffsetPx) return; // guard redundant writes
            lastChatOffsetPx = val;
            document.documentElement.style.setProperty('--war-chat-offset', val + 'px');
        }

        function computePanelOverlapOffset() {
            if (!panel || panel.style.display === 'none') return 0;
            const pr = panel.getBoundingClientRect();
            const bottomInset = parseFloat(panel.style.bottom) || 0; // 10px in your styles
            // exact pixels the panel occupies above the viewport bottom + your desired gap
            return Math.ceil(pr.height + bottomInset + CHAT_GAP_PX);
        }

        function updateChatDockOffsetNow() {
            try {
                const off = computePanelOverlapOffset();
                setChatOffset(off);
            } catch {}
        }

        function scheduleUpdateChatDockOffset() {
            if (resizeTicking) return;
            resizeTicking = true;
            requestAnimationFrame(() => {
                resizeTicking = false;
                updateChatDockOffsetNow();
            });
        }

        function installChatOffsetObservers() {
            ensureChatOffsetStyles();
            // Observe panel size changes only (not the whole DOM)
            if (!roPanel && panel) {
                roPanel = new ResizeObserver(scheduleUpdateChatDockOffset);
                roPanel.observe(panel);
            }
            // Window resize
            window.addEventListener('resize', scheduleUpdateChatDockOffset, { passive: true });

            // Also recompute on visibility toggles we already control
            const _toggle = togglePanel;
            togglePanel = function() {
                _toggle();
                scheduleUpdateChatDockOffset();
            };

            // Initial compute
            scheduleUpdateChatDockOffset();
        }

        installChatOffsetObservers();

        // Hover cue
        const cue = document.createElement('div');
        Object.assign(cue.style, {position:'fixed',zIndex:999999,pointerEvents:'none',transform:'translate(-9999px,-9999px)',background:'rgba(20,20,20,0.92)',color:'#f5f5f5',borderRadius:'7px',padding:'6px 8px',font:'12px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 6px 22px rgba(0,0,0,.45)'});
        cue.textContent = REQUIRE_MODIFIER ? 'Alt+Click → Status' : 'Click → Status';
        document.documentElement.appendChild(cue);
        const moveCue = (e)=>{ const pad=14; const x=Math.min(innerWidth-220,e.clientX+pad); const y=Math.min(innerHeight-48,e.clientY+pad); cue.style.transform=`translate(${x}px,${y}px)`; };
        const hideCue = ()=>{ cue.style.transform='translate(-9999px,-9999px)'; };

        // ---------- FIX 1: Row-scoped resolver ----------
        function findAnchorFromCell(cellEl) {
            // Scope to the clicked row only
            const row = cellEl.closest('tr, [role="row"], .table-row, .table__row, .info-table-row, .users-list__row');
            if (!row) return null;
            const anchors = Array.from(row.querySelectorAll('a[href*="/profiles.php?XID="]'));
            if (!anchors.length) return null;
            const prioritized =
                  anchors.find(a => a.querySelector('.honor-text, [class*="honor-text"]')) ||
                  anchors[0];
            return prioritized || null;
        }

        // ---------- FIX 2: Only treat *actual cells* as eligible ----------
        function eligibleCell(n){
            if(!n || n.nodeType!==1) return false;

            // Only allow cell-like elements; prevent ancestor containers from qualifying
            const isCellLike =
                  n.tagName === 'TD' ||
                  n.tagName === 'TH' ||
                  n.getAttribute('role') === 'cell' ||
                  (n.matches?.('.table-cell, [class*="tableCell"], [class*="__cell"], .cell') || false);

            if (!isCellLike) return false;

            const t = (n.textContent || '').trim();

            // strict match for "Hospital" cell or "In Hospital"
            if (/^\s*Hospital\s*$/i.test(t) || /^\s*In\s+Hospital\s*$/i.test(t)) return true;

            // Allow common time-only cells (e.g., "1:23") only if row text includes "hospital"
            if (/^(?:\d+\s*s(?:ec)?|\d+\s*m(?:in)?|\d+:\d{2}(?::\d{2})?)\s*$/i.test(t)) {
                const rowTxt = (n.closest('tr, [role="row"], .table-row, .info-table-row, .users-list__row')?.textContent || '');
                if (/hospital/i.test(rowTxt)) return true;
            }

            return false;
        }

        // Use row-scoped anchor to extract info
        function getRowInfo(cellEl){
            const a = findAnchorFromCell(cellEl);
            if (!a) return { url:'', name:'', xid:'' };
            const url  = new URL(a.getAttribute('href'), location.origin);
            const xid  = url.searchParams.get('XID') || '';
            let name = '';
            const nameSpan = a.querySelector('.honor-text, [class*="honor-text"]');
            if (nameSpan) name = cleanName(nameSpan.textContent);
            if (!name) name = cleanName(a.textContent || '');
            return { url: url.toString(), name, xid };
        }

        function openPopupForCell(cellEl, event){
            const info = getRowInfo(cellEl);
            if(!info.url || !info.xid) return; // hard guard
            const url = new URL(info.url); url.hash = 'focus-hospital';
            // reuse single popup
            if (window.__warPopup && !window.__warPopup.closed) {
                try { window.__warPopup.location.replace(url.toString()); window.__warPopup.focus(); }
                catch { window.__warPopup = null; }
            }
            if (!window.__warPopup || window.__warPopup.closed) {
                const left = Math.max(0, Math.min(window.screenX + event.clientX, screen.availWidth  - POPUP_W));
                const top  = Math.max(0, Math.min(window.screenY + event.clientY, screen.availHeight - POPUP_H));
                const features = `popup=yes,width=${POPUP_W},height=${POPUP_H},left=${left},top=${top},resizable=yes,scrollbars=yes`;
                window.__warPopup = window.open(url.toString(), POPUP_NAME, features);
                try { window.__warPopup.focus(); } catch {}
            }
        }

        // ---------- FIX 3: Safer click wiring ----------
        function wireCell(cell){
            if(cell.__warWired) return; cell.__warWired=true;
            cell.addEventListener('mouseenter',(e)=>{ moveCue(e); }, {passive:true});
            cell.addEventListener('mousemove', moveCue, {passive:true});
            cell.addEventListener('mouseleave', hideCue, {passive:true});
            cell.addEventListener('click',(e)=>{
                if (REQUIRE_MODIFIER && !e.altKey) return;
                e.stopPropagation();   // avoid row/table handlers hijacking
                e.preventDefault();    // avoid native navigation (if any)
                openPopupForCell(cell,e);
            },{passive:false});
        }

        // ---------- FIX 4: Only scan cell elements, no textContent treewalker ----------
        function scan(root=document){
            const candidates = root.querySelectorAll('td, th, [role="cell"], .table-cell, [class*="tableCell"], [class*="__cell"], .cell');
            for (const el of candidates) if (eligibleCell(el)) wireCell(el);
        }

        let scanQueued = false;
        let reconQueued = false;
        let lastReconTs = 0;          // throttle reconcile calls

        const mo = new MutationObserver(() => {
            if (scanQueued) return;
            scanQueued = true;

            requestAnimationFrame(() => {
                scanQueued = false;

                // existing wiring pass
                try { scan(); } catch {}

                // also reconcile from visible faction list (only on roster pages)
                if (isFactionRosterPage()) {
                    const now = Date.now();
                    if (!reconQueued && (now - lastReconTs) > 800) { // min 800ms between runs
                        reconQueued = true;
                        requestAnimationFrame(() => {
                            reconQueued = false;
                            lastReconTs = Date.now();
                            try { reconcileFromVisibleFactionList(); } catch {}
                        });
                    }
                }
            });
        });

        mo.observe(document.body, { childList: true, subtree: true, characterData: false });
        scan(); // initial pass

        // Receive data
        window.addEventListener('message', (ev) => {
            const d = ev.data || {};
            if (!d || !d.__war) return;

            if (d.type === 'profile-data') {
                let { xid, name, awards, level, seconds, url } = d;
                if (!xid) return;

                const ts   = now();
                const secs = Number.isFinite(seconds) ? Math.max(0, seconds|0) : 0;

                // Build the new/updated entry
                const existingIdx = LOG.findIndex(e => e.xid === xid);
                const prev        = existingIdx >= 0 ? LOG[existingIdx] : null;
                const entry = {
                    id: prev?.id || uniqueId(),
                    xid,
                    name: cleanName(name || xid),
                    awards: (awards ?? prev?.awards ?? null),
                    level: (level ?? prev?.level ?? null),
                    seconds: secs,
                    capturedAt: ts,
                    url,
                    xanax: prev?.xanax ?? XANAX_CACHE[xid]?.value ?? null,
                    factionId: (d.factionId ?? prev?.factionId ?? null)
                };

                if (existingIdx >= 0) {
                    LOG[existingIdx] = entry;      // replace existing (no duplicates ever)
                } else {
                    LOG = [...LOG, entry];         // add new
                }
                setStore(LOG_KEY, LOG);
                currentActiveEntry = entry;
                lastSeenXidTs.set(xid, ts);      // still keep a tiny guard if you want, but uniqueness is guaranteed

                try { console.log('[WarLog] upsert', entry); } catch {}
            }

            if (d.type === 'xanax-data') {
                const { xid, xanax, meta } = d;
                if (!xid) return;

                // visible logging
                try { console.log('[WarLog] xanax-data received', { xid, xanax, meta }); } catch {}

                if (Number.isFinite(xanax)) {
                    XANAX_CACHE[xid] = { value: xanax, ts: now() };
                    setStore(XANAX_CACHE_KEY, XANAX_CACHE);

                    const idx = LOG.findIndex(e => e.xid === xid);
                    if (idx >= 0) {
                        LOG[idx] = { ...LOG[idx], xanax };
                        setStore(LOG_KEY, [...LOG]);   // rerenders via GM listener
                    }

                    // ✅ ACK the popup that sent this event (ev.source is the popup window)
                    try { ev.source?.postMessage({ __war: true, type: 'xanax-ack', xid }, '*'); } catch {}
                }
                // (If xanax is null/NaN we do nothing; popup will keep trying.)
            }
        }, false);
    }

    // ========= Profile popup =========
    let awaitingAck = false;
    let lastChildStatsWin = null;

    if (isProfiles() && location.hash === '#focus-hospital') {
        // Hide chat overlays
        (function hideChat(){
            if (document.querySelector('style[data-war-chat-hide]')) return;
            const css = `
        #chatRoot,[id^="chatRoot"],
        [class^="chatRoot"],[class*=" chatRoot"],
        [class^="chatDock"],[class*=" chatDock"],
        [class^="chat-window"],[class*=" chat-window"],
        [class^="chatPanel"],[class*=" chatPanel"],
        [class^="chatWrapper"],[class*=" chatWrapper"],
        [class^="chatContainer"],[class*=" chatContainer"],
        [class^="torn-chat"],[class*=" torn-chat"] { display:none !important; }
      `;
            const st=document.createElement('style'); st.setAttribute('data-war-chat-hide','1'); st.textContent=css;
            document.documentElement.appendChild(st);
        })();

        function findStatusCard() {
            let el = document.querySelector('div.profile-status.m-top10.hospital');
            if (el) return el;
            el = document.querySelector('div.profile-status.m-top10');
            if (el) return el;
            el = document.querySelector('div.profile-status, div[class*="profile-status"]');
            if (el) return el;
            const titleNodes = Array.from(document.querySelectorAll('.title-black, [class*="title"]'));
            for (const t of titleNodes) {
                if (/^\s*status\s*$/i.test(t.textContent || '')) {
                    const panel = t.closest('div, section, article');
                    return panel?.parentElement?.closest('div, section, article') || panel || null;
                }
            }
            const blocks = Array.from(document.querySelectorAll('div, section, article'));
            return blocks.find(e => /in hospital/i.test(e.textContent || '')) || null;
        }
        function parseSecondsFromStatus(el){
            const raw = (el.textContent||'').toLowerCase().replace(/\s+/g,' ').trim();
            // Common phrasing: "in hospital for 18 minutes and 27 seconds"
            // Extract h/m/s individually (they may or may not exist)
            let h = 0, m = 0, s = 0;

            const hM = /(\d+)\s*hour/.exec(raw);
            const mM = /(\d+)\s*minute/.exec(raw);
            const sM = /(\d+)\s*second/.exec(raw);

            if (hM) h = parseInt(hM[1],10);
            if (mM) m = parseInt(mM[1],10);
            if (sM) s = parseInt(sM[1],10);

            if (h || m || s) return h*3600 + m*60 + s;

            // Fallback: clock-like "12:34" or "1:23:45"
            const clock = /(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(raw);
            if (clock){
                const hh = clock[3] ? parseInt(clock[1],10) : 0;
                const mm = clock[3] ? parseInt(clock[2],10) : parseInt(clock[1],10);
                const ss = parseInt(clock[3] || clock[2],10);
                return hh*3600 + mm*60 + ss;
            }
            return null;
        }

        function getNameAndXID(){
            const xid = new URLSearchParams(location.search).get('XID') || null;
            let name = '';
            const honor = document.querySelector('.honor-text, [class*="honor-text"]');
            if (honor) name = honor.textContent || '';
            if (!name) {
                const title = document.querySelector('.content-title, .profile-container h2, [class*="content-title"]');
                if (title) name = title.textContent || '';
            }
            return { name: cleanName(name), xid };
        }
        function parseAwards(){
            // Primary path: ul.info-table > li > .user-information-section .bold == "Awards"
            const lis = document.querySelectorAll('ul.info-table li');
            for (const li of lis) {
                const label = li.querySelector('.user-information-section .bold, .user-information-section span.bold');
                if (label && /^(?:\s*awards\s*)$/i.test(label.textContent || '')) {
                    const valEl = li.querySelector('.user-info-value span, .user-info-value');
                    const num   = parseIntLoose(valEl?.textContent || '');
                    if (num != null) return num;
                }
            }

            // Fallback: older/general selector set
            const labels = Array.from(document.querySelectorAll('span.bold, .bold'));
            for (const sp of labels) {
                if (/^\s*awards\s*$/i.test(sp.textContent || '')) {
                    const li = sp.closest('li') || sp.parentElement?.closest('li');
                    if (li) {
                        const val = li.querySelector('.user-info-value span, .user-info-value, span');
                        const num = parseIntLoose(val?.textContent||'');
                        if (num != null) return num;
                    }
                }
            }
            return null;
        }

        function parseLevelFromProfile(){
            // Level lives in the "block-value → box-value" digits
            const ul = document.querySelector('.block-value ul.box-value, ul.box-value');
            if (!ul) return null;
            const digits = [];
            for (const li of ul.querySelectorAll('li')) {
                // Most digits have an inner .digit element containing "0–9"
                const d = li.querySelector('.digit');
                if (d && /\d/.test(d.textContent || '')) { digits.push(d.textContent.trim()); continue; }
                // Zero is often rendered via CSS and flagged with a "zero" class
                if (li.querySelector('.zero') || /\bzero\b/.test(li.className)) { digits.push('0'); continue; }
                // Fallback: scrape any numbers in text
                const m = (li.textContent || '').match(/\d/);
                if (m) digits.push(m[0]);
            }
            const joined = digits.join('').replace(/^0+/, '');
            return joined ? parseInt(joined, 10) : null;
        }


        function calcTopInset() {
            const all = Array.from(document.body.querySelectorAll('*'));
            let maxBottom = 0;
            for (const el of all) {
                const s = getComputedStyle(el);
                if ((s.position === 'fixed' || s.position === 'sticky') && s.visibility!=='hidden' && s.display!=='none') {
                    const r = el.getBoundingClientRect();
                    if (r.top <= 2 && r.height > 10 && r.height < 200 && r.width > 200) maxBottom = Math.max(maxBottom, r.bottom);
                }
            }
            return Math.ceil(maxBottom);
        }
        function centerAndResize(statusEl){
            const PAD=10, MIN_W=480, MIN_H=220, MAX_W=560, MAX_H=280;
            const fixedTop = calcTopInset();
            statusEl.style.scrollMarginTop = (fixedTop + PAD) + 'px';
            try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch {}
            statusEl.scrollIntoView({ behavior: 'auto', block: 'start' });
            setTimeout(()=>{
                const rect = statusEl.getBoundingClientRect();
                let desiredInnerW = Math.ceil(rect.width)  + PAD*2;
                let desiredInnerH = Math.ceil(rect.height) + PAD*2 + fixedTop;
                desiredInnerW = Math.max(MIN_W, Math.min(MAX_W, desiredInnerW));
                desiredInnerH = Math.max(MIN_H, Math.min(MAX_H, desiredInnerH));
                const chromeW = window.outerWidth  - window.innerWidth;
                const chromeH = window.outerHeight - window.innerHeight;
                const outerW  = Math.max(120, desiredInnerW + (isFinite(chromeW)?chromeW:0));
                const outerH  = Math.max(120, desiredInnerH + (isFinite(chromeH)?chromeH:0));
                try { window.resizeTo(outerW, outerH); } catch {}
                const finalRect = statusEl.getBoundingClientRect();
                const targetY   = Math.max(0, window.scrollY + finalRect.top - fixedTop - PAD);
                window.scrollTo({ top: targetY, behavior: 'auto' });
                const prev = { boxShadow: statusEl.style.boxShadow, zIndex: statusEl.style.zIndex };
                statusEl.style.zIndex='1';
                statusEl.style.boxShadow='0 0 0 3px rgba(238,68,68,0.65), 0 10px 30px rgba(0,0,0,.45)';
                setTimeout(()=>{ statusEl.style.boxShadow=prev.boxShadow; statusEl.style.zIndex=prev.zIndex; }, 900);
            }, 60);
        }
        function getFactionIdFromProfile(){
            const a = document.querySelector('a[href*="/factions.php?"][href*="ID="], a[href*="/factions.php?"][href*="userID="]');
            if (!a) return null;
            const u = new URL(a.getAttribute('href'), location.origin);
            return u.searchParams.get('ID') || u.searchParams.get('userID') || null;
        }

        function sendProfileData(seconds, awardsOverride){
            const {name, xid} = getNameAndXID();
            const awards = (awardsOverride ?? parseAwards());
            const level  = parseLevelFromProfile();
            const factionId = getFactionIdFromProfile();
            const url = location.href.replace(location.hash,'');
            try {
                window.opener?.postMessage({ __war:true, type:'profile-data', xid, name, awards, level, seconds, url, factionId }, '*');
            } catch {}
        }
        function addXanaxButton(xid) {
            if (!xid) return;
            const btn = document.createElement('button');
            btn.textContent = 'Pull Xanax';
            Object.assign(btn.style, {
                position:'fixed', top:'8px', right:'8px', zIndex: 999999,
                background:'#7950f2', color:'#fff', border:'0', padding:'6px 10px',
                borderRadius:'8px', cursor:'pointer', boxShadow:'0 8px 22px rgba(0,0,0,.35)',
                font:'12px/1 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif'
            });
            btn.addEventListener('click', () => { awaitingAck = true; requestXanaxFor({ xid }); }, { passive: true });

            document.documentElement.appendChild(btn);
        }
        (function installCloseOnLeave(){
            if (!CLOSE_ON_LEAVE) return;
            let allowClose = false;
            setTimeout(()=>{ allowClose = true; }, GRACE_TO_CLICK_MS);
            document.addEventListener('mouseleave', (e) => {
                if (!allowClose || awaitingAck) return;
                if (!e.relatedTarget && typeof window.close === 'function') { try { window.close(); } catch {} }
            });
        })();

        let parseInFlight = false;

        function runParse(maxTries = 24) {
            if (parseInFlight) return;
            parseInFlight = true;

            let tries = 0;
            let centered = false;

            const attempt = () => {
                const statusEl = findStatusCard();

                // Center once when we first see the card
                if (statusEl && !centered) {
                    centered = true;
                    centerAndResize(statusEl);
                }

                const secs = statusEl ? parseSecondsFromStatus(statusEl) : null;
                const aw   = parseAwards();

                if (Number.isFinite(secs) && secs >= 0) {
                    sendProfileData(secs, aw ?? undefined);
                    parseInFlight = false;
                    return;
                }

                if (++tries < maxTries) {
                    setTimeout(attempt, 170);
                } else {
                    // still commit once; parent will store/de-dupe by XID later
                    sendProfileData(0, aw ?? undefined);
                    parseInFlight = false;
                }
            };
            attempt();
        }

        function ensureProfilePopupSize() {
            try {
                const wantW = 480, wantH = 280;
                const chromeW = window.outerWidth - window.innerWidth;
                const chromeH = window.outerHeight - window.innerHeight;
                const ow = Math.max(300, wantW + (isFinite(chromeW)?chromeW:0));
                const oh = Math.max(200, wantH + (isFinite(chromeH)?chromeH:0));
                window.resizeTo(ow, oh);
            } catch {}
        }

        function addRetryButton() {
            const btn = document.createElement('button');
            btn.textContent = 'Retry Pull';
            Object.assign(btn.style, {
                position:'fixed', top:'40px', right:'8px', zIndex: 999999,
                background:'#e38430ff', color:'#fff', border:'0', padding:'6px 10px',
                borderRadius:'8px', cursor:'pointer', boxShadow:'0 8px 22px rgba(0,0,0,.35)',
                font:'12px/1 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif'
            });
            btn.addEventListener('click', () => runParse(30), { passive: true });
            document.documentElement.appendChild(btn);
        }

        (function boot() {
            const waitForCard = () => {
                const statusEl = findStatusCard();
                if (!statusEl) { setTimeout(waitForCard, 150); return; }

                // Controls on first good render
                ensureProfilePopupSize();
                centerAndResize(statusEl);
                addXanaxButton(new URLSearchParams(location.search).get('XID') || '');
                addRetryButton();

                // Initial parse
                runParse(24);
            };
            waitForCard();
        })();

        // Optional: press "R" to retry parsing quickly
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) {
                runParse(30);
            }
        }, { passive: true });


        // Forward xanax result up, then close self
        // Bridge child (stats) <-> parent (main) and wait for ACK before closing
        window.addEventListener('message', (ev) => {
            const data = ev.data || {};
            if (!data || !data.__war) return;

            if (data.type === 'xanax-data') {
                // remember who sent it (the stats popup)
                lastChildStatsWin = ev.source || lastChildStatsWin;
                try { window.opener?.postMessage(data, '*'); } catch {}
                // don't close yet; wait for ACK
            }

            if (data.type === 'xanax-ack') {
                // forward the ACK back to the stats popup and then close self
                try { lastChildStatsWin?.postMessage(data, '*'); } catch {}
                awaitingAck = false;
                try { window.close(); } catch {}
            }}, false);

        return;
    }

    // ========= Stats popup (Xanax) =========
    if (isStatsPage()) {
        const params = new URLSearchParams(location.search);
        const ids = (params.get('ID') || '').split(',').map(s => s.trim()).filter(Boolean);
        const targetXid = ids.length ? ids[ids.length - 1] : null;

        const log   = (...a) => { try { console.log('[XANAX]', ...a); } catch {} };
        const delay = (ms) => new Promise(r => setTimeout(r, ms));
        const toInt = (v) => (typeof v === 'number' && Number.isFinite(v)) ? (v|0)
        : (typeof v === 'string' && /^\d[\d ,]*$/.test(v) ? parseInt(v.replace(/[ ,]+/g,''),10) : null);

        // STRONG gate: only run when this window was opened by our script
        function shouldAutoRun() {
            let openerOk = false;
            try { openerOk = !!window.opener && window.opener.location.origin === location.origin; } catch {}
            const nameOk = (window.name || '').startsWith('_war_xanax_');
            const hashOk = (location.hash === '#xanaxpull');
            return openerOk && (nameOk || hashOk);
        }

        // If this is a normal visit to personalstats.php, do nothing.
        if (!shouldAutoRun()) return;

        // Explicit parser for Torn JSON
        function extractXanaxFromDrugsForXid(json, xid) {
            try {
                const cats  = Array.isArray(json?.categories) ? json.categories : [];
                const drugs = cats.find(c => String(c?.name || '').toLowerCase() === 'drugs');
                const cols  = Array.isArray(drugs?.columns) ? drugs.columns : [];
                const col   = cols.find(c => String(c?.userID) === String(xid)) || cols[0];
                const stats = Array.isArray(col?.stats) ? col.stats : [];

                const s1 = stats.find(s => /xanax/i.test(String(s?.title || s?.name || s?.shortName || '')) && s?.value != null);
                if (s1) { const n = toInt(s1.value); if (n != null) return { value: n, parse: 'drugs.stats.value' }; }

                const s2 = stats.find(s => /xanax/i.test(String(s?.title || s?.name || s?.shortName || '')) && s?.values && typeof s.values === 'object');
                if (s2) {
                    const prefer = ['all','overall','total','lifetime'];
                    for (const k of Object.keys(s2.values)) {
                        const n = toInt(s2.values[k]);
                        if (n != null && prefer.some(p => k.toLowerCase().includes(p))) return { value: n, parse: `drugs.stats.values:${k}` };
                    }
                    const nums = Object.values(s2.values).map(toInt).filter(n => n != null);
                    if (nums.length) return { value: Math.max(...nums), parse: 'drugs.stats.values:max' };
                }
            } catch {}
            return { value: null, parse: 'miss' };
        }

        async function fetchXanaxDirect(xid) {
            let http = 0;
            try {
                const payload = { step: 'getUserStats', userIDs: [Number(xid)], category: 'drugs' };
                const res = await fetch(`${location.origin}/personalstats.php`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json;charset=UTF-8',
                        'accept': 'application/json, text/plain, */*',
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(payload)
                });
                http = res.status;

                // 1) Try native JSON first.
                try {
                    const json = await res.clone().json();
                    const out = extractXanaxFromDrugsForXid(json, xid);
                    if (Number.isFinite(out.value)) return { value: out.value, meta: { http, parse: 'json' } };
                } catch {}

                // 2) Fallback: read text, then strip junk and parse the biggest JSON object.
                const text = await res.text();
                const first = text.indexOf('{');
                const last  = text.lastIndexOf('}');
                if (first !== -1 && last > first) {
                    const cleaned = text.slice(first, last + 1);
                    try {
                        const json2 = JSON.parse(cleaned);
                        const out2 = extractXanaxFromDrugsForXid(json2, xid);
                        if (Number.isFinite(out2.value)) return { value: out2.value, meta: { http, parse: 'json:cleaned' } };
                    } catch {}
                }

                // 3) Last-ditch regex (unchanged).
                const m1 = /"Xanax\s*(?:taken|used)"\s*:\s*(\d+)/i.exec(text);
                if (m1) return { value: parseInt(m1[1], 10), meta: { http, parse: 'regex:title' } };
                const m2 = /"xanax"[^0-9]{0,40}(\d+)/i.exec(text);
                if (m2) return { value: parseInt(m2[1], 10), meta: { http, parse: 'regex:key' } };

            } catch (e) {
                try { console.log('[XANAX] fetch error', e); } catch {}
            }
            return { value: null, meta: { http, parse: 'miss' } };
        }


        async function run() {
            if (!targetXid) { try { window.close(); } catch {} ; return; }

            // Build the overlay ONLY when running as a popup worker
            const statusEl = document.createElement('div');
            Object.assign(statusEl.style, {
                position: 'fixed', inset: 0, zIndex: 2147483647,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(12,12,12,.92)', color: '#fff',
                font: '14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif'
            });
            const statusInner = document.createElement('div');
            Object.assign(statusInner.style, {
                padding: '14px 18px', borderRadius: '10px',
                background: 'rgba(30,30,30,.85)', border: '1px solid rgba(255,255,255,.15)',
                boxShadow: '0 18px 40px rgba(0,0,0,.5)', maxWidth: '90%', textAlign: 'center', whiteSpace: 'pre-wrap'
            });
            statusEl.appendChild(statusInner);
            const setStatus = (t) => { statusInner.textContent = String(t || ''); };
            document.documentElement.appendChild(statusEl);

            // match the compact Status popup size (≈ 480x280 inner)
            try {
                const wantW = 480, wantH = 280;
                const chromeW = window.outerWidth - window.innerWidth;
                const chromeH = window.outerHeight - window.innerHeight;
                window.resizeTo(Math.max(300, wantW + (isFinite(chromeW)?chromeW:0)),
                                Math.max(200, wantH + (isFinite(chromeH)?chromeH:0)));
            } catch {}

            let tries = 0;
            const MAX_TRIES = 24;          // ~8–9s total with backoff
            let posted = false;
            let acked  = false;

            // Listen for ACK from parent/profile
            const onAck = (ev) => {
                const data = ev.data || {};
                if (data && data.__war && data.type === 'xanax-ack' && String(data.xid) === String(targetXid)) {
                    acked = true;
                    setStatus('Confirmed ✔ — closing…');
                    setTimeout(() => { try { window.close(); } catch {} }, 120);
                    window.removeEventListener('message', onAck);
                }
            };
            window.addEventListener('message', onAck);

            while (tries < MAX_TRIES && !posted) {
                tries++;
                setStatus(`Pulling Xanax… (try ${tries}/${MAX_TRIES})`);
                await warmUpStats();
                const { value, meta } = await fetchXanaxDirect(targetXid);
                log('result', { value, meta });

                if (Number.isFinite(value)) {
                    setStatus(`Got ${value}. Waiting for confirmation…`);
                    try {
                        window.opener?.postMessage({ __war:true, type:'xanax-data', xid: targetXid, xanax: value, meta }, '*');
                        try { window.opener?.opener?.postMessage({ __war:true, type:'xanax-data', xid: targetXid, xanax: value, meta }, '*'); } catch {}
                    } catch {}
                    posted = true;

                    // wait up to 5s for ACK, then close anyway (leave status visible)
                    const waitUntil = Date.now() + 5000;
                    while (!acked && Date.now() < waitUntil) await delay(120);
                    if (!acked) {
                        setStatus('Posted, no ACK yet — you can close this window if needed.');
                    }
                    break;
                } else {
                    setStatus(`No value yet (parse=${meta?.parse || '?'}, http=${meta?.http || '?'}) — retrying…`);
                    await delay(250 + Math.min(800, tries * 150));
                }
            }

            if (!posted) {
                setStatus('Could not read Xanax. Leave this open to inspect, or close.');
                setTimeout(() => { try { window.close(); } catch {} }, 15000);
            }
        }

        // Only run when we satisfy the strong gate
        run();

        // last-resort close to avoid stranding a window
        setTimeout(() => { try { window.close(); } catch {} }, 30000);
        return;
    }
})();
