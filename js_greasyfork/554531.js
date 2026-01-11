// ==UserScript==
// @name         Torn Loadout
// @namespace    jfk.portal
// @version      1.3.5
// @description  Shows defender loadout on the attack loader page. If gear isn't readable yet, waits for Start/Join fight, then posts on first readable payload. Includes history tabs (up to 5) with time-ago labels. Auto light/dark theming.
// @author       HuzGPT
// IMPORTANT: gunshop "spy" can still land on the attack loader page, but it may load gear via different loader/XHR calls
// than the normal attack flow. We keep this userscript scoped to the attack loader page.
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      api.justferkillin.com
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/554531/Torn%20Loadout.user.js
// @updateURL https://update.greasyfork.org/scripts/554531/Torn%20Loadout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ======================== Config ======================== */
    const API_BASE = 'https://api.justferkillin.com/api';
    const LOADOUT_ENDPOINT = '/loadouts/record';
    const TOUCH_ENDPOINT = '/loadouts/touch';

    const AUTO_PUSH = true;
    const DEBUG_VIEW = false;
    const DEDUPE_LOCAL = true;
    const DEBUG_LOG = false;

    const DUMMY_ON_EMPTY = false;    // show a dummy when nothing readable (debug)
    const POST_DUMMY = false;        // if DUMMY_ON_EMPTY, also POST dummy to backend (debug)
    const FALLBACK_TO_BACKEND = true;

    // History tabs
    const SHOW_HISTORY_TABS = true;  // show the tabs when we have multiple snapshots
    const HISTORY_LIMIT = 5;         // max snapshots to show in tabs (newest first)

    const postedForAttackId = new Set();

    // When gear initially isn't readable, arm a watcher that waits for Start/Join click (or the button disappearing),
    // then post as soon as the next attackData shows readable items.
    let AWAIT_READABLE_AFTER_START = false;
    let AWAIT_TIMER = null;                 // safety timer
    const AWAIT_WINDOW_MS = 45_000;         // stop waiting after 45s

    // Persisted API key
    const GM_API_KEY = 'JFK_TORN_API_KEY';
    const PRINT_KEY = false;

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
            console.warn('[Loadouts] localStorage not accessible:', e);
        }

        // If no key in localStorage, prompt user (one-time setup)
        if (!key) {
            key = prompt('Enter your Torn API key (must match website login):');
            if (key) {
                const trimmed = key.trim();
                try {
                    localStorage.setItem('tornApiKey', trimmed);
                    // Also save to GM for backwards compat, but we won't read from it
                    GM_setValue(GM_API_KEY, trimmed);
                } catch (e) {
                    console.error('[Loadouts] Failed to save API key:', e);
                }
                return trimmed;
            }
        }
        return (key || '').trim();
    }
    // Get API key - ONLY from localStorage (forced sync with website)
    let apiKey = null;
    try {
        apiKey = localStorage.getItem('tornApiKey');
    } catch (e) {
        console.warn('[Loadouts] localStorage not accessible:', e);
    }
    apiKey = (apiKey || '').trim();
    if (!apiKey) {
        apiKey = prompt('Enter your JFK API key (must match website login):') || '';
        if (apiKey) {
            const trimmed = apiKey.trim();
            try {
                localStorage.setItem('tornApiKey', trimmed);
                // Also save to GM for backwards compat, but we won't read from it
                GM_setValue(GM_API_KEY, trimmed);
            } catch (e) {
                console.error('[Loadouts] Failed to save API key:', e);
            }
            apiKey = trimmed;
        }
    }
    apiKey = (apiKey || '').trim();
    if (PRINT_KEY) console.log('[JFK-LOADOUT] Using API key:', apiKey || '(empty)');

    function authHeaders() {
        const key = ensureApiKey();
        return key ? { Authorization: key } : {};
    }

    /* ======================== Helpers / Net ======================== */
    const log = (...a) => { if (DEBUG_LOG) console.log('[JFK-LOADOUT]', ...a); };
    const toNumber = x => (Number.isFinite(Number(x)) ? Number(x) : null);
    const stripHtml = s => (s ? String(s).replace(/<[^>]*>/g, ' ').trim() : null);
    const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
    const pickFirstObj = (...vals) => {
        for (const v of vals) if (isObj(v)) return v;
        return {};
    };

    function safeJsonParse(text) {
        try { return JSON.parse(text); } catch { return null; }
    }

    function gmFetch(method, path, query = {}, body = null) {
        const base = API_BASE.replace(/\/+$/, '');
        const url = new URL(base + path);
        Object.entries(query || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
        });
        const gmXHR = (GM && GM.xmlHttpRequest) || GM_xmlhttpRequest;

        return new Promise((resolve, reject) => {
            gmXHR({
                method,
                url: url.toString(),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...authHeaders(),
                },
                data: body ? JSON.stringify(body) : undefined,
                timeout: 30000,
                onload: (resp) => {
                    let parsed = null;
                    try { parsed = resp.responseText ? JSON.parse(resp.responseText) : null; } catch { parsed = resp.responseText || null; }
                    if (resp.status >= 200 && resp.status < 300) resolve(parsed);
                    else reject(new Error(parsed?.message || resp.responseText || `HTTP ${resp.status}`));
                },
                onerror: (err) => reject(new Error(err?.message || 'Network error')),
                ontimeout: () => reject(new Error('Request timed out')),
            });
        });
    }
    const apiGET = (p, q) => gmFetch('GET', p, q, null);
    const apiPOST = (p, b) => gmFetch('POST', p, null, b);

    /* ======================== Normalisers ======================== */
    const WEAPON_KEYS = new Set(['1', '2', '3', '5']);
    const ARMOUR_KEYS = new Set(['4', '6', '7', '8', '9']);
    const WEAPON_SLOTS = { '1': 'Primary', '2': 'Secondary', '3': 'Melee', '5': 'Temporary' };
    const PLACEHOLDER_BONUS_RE = /^(?:blank\s+bonus(?:\s*25%?)?|item\s+bonus|bonus|empty|none)$/i;

    function timeAgoFromEpoch(epochSec) {
        if (!epochSec) return 'unknown';
        const nowMs = Date.now();
        const thenMs = epochSec * 1000;
        const diff = Math.max(0, nowMs - thenMs);

        const s = Math.floor(diff / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        const d = Math.floor(h / 24);
        const mo = Math.floor(d / 30);
        const y = Math.floor(d / 365);

        if (y > 0) return y === 1 ? '1 year ago' : `${y} years ago`;
        if (mo > 0) return mo === 1 ? '1 month ago' : `${mo} months ago`;
        if (d > 0) return d === 1 ? '1 day ago' : `${d} days ago`;
        if (h > 0) return h === 1 ? '1 hour ago' : `${h} hours ago`;
        if (m > 0) return m === 1 ? '1 min ago' : `${m} mins ago`;
        return s <= 1 ? 'just now' : `${s} secs ago`;
    }

    // New fetcher: resilient (tries /by-user, falls back to /recent)
    async function fetchAllSnapshotsForUser(userId, { since = null, limit = HISTORY_LIMIT, groupByAttack = false } = {}) {
        const q = { user_id: Number(userId), limit, groupByAttack: groupByAttack ? 'true' : 'false' };
        if (since) q.since = Number(since);

        try {
            const res = await apiGET('/loadouts/by-user', q);
            const rows = Array.isArray(res?.rows) ? res.rows : (Array.isArray(res) ? res : []);
            if (rows && rows.length) return rows;
        } catch (e) {
            log('by-user failed, falling back to /recent:', e?.message || e);
        }

        try {
            const r2 = await apiGET('/loadouts/recent', { user_id: Number(userId), limit });
            const rows2 = Array.isArray(r2?.rows) ? r2.rows : (Array.isArray(r2) ? r2 : []);
            return rows2 || [];
        } catch (e2) {
            log('recent fallback also failed:', e2?.message || e2);
            return [];
        }
    }

    function extractBonuses(currentBonuses) {
        if (!currentBonuses) return [];
        const out = [];
        for (const k of Object.keys(currentBonuses)) {
            const b = currentBonuses[k];
            if (!b) continue;
            const title = (b.title ?? '').trim();
            if (!title || PLACEHOLDER_BONUS_RE.test(title)) continue;
            out.push({ title, value: b.value ?? null, desc: stripHtml(b.desc) });
        }
        out.sort((a, b) => (a.title || '').localeCompare(b.title || '') || (a.value || '').localeCompare(b.value || '')); // stable-ish
        return out;
    }
    function extractUpgrades(currentUpgrades) {
        if (!currentUpgrades) return [];
        const out = (Array.isArray(currentUpgrades) ? currentUpgrades : []).map(u => ({
            title: u?.title ?? null,
            desc: stripHtml(u?.desc),
        }));
        out.sort((a, b) => (a.title || '').localeCompare(b.title || '')); // stable-ish
        return out;
    }
    function mapWeapon(item0) {
        if (!item0) return null;
        const name = item0.name ?? '';
        if (!name || name.toLowerCase() === 'unknown') return null;
        return {
            name,
            dmg: item0.dmg ?? null,
            acc: item0.acc ?? null,
            quality: item0.quality ?? null,
            glowClass: item0.glowClass ?? '',
            bonuses: extractBonuses(item0.currentBonuses),
            upgrades: extractUpgrades(item0.currentUpgrades),
            type: item0.type ?? null,
        };
    }
    function mapArmour(item0) {
        if (!item0) return null;
        const name = item0.name ?? '';
        if (!name || name.toLowerCase() === 'unknown') return null;
        return {
            name,
            glowClass: item0.glowClass ?? '',
            bonuses: extractBonuses(item0.currentBonuses),
            defense: item0.defense ?? item0.armor ?? item0.armour ?? null,
            type: item0.type ?? null,
        };
    }

    /* ======================== THEME-AWARE Styles ======================== */
    const styles = `
  :root{
    /* Default (dark mode) */
    --jfk-bg-1:#0b1220;
    --jfk-bg-2:#0f1724;
    --jfk-border:rgba(255,255,255,0.06);
    --jfk-text:#e6e7eb;
    --jfk-sub:#9aa6b2;
  }
  
  /* Light mode: keep dark panels, but make key labels darker for visibility */
  .loadout-helper-container[data-theme="light"]{
    --jfk-bg-1:#111827;
    --jfk-bg-2:#0e1626;
    --jfk-border:rgba(255,255,255,0.08);
    --jfk-text:#e6e7eb; /* keep bright for gear text */
    --jfk-sub:#9aa6b2;
  }
  .loadout-helper-container[data-theme="dark"]{
    --jfk-bg-1:#0b1220;
    --jfk-bg-2:#0f1724;
    --jfk-border:rgba(255,255,255,0.06);
    --jfk-text:#e6e7eb;
    --jfk-sub:#9aa6b2;
  }
  
  .loadout-helper-container{
    position:absolute;top:0;left:100%;margin-left:10px;
    width:320px;max-width:320px;z-index:9999;
    font-family:Inter,system-ui,sans-serif;color:var(--jfk-text);
    font-size:12.5px;pointer-events:auto;box-sizing:border-box;
  }
  .loadout-helper-layout-container{
    background:linear-gradient(180deg,var(--jfk-bg-2),var(--jfk-bg-1));
    border:1px solid var(--jfk-border);border-radius:10px;
    padding:.5rem .65rem;box-shadow:0 6px 16px rgba(2,6,23,.45);
    max-height:68vh;overflow:auto;
    scrollbar-width:thin;
    scrollbar-color:#2b2f3a rgba(255,255,255,0.03);
  }
  .loadout-helper-layout-container::-webkit-scrollbar{ width:6px;height:6px; }
  .loadout-helper-layout-container::-webkit-scrollbar-track{ background:rgba(255,255,255,0.03);border-radius:6px; }
  .loadout-helper-layout-container::-webkit-scrollbar-thumb{
    background:linear-gradient(180deg,#2a2f3a,#3a4250);
    border-radius:6px; box-shadow:inset 0 0 2px rgba(255,255,255,0.05);
  }
  
  /* Header & title */
  .loadout-helper-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
  .loadout-helper-title{font-size:13px;font-weight:700;color:var(--jfk-text);}
  .loadout-helper-container[data-theme="light"] .loadout-helper-title{color:#1f2937;} /* darker name on light */
  
  /* Status */
  .loadout-helper-status{
    display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 6px;border-radius:999px;
    border:1px solid var(--jfk-border);
    background:rgba(255,255,255,0.05);
  }
  .loadout-helper-status.ok{color:#9ae6b4;background:rgba(16,185,129,0.10);}
  .loadout-helper-status.fail{color:#fecaca;background:rgba(239,68,68,0.10);}
  .loadout-helper-status.warn{color:#fef3c7;background:rgba(250,204,21,0.12);}
  
  .loadout-helper-empty{
    border:1px dashed var(--jfk-border);
    padding:.4rem .6rem;border-radius:8px;font-size:12px;color:var(--jfk-sub);margin-top:4px;
  }
  .loadout-helper-pill{display:inline-block;border-radius:999px;border:1px solid var(--jfk-border);padding:0 6px;font-size:11px;margin-left:4px;}
  
  /* Cards */
  .loadout-helper-weapon-info,.loadout-helper-armor-info{
    border:1px solid var(--jfk-border);
    border-radius:8px;
    background:rgba(255,255,255,0.03);
    padding:.4rem .5rem;margin-bottom:.4rem;
  }
  
  /* Gear text — keep same look */
  .loadout-helper-weapon-slot,.loadout-helper-armor-slot{
    font-size:12.5px;font-weight:600;margin-bottom:2px;display:flex;justify-content:space-between;color:var(--jfk-text);
  }
  .loadout-helper-weapon-damage,.loadout-helper-armor-armor{
    font-size:12px;border-bottom:1px solid var(--jfk-border);margin-bottom:4px;padding-bottom:3px;color:var(--jfk-text);
  }
  .loadout-helper-weapon-bonus-name,.loadout-helper-armor-bonus-name{
    font-weight:600;font-size:12px;margin:0;display:flex;align-items:center;gap:4px;color:var(--jfk-text);
  }
  .loadout-helper-weapon-bonus-value,.loadout-helper-armor-bonus-value{
    margin:0;font-size:11.5px;color:var(--jfk-sub);padding-left:4px;
  }
  .loadout-helper-weapon-bonus-type{
    font-size:10.5px;color:var(--jfk-sub);
    background:rgba(255,255,255,0.06);
    border-radius:999px;padding:0 5px;
  }
  
  /* Level badge */
  .loadout-helper-level{
    display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;font-size:11px;font-weight:600;
    color:var(--jfk-text);
    background:rgba(255,255,255,0.08);
    border:1px solid var(--jfk-border);
  }
  .loadout-helper-container[data-theme="light"] .loadout-helper-level{
    color:#1f2937;
    background:rgba(255,255,255,0.12);
  }
  
  /* Tabs & snapshot line */
  .loadout-helper-tabs{ display:flex; gap:6px; flex-wrap:wrap; margin:6px 0 4px 0; }
  .loadout-helper-tab{
    cursor:pointer; user-select:none;
    padding:2px 8px; border-radius:999px; font-size:11px;
    border:1px solid var(--jfk-border);
    background:rgba(255,255,255,0.04);
    color:var(--jfk-text); transition:opacity .15s ease, background .15s ease;
  }
  .loadout-helper-container[data-theme="light"] .loadout-helper-tab{color:#1f2937;}
  .loadout-helper-tab.active{
    background:rgba(255,255,255,0.08);
    border-color:rgba(255,255,255,0.20);
  }
  .loadout-helper-subtle{ font-size:11px; color:var(--jfk-sub); margin-left:8px; }
  .loadout-helper-container[data-theme="light"] .loadout-helper-subtle{color:#374151;}
  
  @media (max-width:1100px){.loadout-helper-container{width:300px;max-width:300px;}}
  @media (max-width:980px){.loadout-helper-container{position:absolute;left:50%;transform:translateX(-50%);margin-left:0;width:92vw;max-width:92vw;}}
  `;



    function ensureStyle() {
        if (document.getElementById('jfk-loadout-style')) return;
        const s = document.createElement('style');
        s.id = 'jfk-loadout-style';
        s.textContent = styles;
        document.head.appendChild(s);
    }

    function getDefenderNameFromDOM() {
        const els = Array.from(document.querySelectorAll('span.user-name, span[class*="userName"], span[class*="user-name"]'));
        return els[1]?.textContent?.trim() || null;
    }
    function getUser2IdFromUrl() {
        try {
            const u = new URL(location.href);
            const v = u.searchParams.get('user2ID');
            return v ? Number(v) : null;
        } catch { return null; }
    }

    /* ======================== Theme detection ======================== */
    function parseRGB(rgb) {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb || "");
        return m ? [+m[1], +m[2], +m[3]] : null;
    }
    function relLuma([r, g, b]) {
        const nl = v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const R = nl(r), G = nl(g), B = nl(b);
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    function detectTornTheme() {
        const body = document.body;
        const html = document.documentElement;
        const cls = `${body?.className || ""} ${html?.className || ""}`.toLowerCase();
        const dt = (body?.getAttribute("data-theme") || html?.getAttribute("data-theme") || "").toLowerCase();
        if (/\bdark\b/.test(cls) || dt === "dark") return "dark";
        if (/\blight\b/.test(cls) || dt === "light") return "light";

        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")?.matches;

        const bodyStyle = getComputedStyle(body);
        const htmlStyle = getComputedStyle(html);
        const bg = bodyStyle.backgroundColor || htmlStyle.backgroundColor;
        const rgb = parseRGB(bg);
        if (rgb) {
            const L = relLuma(rgb);
            return L < 0.35 ? "dark" : "light";
        }
        return prefersDark ? "dark" : "light";
    }
    function observeThemeChanges(onChange) {
        const cb = () => onChange(detectTornTheme());
        const opts = { attributes: true, attributeFilter: ["class", "data-theme"] };
        try { new MutationObserver(cb).observe(document.documentElement, opts); } catch { }
        try { new MutationObserver(cb).observe(document.body, opts); } catch { }
        try {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = () => cb();
            mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
        } catch { }
    }

    /* ======================== Rendering ======================== */
    function renderRightPanel(weapons, armours, meta = {}, opts = {}) {
        ensureStyle();
        const defenderContainer = document.querySelector('div[class^="playersModelWrap"]');
        if (!defenderContainer) return false;

        let mount = defenderContainer.querySelector('.loadout-helper-container');
        if (!mount) {
            mount = document.createElement('div');
            mount.className = 'loadout-helper-container';
            if (!/(relative|absolute|fixed)/.test(defenderContainer.style.position)) {
                defenderContainer.style.position = 'relative';
            }
            defenderContainer.appendChild(mount);
        }
        // THEME: set and observe
        const setThemeAttr = (t) => {
            mount.setAttribute("data-theme", t === "light" ? "light" : "dark");
        };
        setThemeAttr(detectTornTheme());
        if (!mount._jfkThemeHooked) {
            mount._jfkThemeHooked = true;
            observeThemeChanges(setThemeAttr);
        }

        mount.innerHTML = '';

        // Header
        const header = document.createElement('div');
        header.className = 'loadout-helper-header';

        const title = document.createElement('div');
        title.className = 'loadout-helper-title';
        const whoName = meta?.name || getDefenderNameFromDOM() || 'Defender';
        const nameEl = document.createElement('span');
        nameEl.textContent = whoName;
        title.appendChild(nameEl);

        const lvl = (meta && typeof meta.level !== 'undefined') ? meta.level : null;
        if (lvl !== null && lvl !== undefined && lvl !== '' && !Number.isNaN(Number(lvl))) {
            const lvlEl = document.createElement('span');
            lvlEl.className = 'loadout-helper-level';
            lvlEl.textContent = `Lv ${lvl}`;
            title.appendChild(lvlEl);
        }

        header.appendChild(title);
        if (DEBUG_VIEW) {
            const status = document.createElement('div');
            status.className = 'loadout-helper-status';
            status.id = 'jfk-loadout-status';
            status.textContent = 'idle';
            header.appendChild(status);
        }
        mount.appendChild(header);

        // Optional: time-ago hint for the currently shown snapshot
        const subline = document.createElement('div');
        subline.className = 'loadout-helper-subtle';

        // Tabs (optional)
        const snapshots = Array.isArray(opts.snapshots) ? opts.snapshots.slice(0, HISTORY_LIMIT) : null;
        let currentIdx = 0; // default newest
        let currentSnap = null;

        if (SHOW_HISTORY_TABS && snapshots && snapshots.length > 1) {
            const tabs = document.createElement('div');
            tabs.className = 'loadout-helper-tabs';

            snapshots.forEach((snap, idx) => {
                const btn = document.createElement('div');
                btn.className = 'loadout-helper-tab' + (idx === 0 ? ' active' : '');
                const labelIndex = idx + 1; // newest is 1
                btn.textContent = `Loadout ${labelIndex}`;
                const when = timeAgoFromEpoch(snap?.context?.captured_at);
                btn.title = when || '';
                btn.addEventListener('click', () => {
                    if (currentIdx === idx) return;
                    currentIdx = idx;
                    for (const el of tabs.children) el.classList.remove('active');
                    btn.classList.add('active');
                    paintForSnapshot(snapshots[currentIdx]);
                });
                tabs.appendChild(btn);
            });

            mount.appendChild(tabs);
            mount.appendChild(subline); // show hint below tabs
        } else {
            // if no tabs but we still want the subline
            mount.appendChild(subline);
        }

        const layout = document.createElement('div');
        layout.className = 'loadout-helper-layout-container';
        mount.appendChild(layout);

        // painter: draws weapons + armour into the layout
        function paint(weaponsList, armourList) {
            layout.innerHTML = '';
            const haveItems = (weaponsList && weaponsList.length) || (armourList && armourList.length);

            if (!haveItems && !DEBUG_VIEW && !opts.forceShow) return false;

            if (!haveItems && (DEBUG_VIEW || opts.forceShow)) {
                const box = document.createElement('div');
                box.className = 'loadout-helper-empty';
                const who = meta.name || getDefenderNameFromDOM() || 'Defender';
                const badge = opts.dummy ? '<span class="loadout-helper-pill">dummy</span>' : '<span class="loadout-helper-pill">debug</span>';
                box.innerHTML = `<strong>${who}</strong>${badge}<br>${opts.dummy ? 'Showing dummy gear loadout.' : 'No loadout items detected yet — waiting for attackData or hidden slots.'}`;
                layout.appendChild(box);
                return true;
            }

            (weaponsList || []).forEach((w) => {
                const wrap = document.createElement('div');
                wrap.className = `loadout-helper-weapon-info ${w.glowClass || ''}`;

                const slot = document.createElement('p');
                slot.className = 'loadout-helper-weapon-slot';
                slot.textContent = `${w.name}`;
                wrap.appendChild(slot);

                const dmg = document.createElement('p');
                dmg.className = 'loadout-helper-weapon-damage';
                dmg.textContent = `Dmg ${w.dmg ?? '—'} | Acc ${w.acc ?? '—'} | Q ${w.quality ?? 'N/A'}`;
                wrap.appendChild(dmg);

                if (w.bonuses?.length) {
                    for (const b of w.bonuses) {
                        const head = document.createElement('p');
                        head.className = 'loadout-helper-weapon-bonus-name';
                        head.innerHTML = `${b.title}${b.value ? ` (${b.value})` : ''} <span class="loadout-helper-weapon-bonus-type">(Bonus)</span>`;
                        wrap.appendChild(head);
                        if (b.desc) {
                            const val = document.createElement('p');
                            val.className = 'loadout-helper-weapon-bonus-value';
                            val.textContent = b.desc;
                            wrap.appendChild(val);
                        }
                    }
                }

                if (w.upgrades?.length) {
                    for (const u of w.upgrades) {
                        const head = document.createElement('p');
                        head.className = 'loadout-helper-weapon-bonus-name';
                        head.textContent = u.title || 'Attachment';
                        wrap.appendChild(head);
                        if (u.desc) {
                            const val = document.createElement('p');
                            val.className = 'loadout-helper-weapon-bonus-value';
                            val.textContent = u.desc;
                            wrap.appendChild(val);
                        }
                    }
                }

                layout.appendChild(wrap);
            });

            (armourList || []).forEach((a) => {
                const wrap = document.createElement('div');
                wrap.className = `loadout-helper-armor-info ${a.glowClass || ''}`;
                const slot = document.createElement('p');
                slot.className = 'loadout-helper-armor-slot';
                slot.textContent = `${a.name}`;
                wrap.appendChild(slot);
                if (a.bonuses?.length) {
                    for (const b of a.bonuses) {
                        const head = document.createElement('p');
                        head.className = 'loadout-helper-armor-bonus-name';
                        head.textContent = `${b.title}${b.value ? ` (${b.value})` : ''}`;
                        wrap.appendChild(head);
                        if (b.desc) {
                            const val = document.createElement('p');
                            val.className = 'loadout-helper-armor-bonus-value';
                            val.textContent = b.desc;
                            wrap.appendChild(val);
                        }
                    }
                }
                layout.appendChild(wrap);
            });

            return true;
        }

        // painter specifically for a stored snapshot (from history)
        function paintForSnapshot(snap) {
            currentSnap = snap || null;
            const w = Array.isArray(snap?.weapons) ? snap.weapons : weapons;
            const a = Array.isArray(snap?.armour) ? snap.armour : armours;
            paint(w, a);
            // subline content (time-ago)
            const when = snap?.context?.captured_at ? timeAgoFromEpoch(snap.context.captured_at) : null;
            subline.textContent = when ? `Snapshot: ${when}` : '';
        }

        // Initial paint
        if (snapshots && snapshots.length > 0) {
            paintForSnapshot(snapshots[0]); // newest
        } else {
            paint(weapons, armours);
            const when = opts?.captured_at ? timeAgoFromEpoch(opts.captured_at) : null;
            subline.textContent = when ? `Snapshot: ${when}` : '';
        }

        if (opts.status) {
            updateStatusBadge(opts.status);
        } else {
            const last = GM_getValue('JFK_LOADOUT_LAST_STATUS', null);
            if (last) updateStatusBadge(last);
        }

        return true;
    }

    function updateStatusBadge(obj) {
        if (!DEBUG_VIEW) return;
        try {
            const el = document.querySelector('#jfk-loadout-status');
            if (!el) return;
            const when = new Date(obj.at || Date.now()).toLocaleTimeString();
            const state = (obj.state || 'idle').toLowerCase();
            el.textContent = `${state} @ ${when}`;
            el.classList.remove('ok', 'fail', 'warn');
            if (state === 'posted') el.classList.add('ok');
            else if (state === 'failed') el.classList.add('fail');
            else if (state === 'deduped' || state === 'no-items' || state === 'await-start') el.classList.add('warn');
            GM_setValue('JFK_LOADOUT_LAST_STATUS', { state, at: (obj.at || Date.now()) });
        } catch { }
    }

    /* ======================== Payload + dedupe ======================== */
    function buildPayload(json) {
        const DB = json?.DB || {};
        // Torn has changed attackData shapes a few times; be generous with key names.
        // We only need: defender user + defender item slots.
        const defenderUser = pickFirstObj(
            DB.defenderUser,
            DB.defender_user,
            DB.opponentUser,
            DB.opponent_user,
            DB.targetUser,
            DB.target_user,
            DB.defender,
            DB.opponent,
            DB.target,
        );

        const rawDefenderItems = pickFirstObj(
            DB.defenderItems,
            DB.defender_items,
            DB.opponentItems,
            DB.opponent_items,
            DB.targetItems,
            DB.target_items,
            DB.defenderGear,
            DB.opponentGear,
            DB.targetGear,
            DB.defender_items_map,
        );
        const defenderItems = isObj(rawDefenderItems?.items) ? rawDefenderItems.items : rawDefenderItems;

        const fallbackId = getUser2IdFromUrl();
        const defender = {
            user_id: toNumber(defenderUser?.ID ?? defenderUser?.id) ?? fallbackId ?? null,
            name: defenderUser?.name ?? getDefenderNameFromDOM() ?? null,
            level: toNumber(defenderUser?.level),
            faction_id: toNumber(defenderUser?.factionID ?? defenderUser?.faction_id),
            faction_name: defenderUser?.faction ?? null,
        };

        const weapons = [];
        const armours = [];

        for (const slotKey in defenderItems) {
            const slot = defenderItems[slotKey];
            // Torn sometimes returns slot.item as array or object depending on loader payload.
            const it = Array.isArray(slot?.item) ? slot.item[0] : slot?.item;
            if (!it) continue;

            if (WEAPON_KEYS.has(slotKey)) {
                const w = mapWeapon(it);
                if (w) weapons.push({ slot_key: slotKey, slot: WEAPON_SLOTS[slotKey] || `Weapon-${slotKey}`, ...w });
            }
            if (ARMOUR_KEYS.has(slotKey)) {
                const a = mapArmour(it);
                if (a) armours.push({ slot_key: slotKey, ...a });
            }
        }

        weapons.sort((a, b) => (a.slot_key || '').localeCompare(b.slot_key || '') || (a.name || '').localeCompare(b.name || ''));
        armours.sort((a, b) => (a.slot_key || '').localeCompare(b.slot_key || '') || (a.name || '').localeCompare(b.name || ''));

        const attackId =
            json?.attack_id ??
            json?.DB?.attack_id ??
            json?.DB?.attackDisplay?.id ??
            json?.DB?.attack_display?.id ??
            null;

        return {
            context: {
                attack_id: toNumber(attackId),
                captured_at: Math.floor(Date.now() / 1000),
                page: 'loader.php?sid=attack',
            },
            defender,
            weapons,
            armour: armours,
        };
    }

    /**
     * Try to build a loadout payload from non-attack contexts (e.g. gunshop spy).
     * We intentionally do NOT render UI for these; we only POST to backend when we can extract items.
     */
    function tryBuildPayloadFromAny(json, { page = null } = {}) {
        try {
            if (!json) return null;
            // If it already looks like our payload shape, accept it.
            if (json?.defender?.user_id && json?.context?.captured_at) {
                return json;
            }

            // Most Torn loader payloads use the same "DB" shape.
            if (json?.DB) {
                const p = buildPayload(json);
                if (p?.defender?.user_id) {
                    if (page) p.context.page = page;
                    return p;
                }
            }

            // Some pages may return the "DB" object directly.
            if (json?.defenderUser || json?.defenderItems || json?.defender_user || json?.defender_items) {
                const p = buildPayload({ DB: json });
                if (p?.defender?.user_id) {
                    if (page) p.context.page = page;
                    return p;
                }
            }

            // Last resort: scan the payload for something that looks like a defenderItems slot map.
            // This helps when Torn changes key names for gunshop spy payloads.
            const found = findSlotMapInObject(json);
            if (found?.defenderItems) {
                const p = buildPayload({ DB: { defenderUser: found.defenderUser || {}, defenderItems: found.defenderItems } });
                if (p?.defender?.user_id) {
                    if (page) p.context.page = page;
                    return p;
                }
            }
        } catch (e) {
            log('tryBuildPayloadFromAny error:', e?.message || e);
        }
        return null;
    }

    function looksLikeSlotMap(obj) {
        if (!isObj(obj)) return false;
        // Must contain at least 2 known slot keys
        const keys = Object.keys(obj);
        let hits = 0;
        for (const k of keys) {
            if (WEAPON_KEYS.has(k) || ARMOUR_KEYS.has(k)) hits++;
        }
        if (hits < 2) return false;
        // And at least one slot should contain an item object/array with a name.
        for (const k of keys) {
            if (!(WEAPON_KEYS.has(k) || ARMOUR_KEYS.has(k))) continue;
            const slot = obj[k];
            const it = Array.isArray(slot?.item) ? slot.item[0] : slot?.item;
            const name = it?.name;
            if (name && typeof name === 'string' && name.toLowerCase() !== 'unknown') return true;
        }
        return false;
    }

    function findSlotMapInObject(root) {
        // BFS with depth/size caps to avoid heavy scans.
        const MAX_NODES = 2500;
        const q = [{ v: root, d: 0 }];
        let nodes = 0;
        while (q.length) {
            const { v, d } = q.shift();
            if (!isObj(v) || d > 8) continue;
            nodes++;
            if (nodes > MAX_NODES) break;

            // Direct slot map?
            if (looksLikeSlotMap(v)) {
                return { defenderItems: v, defenderUser: null };
            }

            // Common container shapes: { defenderItems: {...}, defenderUser: {...} }
            if (looksLikeSlotMap(v.defenderItems || v.defender_items || v.opponentItems || v.opponent_items || v.targetItems || v.target_items)) {
                return {
                    defenderItems: v.defenderItems || v.defender_items || v.opponentItems || v.opponent_items || v.targetItems || v.target_items,
                    defenderUser: v.defenderUser || v.defender_user || v.opponentUser || v.opponent_user || v.targetUser || v.target_user || null,
                };
            }

            for (const k of Object.keys(v)) {
                const child = v[k];
                if (isObj(child)) q.push({ v: child, d: d + 1 });
            }
        }
        return null;
    }

    function djb2(str) { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i); return (h >>> 0).toString(16); }
    function stableSig(payload) {
        const norm = {
            user_id: payload?.defender?.user_id ?? null,
            name: payload?.defender?.name ?? null,
            weapons: (payload?.weapons || []).map(w => ({
                slot_key: w.slot_key, slot: w.slot, name: w.name, dmg: w.dmg, acc: w.acc, quality: w.quality, type: w.type,
                bonuses: (w.bonuses || []).map(b => ({ title: b.title, value: b.value, desc: b.desc })),
                upgrades: (w.upgrades || []).map(u => ({ title: u.title, desc: u.desc }))
            })),
            armour: (payload?.armour || []).map(a => ({
                slot_key: a.slot_key, name: a.name, defense: a.defense, type: a.type,
                bonuses: (a.bonuses || []).map(b => ({ title: b.title, value: b.value, desc: b.desc }))
            })),
            dummy: !!payload?.context?.debug_dummy,
        };
        return djb2(JSON.stringify(norm));
    }
    const lastSigKey = (userId) => `JFK_LOADOUT_LASTSIG_${userId || 'unknown'}`;
    const lastPostKey = (userId) => `JFK_LOADOUT_LASTPOST_${userId || 'unknown'}`; // epoch seconds
    const DEDUPE_WINDOW_SEC = 86400; // 24 hours: allow reposting same loadout after this to refresh "last seen"

    function summarizeBody(body) {
        try {
            const d = typeof body === 'string' ? JSON.parse(body) : body;
            return {
                defender: { user_id: d.defender?.user_id ?? null, name: d.defender?.name ?? null },
                weapons: (d.weapons || []).map(w => ({ slot: w.slot, name: w.name, dmg: w.dmg, acc: w.acc })),
                armour: (d.armour || []).map(a => ({ slot_key: a.slot_key, name: a.name })),
                attack_id: d.context?.attack_id ?? null,
                debug_dummy: !!d.context?.debug_dummy,
            };
        } catch {
            return { length: ('' + body).length || null };
        }
    }

    async function maybeSend(payload) {
        const haveItems = (payload.weapons && payload.weapons.length) || (payload.armour && payload.armour.length);
        if (!AUTO_PUSH) { log('AUTO_PUSH off'); updateStatusBadge({ state: 'auto-off', at: Date.now() }); return; }
        if (!haveItems) { log('No items, nothing to send'); updateStatusBadge({ state: 'no-items', at: Date.now() }); return; }

        const attackId = payload?.context?.attack_id ?? null;
        if (attackId != null) {
            if (postedForAttackId.has(attackId)) {
                log('Skipping send: already posted for attack_id', attackId);
                updateStatusBadge({ state: 'deduped', at: Date.now() }); return;
            }
        }

        const uid = payload?.defender?.user_id || 'unknown';
        const sig = stableSig(payload);
        if (DEDUPE_LOCAL) {
            const key = lastSigKey(uid);
            const prev = GM_getValue(key, '');
            if (prev === sig) {
                const nowSec = Math.floor(Date.now() / 1000);
                const lastPostSec = Number(GM_getValue(lastPostKey(uid), 0) || 0);
                const ageSec = lastPostSec > 0 ? (nowSec - lastPostSec) : null;

                // If within 24h, do nothing.
                if (ageSec != null && ageSec < DEDUPE_WINDOW_SEC) {
                    log('No change in gear signature (within 24h) → not posting.', { user: uid, sig, ageSec });
                    updateStatusBadge({ state: 'deduped', at: Date.now() });
                    return;
                }

                // After 24h, do NOT re-send the whole loadout. Just "touch" the existing snapshot so
                // the UI can show an updated "last spied" date without storing duplicates.
                log('Same gear signature but older than 24h (or unknown last post) → touching backend date only.', { user: uid, sig, ageSec });
                try {
                    await apiPOST(TOUCH_ENDPOINT, {
                        user_id: Number(uid),
                        sig,
                        captured_at: nowSec,
                        name: payload?.defender?.name ?? null,
                        faction_id: payload?.defender?.faction_id ?? null,
                        faction_name: payload?.defender?.faction_name ?? null,
                    });
                    GM_setValue(lastPostKey(uid), nowSec);
                    updateStatusBadge({ state: 'touched', at: Date.now() });
                    return;
                } catch (e) {
                    // If touch fails (older backend), fall back to posting.
                    log('Touch failed; falling back to full POST:', e?.message || e);
                }
            }
            GM_setValue(key, sig); // optimistic
        }

        log('Attempting to POST loadout', { user: uid, sig, summary: summarizeBody(payload) });
        updateStatusBadge({ state: 'sending', at: Date.now() });

        try {
            const res = await apiPOST(LOADOUT_ENDPOINT, payload);
            log('Posted loadout snapshot (backend response):', res);
            updateStatusBadge({ state: 'posted', at: Date.now() });
            if (attackId != null) postedForAttackId.add(attackId);
            if (DEDUPE_LOCAL) {
                GM_setValue(lastPostKey(uid), Math.floor(Date.now() / 1000));
            }
        } catch (e) {
            try {
                if (DEDUPE_LOCAL) {
                    const key = lastSigKey(uid);
                    if (GM_getValue(key, '') === sig) GM_setValue(key, '');
                }
            } catch { }
            log('Push failed:', e?.message || e);
            updateStatusBadge({ state: 'failed', at: Date.now() });
            console.warn('[JFK-LOADOUT] Push failed:', e?.message || e);
        }
    }

    /* ======================== Backend fallback ======================== */
    async function fetchLatestSnapshotForUser(userId) {
        if (!FALLBACK_TO_BACKEND || !userId) return null;
        try {
            const res = await apiGET('/loadouts/recent', { user_id: Number(userId), limit: 1 });
            const rows = Array.isArray(res) ? res : (Array.isArray(res?.rows) ? res.rows : []);
            return rows?.[0] || null;
        } catch (e) {
            log('fallback: backend fetch failed', e?.message || e);
            return null;
        }
    }
    function snapshotToClientLists(snapshot) {
        if (!snapshot) return { weapons: [], armour: [], defender: {} };
        const weapons = Array.isArray(snapshot.weapons) ? snapshot.weapons : [];
        const armour = Array.isArray(snapshot.armour) ? snapshot.armour : [];
        const defender = snapshot.defender || {};
        return { weapons, armour, defender };
    }
    function makeDummyPayload() {
        const name = getDefenderNameFromDOM() || 'Unknown';
        const user_id = getUser2IdFromUrl() || null;
        const weapons = [{
            slot_key: '1', slot: 'Primary', name: 'ArmaLite M-15A44', dmg: 80.21, acc: 64.064, quality: 'N/A', glowClass: '', type: 'primary',
            bonuses: [{ title: 'Powerful', value: '23', desc: '23% increased damage' }, { title: 'Assassinate', value: '51', desc: '51% increased damage on the first turn' }],
            upgrades: [{ title: 'Reflex Sight', desc: '+1.00 Accuracy' }, { title: '5mW Laser', desc: '+3% critical hit rate' }],
        }, {
            slot_key: '3', slot: 'Melee', name: 'Pillow', dmg: 1.65, acc: 65.2715, quality: 'N/A', glowClass: '', type: 'melee',
            bonuses: [], upgrades: [],
        }];
        const armours = [{
            slot_key: '9', name: 'Delta Body', glowClass: '', type: 'body', defense: null,
            bonuses: [{ title: 'Invulnerable', value: '9', desc: '9% reduced negative status effects' }],
        }];
        return {
            context: { attack_id: null, captured_at: Math.floor(Date.now() / 1000), page: 'loader.php?sid=attack', debug_dummy: true },
            defender: { user_id, name, level: null, faction_id: null, faction_name: null },
            weapons, armour: armours,
        };
    }

    /* ======================== Start/Join watcher ======================== */
    function isStartJoinButton(el) {
        if (!el || el.tagName !== 'BUTTON') return false;
        const t = (el.textContent || '').toLowerCase();
        return /\b(start|join)\s+fight\b/.test(t);
    }
    function findStartJoinButtons() {
        const btns = Array.from(document.querySelectorAll('button[type="submit"], button'));
        return btns.filter(isStartJoinButton);
    }
    function armAwaitReadable() {
        if (AWAIT_READABLE_AFTER_START) return;
        AWAIT_READABLE_AFTER_START = true;
        updateStatusBadge({ state: 'await-start', at: Date.now() });
        clearTimeout(AWAIT_TIMER);
        AWAIT_TIMER = setTimeout(() => {
            AWAIT_READABLE_AFTER_START = false;
            updateStatusBadge({ state: 'timeout', at: Date.now() });
        }, AWAIT_WINDOW_MS);
    }
    function disarmAwaitReadable() {
        AWAIT_READABLE_AFTER_START = false;
        clearTimeout(AWAIT_TIMER);
        AWAIT_TIMER = null;
    }
    function hookStartJoinButtons() {
        // Attach click handlers once; if DOM re-renders we’ll re-run from observers below
        for (const btn of findStartJoinButtons()) {
            if (btn.dataset.jfkStartHook === '1') continue;
            btn.dataset.jfkStartHook = '1';
            btn.addEventListener('click', () => {
                log('Start/Join clicked → arming post-after-start');
                armAwaitReadable();
                // Also detect disappearance shortly after (hotkeys / other UI paths)
                setTimeout(() => {
                    if (!findStartJoinButtons().length) {
                        log('Start/Join button disappeared → still armed');
                    }
                }, 800);
            }, { once: true });
        }
    }
    function observeStartJoinPresence() {
        const root = document.body;
        const mo = new MutationObserver(() => hookStartJoinButtons());
        mo.observe(root, { childList: true, subtree: true });
        hookStartJoinButtons(); // initial pass
    }

    /* ======================== Fetch interception ======================== */
    (function hookFetch() {
        const waitForFetch = () => {
            const orig = unsafeWindow?.fetch;
            if (typeof orig !== 'function') return void setTimeout(waitForFetch, 120);
            const bound = orig.bind(unsafeWindow);

            unsafeWindow.fetch = async (...args) => {
                const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
                const isAttackData = url.includes('/loader.php?sid=attackData');
                const isLoaderSid = /\/loader\.php\?sid=/i.test(url);
                const maybeSpyRelevant =
                    !isAttackData &&
                    (isLoaderSid || /spy|gunshop|shop|loadout|equipment/i.test(url));

                const res = await bound(...args);

                if (isAttackData) {
                    const cloned = res.clone();
                    cloned.json().then((json) => {
                        setTimeout(async () => {
                            try {
                                const payload = buildPayload(json);
                                const haveItems = (payload.weapons && payload.weapons.length) || (payload.armour && payload.armour.length);

                                // If no items yet, set up Start/Join watcher and render history/fallback UI
                                if (!haveItems) {
                                    observeStartJoinPresence();
                                    if (!findStartJoinButtons().length) armAwaitReadable();

                                    const uid = payload?.defender?.user_id || getUser2IdFromUrl() || null;
                                    let snaps = [];
                                    if (uid && FALLBACK_TO_BACKEND) {
                                        try {
                                            snaps = await fetchAllSnapshotsForUser(uid, { limit: HISTORY_LIMIT, groupByAttack: false });
                                        } catch { }
                                    }

                                    // Debug: force a dummy loadout panel (and optionally POST) even when Torn won't reveal gear yet.
                                    // This helps validate "loader-only" posting without needing to Start/Join.
                                    if (DUMMY_ON_EMPTY) {
                                        const dummy = makeDummyPayload();
                                        // ensure we keep the same user_id if Torn provided it
                                        if (uid && dummy?.defender) dummy.defender.user_id = Number(uid);
                                        if (payload?.defender?.name && dummy?.defender) dummy.defender.name = payload.defender.name;
                                        dummy.context.page = location.pathname + location.search;

                                        renderRightPanel(dummy.weapons, dummy.armour, dummy.defender, {
                                            forceShow: true,
                                            dummy: true,
                                            status: { state: POST_DUMMY ? 'dummy-posting' : 'dummy', at: Date.now() },
                                        });

                                        if (POST_DUMMY) {
                                            await maybeSend(dummy);
                                        }
                                        return;
                                    }

                                    if (snaps && snaps.length > 0) {
                                        const newest = snaps[0];
                                        const { weapons: fw, armour: fa, defender: fdef } = snapshotToClientLists(newest);
                                        renderRightPanel(fw, fa, fdef, {
                                            forceShow: true,
                                            snapshots: snaps,
                                            status: { state: 'fallback', at: Date.now() },
                                        });
                                    } else if (DEBUG_VIEW) {
                                        // debug: explicit empty panel
                                        renderRightPanel([], [], {}, { forceShow: true, status: { state: 'debug-empty', at: Date.now() } });
                                    } else {
                                        hideRightPanel();
                                    }

                                    return;
                                }

                                // We have items:
                                if (AWAIT_READABLE_AFTER_START) {
                                    log('Readable gear detected after start/join → posting once');
                                    disarmAwaitReadable();
                                }

                                // Pull history (so tabs show in normal path too)
                                let historySnaps = [];
                                if (SHOW_HISTORY_TABS) {
                                    const uid = payload?.defender?.user_id || null;
                                    if (uid && FALLBACK_TO_BACKEND) {
                                        try {
                                            historySnaps = await fetchAllSnapshotsForUser(uid, { limit: HISTORY_LIMIT, groupByAttack: false });
                                        } catch { }
                                    }
                                }

                                renderRightPanel(payload.weapons, payload.armour, payload.defender, {
                                    snapshots: historySnaps && historySnaps.length > 0 ? historySnaps : undefined,
                                    captured_at: payload?.context?.captured_at,
                                });

                                await maybeSend(payload);

                            } catch (e) {
                                console.warn('[JFK-LOADOUT] Build/render error:', e);
                                if (DEBUG_VIEW) renderRightPanel([], [], {}, { forceShow: true });
                                updateStatusBadge({ state: 'render-error', at: Date.now() });
                            }
                        }, 100);
                    }).catch(() => {
                        if (DEBUG_VIEW) {
                            log('attackData parse failed; showing placeholder.');
                            renderRightPanel([], [], {}, { forceShow: true });
                            updateStatusBadge({ state: 'parse-failed', at: Date.now() });
                        }
                    });
                }
                // gunshop / spy / other contexts: attempt extract + POST only (no UI)
                else if (maybeSpyRelevant) {
                    try {
                        const cloned = res.clone();
                        // Some endpoints lie about content-type; use a cheap text guard then parse.
                        cloned.text().then(async (txt) => {
                            if (!txt || typeof txt !== 'string') return;
                            const t0 = txt.trim();
                            if (!(t0.startsWith('{') || t0.startsWith('['))) return;
                            // avoid accidentally parsing massive pages
                            if (t0.length > 5_000_000) return;
                            const json = safeJsonParse(t0);
                            if (!json) return;
                            const payload = tryBuildPayloadFromAny(json, { page: location.pathname + location.search });
                            if (!payload) return;
                            // Ensure page context for non-attack sources
                            payload.context = payload.context || {};
                            if (!payload.context.captured_at) payload.context.captured_at = Math.floor(Date.now() / 1000);
                            if (!payload.context.page) payload.context.page = location.pathname + location.search;
                            // Do not post dummies; only when we can extract items
                            await maybeSend(payload);
                        }).catch(() => { /* ignore */ });
                    } catch { /* ignore */ }
                }

                return res;
            };

            log('attackData hook installed (full logic).');
        };
        waitForFetch();
    })();

    /* ======================== XHR interception (gunshop spy often uses XHR) ======================== */
    (function hookXHR() {
        const XHR = unsafeWindow?.XMLHttpRequest;
        if (!XHR || !XHR.prototype) return;

        const origOpen = XHR.prototype.open;
        const origSend = XHR.prototype.send;

        XHR.prototype.open = function (method, url, ...rest) {
            try { this._jfk_url = url; } catch { }
            return origOpen.call(this, method, url, ...rest);
        };

        XHR.prototype.send = function (body) {
            try {
                this.addEventListener('load', () => {
                    try {
                        const url = this.responseURL || this._jfk_url || '';
                        if (!url || !/spy|gunshop|shop|loadout|equipment/i.test(url)) return;
                        const text = this.responseText;
                        if (!text || typeof text !== 'string') return;
                        // quick JSON guard
                        const t0 = text.trim();
                        if (!(t0.startsWith('{') || t0.startsWith('['))) return;
                        const json = JSON.parse(text);
                        const payload = tryBuildPayloadFromAny(json, { page: location.pathname + location.search });
                        if (!payload) return;
                        payload.context = payload.context || {};
                        if (!payload.context.captured_at) payload.context.captured_at = Math.floor(Date.now() / 1000);
                        if (!payload.context.page) payload.context.page = location.pathname + location.search;
                        // Fire and forget; do not block XHR handlers
                        maybeSend(payload).catch(() => { });
                    } catch { /* ignore */ }
                });
            } catch { /* ignore */ }
            return origSend.call(this, body);
        };
    })();

    // Restore last status
    try {
        const last = GM_getValue('JFK_LOADOUT_LAST_STATUS', null);
        if (last && typeof last === 'object') log('Restored last status from storage', last);
    } catch { }

    function hideRightPanel() {
        const defenderContainer = document.querySelector('div[class^="playersModelWrap"]');
        const mount = defenderContainer?.querySelector('.loadout-helper-container');
        if (mount) mount.remove();
    }
})();