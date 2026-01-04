// ==UserScript==
// @name         Torn Armoury
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Live-scrape items on Armoury Weapons/Armour into a dark table. Push current list to backend (bulk upsert). Uses Torn API key (Authorization) and auto-detects faction via Torn profile. UI mounts at top of the armoury tab.
// @author       HuzGPT
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      api.justferkillin.com
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549174/Torn%20Armoury.user.js
// @updateURL https://update.greasyfork.org/scripts/549174/Torn%20Armoury.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ================= Constants ================= */
    const API_BASE = 'https://api.justferkillin.com/api';
    const GM_API_KEY = 'JFK_TORN_API_KEY';
    const GM_COLLAPSED = 'HUZ_ARMOURY_UI_COLLAPSED';
    const DEBUG = false; // flip to true for verbose logs
    const LOG_KEY = 'HUZ_ARMOURY_LAST_PAYLOAD';
    function safePreview(obj, n = 3) {
        try {
            const clone = JSON.parse(JSON.stringify(obj));
            return Array.isArray(clone) ? clone.slice(0, n) : clone;
        } catch { return obj; }
    }

    /** ================= Selectors ================= */
    const ROOTS = [
        '#armoury-weapons .item-list',
        '#armoury-armour .item-list',
        '.armoury-weapons-wrap .item-list',
        '.armoury-armour-wrap .item-list',
    ];

    const SEL = {
        li: ':scope > li',
        clicker: '.img-wrap[data-armoryid][data-itemid], .img-wrap[data-armoury][data-id]',
        name: '.name.bold, .name.bold.t-overflow',
        type: '.type',
        dmg: 'ul.bonuses i.bonus-attachment-item-damage-bonus + span',
        acc: 'ul.bonuses i.bonus-attachment-item-accuracy-bonus + span',
        def: 'ul.bonuses i.bonus-attachment-item-defence-bonus + span',
        bonusIcons: 'ul.bonuses i[class^="bonus-attachment-"]',
        colourOverlay: '.item-rarity-color-overlay',
        img: '.img-wrap img',
        infoPanel: '.view-item-info',
    };

    /** ================= Small utils ================= */
    const $ = (s, b = document) => b.querySelector(s);
    const $$ = (s, b = document) => Array.from(b.querySelectorAll(s));
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const num = (s) => { const m = String(s ?? '').match(/-?\d+(?:\.\d+)?/); return m ? Number(m[0]) : null; };
    const visible = (el) => !!el && el.offsetParent !== null;
    const capKind = (k) => k ? (k === 'weapon' ? 'Weapon' : 'Armour') : '';

    function getArmouryHost() { return document.getElementById('faction-armoury'); }

    function findListRoot() {
        const host = getArmouryHost() || document;
        for (const sel of ROOTS) {
            const el = $(sel, host);
            if (visible(el)) return el;
        }
        return null;
    }
    function getAllLis() {
        const root = findListRoot();
        return root ? $$(SEL.li, root).filter(li => $(SEL.clicker, li)) : [];
    }
    function getClicker(li) { return $(SEL.clicker, li); }
    function isOpen(li) {
        const c = getClicker(li);
        if (!c) return false;
        if (c.classList.contains('opened')) return true;
        const info = $(SEL.infoPanel, li);
        return visible(info);
    }

    // Kind detection per <li>
    function getKindFromLi(li) {
        const host = li.closest('#armoury-weapons, #armoury-armour, .armoury-weapons-wrap, .armoury-armour-wrap');
        if (host) {
            if (host.id === 'armoury-weapons' || host.classList.contains('armoury-weapons-wrap')) return 'weapon';
            if (host.id === 'armoury-armour' || host.classList.contains('armoury-armour-wrap')) return 'armour';
        }
        // fallbacks based on stats/type text
        const t = clean($(SEL.type, li)?.textContent || '').toLowerCase();
        if (t.includes('defens')) return 'armour';
        if ($(SEL.def, li)) return 'armour';
        return 'weapon';
    }

    /** ================= Colour & bonus parsing ================= */
    function parseColour(li) {
        const img = $(SEL.img, li);
        if (img && img.className) {
            const m = img.className.match(/\bglow-(grey|yellow|orange|red)\b/i);
            if (m) return m[1].toLowerCase();
        }
        const ov = $(SEL.colourOverlay, li);
        if (ov) {
            const m = (ov.className || '').match(/\b(grey|yellow|orange|red)\b/i);
            if (m) return m[1].toLowerCase();
            const t = clean(ov.textContent).toLowerCase();
            if (['grey', 'yellow', 'orange', 'red'].includes(t)) return t;
        }
        return null;
    }

    // exclude stat/utility icons (damage/accuracy/defense/rof/clip/ammo/etc.)
    const STAT_ICON_RE = /bonus-attachment-(item-|clip|ammo|rof|accuracy|stealth|rarity|defence)/i;

    // names that are not real bonuses
    const PLACEHOLDER_BONUS_RE = /^(?:blank\s+bonus(?:\s*25%?)?|item\s+bonus|bonus|empty|none)$/i;

    function parseBonuses(li) {
        const icons = $$(SEL.bonusIcons, li).filter(i => !STAT_ICON_RE.test(i.className || ''));
        const out = [];
        for (const i of icons) {
            const title = i.getAttribute('title') || '';
            const nameMatch = title.match(/<b>([^<]+)<\/b>/i) || title.match(/^\s*([^<]+?)\s*(?:<|$)/i);
            const pctMatch = title.match(/(\d+(?:\.\d+)?)\s*%/);
            const clsName = (i.className || '').replace(/^.*bonus-attachment-/, '').replace(/-/g, ' ');
            const rawName = (nameMatch ? nameMatch[1] : clsName) || '';
            const name = clean(rawName);
            const pct = pctMatch ? Number(pctMatch[1]) : null;

            if (!name || PLACEHOLDER_BONUS_RE.test(name)) continue;
            out.push({ name, pct });
        }
        return out;
    }

    /** ================= Scrape one LI ================= */
    function scrapeOne(li) {
        const clicker = getClicker(li);
        const armoryId = clicker?.getAttribute('data-armoryid') || clicker?.getAttribute('data-armoury') || null;
        const itemId = clicker?.getAttribute('data-itemid') || clicker?.getAttribute('data-id') || null;
        const name = clean($(SEL.name, li)?.textContent) || null;
        const type = clean($(SEL.type, li)?.textContent) || null;

        const damage = num($(SEL.dmg, li)?.textContent);
        const accuracy = num($(SEL.acc, li)?.textContent);
        const defense = num($(SEL.def, li)?.textContent);

        const colour = parseColour(li);
        const bonuses = parseBonuses(li);
        const kind = getKindFromLi(li);
        if (DEBUG) {
            console.debug('[Armoury] scraped item', {
                armoryId, itemId, name, type, kind,
                damage, accuracy, defense,
                bonusesCount: (bonuses || []).length,
                colour
            });
        }

        return {
            kind,
            name, type, damage, accuracy, defense,
            bonuses, colour,
            armoryId, itemId,
            opened: isOpen(li)
        };
    }

    /** ================= Auth & backend helpers ================= */
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
            console.warn('[Armoury] localStorage not accessible:', e);
        }

        // If no key in localStorage, prompt user (one-time setup)
        if (!key) {
            key = prompt('Enter your Torn API key (must match website login):', '') || '';
            if (key) {
                try {
                    localStorage.setItem('tornApiKey', key);
                    // Also save to GM for backwards compat, but we won't read from it
                    GM_setValue(GM_API_KEY, key);
                } catch (e) {
                    console.error('[Armoury] Failed to save API key:', e);
                }
            }
        }
        return key;
    }
    function gmFetchBackend(method, pathWithQuery, body = null) {
        const base = API_BASE.replace(/\/+$/, '');
        const url = base + pathWithQuery;
        const Authorization = ensureApiKey() || '';

        if (DEBUG) {
            console.groupCollapsed(`[Armoury] ${method} ${url}`);
            const masked = (k) => k ? `${k.slice(0, 3)}…${k.slice(-3)}` : '(none)';
            console.log('Headers:', { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: masked(Authorization) });

            if (body) {
                const preview = safePreview(body, 3);
                console.log('Body (array length):', Array.isArray(body) ? body.length : '(not array)');
                console.log('Body[0..2] deep JSON:', preview);
                try { console.log('Body JSON string (first 2k):', JSON.stringify(preview).slice(0, 2000)); } catch { }
            }
            console.groupEnd();
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Authorization,
                },
                data: body ? JSON.stringify(body) : undefined,
                timeout: 30000,
                onload: (resp) => {
                    if (DEBUG) {
                        const preview = (resp.responseText || '').slice(0, 1200);
                        console.groupCollapsed(`[Armoury] ← Response ${resp.status} ${url}`);
                        console.log('Status:', resp.status);
                        console.log('Text (first 1200 chars):', preview);
                        console.groupEnd();
                    }
                    // If 401, the backend key might have changed - clear GM cache and try localStorage
                    if (resp.status === 401) {
                        try {
                            // Clear GM storage to force refresh from localStorage
                            GM_deleteValue(GM_API_KEY);
                            // Try to get fresh key from localStorage
                            const freshKey = localStorage.getItem('tornApiKey');
                            if (freshKey && freshKey !== Authorization.replace('ApiKey ', '').trim()) {
                                console.warn('[Armoury] API key mismatch detected. Backend key changed, refreshing from localStorage...');
                            }
                        } catch (e) {
                            // Ignore localStorage errors
                        }
                    }
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

    function gmFetchTornFactionName(fid) {
        const key = ensureApiKey();
        const url = `https://api.torn.com/faction/${encodeURIComponent(fid)}?selections=basic&key=${encodeURIComponent(key)}`;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                timeout: 15000,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            const j = JSON.parse(resp.responseText);
                            resolve(j?.name || j?.faction_name || null);
                        } catch { resolve(null); }
                    } else { resolve(null); }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null),
            });
        });
    }

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

    async function detectFactionMeta() {
        try {
            const prof = await gmFetchTornUserProfile();
            const fid = prof?.faction?.faction_id || prof?.faction?.factionId || prof?.faction_id || null;
            const fname = prof?.faction?.faction_name || prof?.faction?.factionName || prof?.faction_name || null;
            return { fid, fname };
        } catch (e) {
            console.warn('Faction auto-detect failed:', e.message);
            return { fid: null, fname: null };
        }
    }

    async function requireFaction() {
        if (!cachedFaction?.fid) {
            try { cachedFaction = await detectFactionMeta(); } catch { }
        }
        if (cachedFaction?.fid && !cachedFaction?.fname) {
            const name = await gmFetchTornFactionName(cachedFaction.fid);
            if (name) cachedFaction.fname = name;
        }
        const fid = cachedFaction?.fid ? String(cachedFaction.fid) : '';
        const fname = cachedFaction?.fname ? String(cachedFaction.fname) : '';
        if (!fid || !fname) throw new Error('Could not determine faction id/name from Torn API key.');
        return { fid, fname };
    }

    /** ================= Table UI ================= */
    let panel, header, contentWrap, tbody, filterEl, totalEl, openNextBtn, pushBtn, settingsBtn, collapseBtn;
    let rows = [];
    let sortState = { key: 'name', dir: 'asc' };
    let nextIndex = 0;
    let cachedFaction = { fid: null, fname: null };
    let mo = null;
    function injectStyles() {
        if (document.getElementById('huz-armoury-style')) return;
        const css = `
  :root {
    --huz-bg-0: rgba(12,12,14,0.94);
    --huz-bg-1: rgba(20,20,24,0.96);
    --huz-bg-2: rgba(28,28,32,0.95);
    --huz-brd:  rgba(255,255,255,0.07);
    --huz-txt:  #f1f5f9;
    --huz-txt-dim: #cbd5e1;
    --huz-accent: #ef4444; /* JFK red */
    --huz-accent-2: #22d3ee; /* cyan kiss */
    --huz-glow: 0 0 0 1px rgba(239,68,68,0.18), 0 10px 30px rgba(239,68,68,0.12);
  }
 
  #huz-armoury-ui {
    margin-top: 1rem;
    background: var(--huz-bg-0);
    color: var(--huz-txt);
    border: 1px solid var(--huz-brd);
    border-radius: 14px;
    box-shadow: 0 14px 30px rgba(0,0,0,0.35);
    backdrop-filter: blur(8px);
    overflow: hidden;
  }
 
  #huz-armoury-ui .huz-header {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    border-bottom:1px solid var(--huz-brd);
    background: linear-gradient(180deg, var(--huz-bg-1), rgba(12,12,14,0.6));
  }
  #huz-armoury-ui .huz-title {
    font-weight: 800; letter-spacing:.25px;
    text-shadow: 0 1px 0 rgba(0,0,0,0.6);
  }
  #huz-armoury-ui .huz-header-right { margin-left:auto; display:flex; align-items:center; gap:10px; }
 
  /* Buttons */
  #huz-armoury-ui .btn {
    padding: 6px 10px; border-radius: 10px; cursor: pointer; font-weight: 700;
    transition: transform .08s ease, background .2s ease, border-color .2s ease;
    border:1px solid var(--huz-brd); background: var(--huz-bg-2); color: var(--huz-txt);
  }
  #huz-armoury-ui .btn:hover { transform: translateY(-1px); box-shadow: var(--huz-glow); }
  #huz-armoury-ui .btn-green { border-color: rgba(16,185,129,0.25); background: rgba(16,185,129,0.12); color:#bbf7d0; }
  #huz-armoury-ui .btn-ghost { }
  #huz-armoury-ui .btn-icon {
  width:32px;
  height:28px;
  border-radius:8px;
  display:flex;                /* center the glyph */
  align-items:center;          /* vertical center */
  justify-content:center;      /* horizontal center */
  line-height:1;               /* avoid baseline drift */
  padding:0;                   /* no extra inset */
}
 
 
  #huz-armoury-ui .btn-collapse { width:30px; height:28px; border-radius:8px; }
 
  /* Top bar */
  #huz-armoury-ui .huz-bar {
    display:flex; align-items:center; gap:10px; padding:8px 12px;
    border-bottom:1px solid var(--huz-brd);
    background: linear-gradient(180deg, rgba(18,18,22,0.85), rgba(12,12,14,0.5));
  }
  #huz-armoury-ui .huz-input {
    flex:1; padding:8px 10px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border:1px solid var(--huz-brd);
    color: var(--huz-txt);
    outline: none;
    transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
  }
  #huz-armoury-ui .huz-input:focus {
    border-color: rgba(34,211,238,0.45);
    box-shadow: 0 0 0 2px rgba(34,211,238,0.2);
    background: rgba(255,255,255,0.08);
  }
  #huz-armoury-ui .huz-totals { opacity:.85; text-align:right; font-variant-numeric: tabular-nums; color: var(--huz-txt-dim); }
 
  /* Scrollable area */
  #huz-armoury-ui .huz-scroll {
    max-height: 62vh; /* scrollable height */
    overflow: auto;
    padding: 0 12px 12px;
  }
 
  /* Custom scrollbar (WebKit) */
  #huz-armoury-ui .huz-scroll::-webkit-scrollbar {
    width: 11px; height: 11px;
  }
  #huz-armoury-ui .huz-scroll::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
  }
  #huz-armoury-ui .huz-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(239,68,68,0.55), rgba(34,211,238,0.45));
    border-radius: 10px;
    border: 2px solid rgba(12,12,14,0.9);
  }
  #huz-armoury-ui .huz-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(239,68,68,0.75), rgba(34,211,238,0.65));
  }
 
  /* Firefox scrollbar */
  #huz-armoury-ui .huz-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(239,68,68,0.7) rgba(255,255,255,0.06);
  }
 
  /* Table */
  #huz-armoury-ui table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 900px;
    color: var(--huz-txt);
  }
  #huz-armoury-ui thead th {
    position: sticky; top: 0; z-index: 2;
    background: var(--huz-bg-1);
    text-align: left;
    padding: 8px 10px;
    font-weight: 800;
    border-bottom: 1px solid var(--huz-brd);
    cursor: pointer; white-space: nowrap; color: var(--huz-txt);
  }
  #huz-armoury-ui thead th:hover { color: #fff; text-shadow: 0 0 8px rgba(239,68,68,0.35); }
  #huz-armoury-ui tbody td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--huz-brd);
    color: var(--huz-txt);
  }
  #huz-armoury-ui tbody tr:hover td {
    background: rgba(239,68,68,0.05);
  }
 
  /* Colour chip */
  #huz-armoury-ui .colour-chip {
    display:inline-block; min-width:52px; text-align:center; padding:2px 6px; border-radius:999px;
    color:#0b0b0c; font-weight:800;
  }
  #huz-armoury-ui .colour-grey   { background:#9ca3af; }
  #huz-armoury-ui .colour-yellow { background:#facc15; }
  #huz-armoury-ui .colour-orange { background:#fb923c; }
  #huz-armoury-ui .colour-red    { background:#f87171; }
  `;
        const el = document.createElement('style');
        el.id = 'huz-armoury-style';
        el.textContent = css;
        document.head.appendChild(el);
    }

    function ensureUI() {
        injectStyles();
        const host = getArmouryHost();
        if (!host) return;
        if (panel && host.contains(panel)) return;

        panel = document.createElement('div');
        panel.id = 'huz-armoury-ui';

        // header
        header = document.createElement('div');
        header.className = 'huz-header';
        header.innerHTML = `
    <div class="huz-title">Armoury — Items on Page</div>
    <div class="huz-header-right">
      <button id="huz-push"     class="btn btn-green">Send to backend</button>
      <button id="huz-settings" class="btn btn-icon" title="Torn API key & detected faction">⚙️</button>
      <button id="huz-export"   class="btn">Export CSV</button>
      <button id="huz-collapse" class="btn btn-collapse" title="Collapse/Expand" aria-expanded="true">▾</button>
    </div>
  `;

        // top bar (filter + totals)
        const bar = document.createElement('div');
        bar.className = 'huz-bar';
        bar.innerHTML = `
    <input id="huz-filter" class="huz-input" placeholder="Filter by name, type, bonus…">
    <div id="huz-totals" class="huz-totals">No armoury list detected.</div>
  `;

        // table
        const tableWrap = document.createElement('div');
        const table = document.createElement('table');
        table.innerHTML = `
    <thead>
      <tr>
        ${th('name', 'Name')}
        ${th('type', 'Type')}
        ${th('kind', 'Kind')}
        ${th('damage', 'Damage', 'right')}
        ${th('accuracy', 'Accuracy', 'right')}
        ${th('defense', 'Defense', 'right')}
        ${th('bonuses', 'Bonuses')}
        ${th('colour', 'Colour')}
        ${th('armoryId', 'ArmoryID')}
        ${th('itemId', 'ItemID')}
      </tr>
    </thead>
    <tbody id="huz-tbody"></tbody>
  `;
        tableWrap.appendChild(table);

        // scroller holds both bar + table
        const scroller = document.createElement('div');
        scroller.className = 'huz-scroll';
        scroller.append(bar, tableWrap);

        // content wrapper (collapsible)
        contentWrap = document.createElement('div');
        contentWrap.id = 'huz-content';
        contentWrap.append(scroller);

        // assemble
        panel.append(header, contentWrap);
        (getArmouryHost() || document.body)
            .insertBefore(panel, (getArmouryHost() || document.body).firstChild);

        // refs
        tbody = $('#huz-tbody', panel);
        filterEl = $('#huz-filter', panel);
        totalEl = $('#huz-totals', panel);
        openNextBtn = $('#huz-open-next', panel);
        pushBtn = $('#huz-push', panel);
        settingsBtn = $('#huz-settings', panel);
        collapseBtn = $('#huz-collapse', panel);

        // initial collapsed state
        let collapsed = !!GM_getValue(GM_COLLAPSED);
        applyCollapsed(collapsed);

        // events
        $('#huz-export', panel).addEventListener('click', exportCSV);
        filterEl.addEventListener('input', render);
        if (openNextBtn) openNextBtn.addEventListener('click', openNextItem);
        pushBtn.addEventListener('click', pushToBackend);

        settingsBtn.addEventListener('click', async () => {
            const key = ensureApiKey();
            if (!key) { alert('API key not set.'); return; }
            const meta = await detectFactionMeta();
            cachedFaction = meta;
            const factionTxt = meta.fid
                ? `${meta.fid} — ${meta.fname || '(name unknown)'}`
                : '(not detected)';
            alert(`Configured:\nAPI key: ${'●'.repeat(6)}\nFaction: ${factionTxt}`);
        });

        collapseBtn.addEventListener('click', () => {
            collapsed = !collapsed;
            GM_setValue(GM_COLLAPSED, collapsed);
            applyCollapsed(collapsed);
        });

        function applyCollapsed(isCollapsed) {
            contentWrap.style.display = isCollapsed ? 'none' : 'block';
            collapseBtn.textContent = isCollapsed ? '▸' : '▾';
            collapseBtn.setAttribute('aria-expanded', String(!isCollapsed));
        }

        // column sort handlers
        panel.querySelectorAll('thead th').forEach(thEl => {
            thEl.addEventListener('click', () => {
                const key = thEl.getAttribute('data-key');
                if (!key) return;
                if (sortState.key === key) sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
                else { sortState.key = key; sortState.dir = 'asc'; }
                render();
                updateSortIndicators(table);
            });
        });

        // Armory-scoped observer
        if (!mo) {
            mo = new MutationObserver(() => {
                if (startObserver._raf) cancelAnimationFrame(startObserver._raf);
                startObserver._raf = requestAnimationFrame(rescan);
            });
            mo.observe(getArmouryHost() || document.body, { childList: true, subtree: true });
        }
    }


    function th(key, label, align = 'left') {
        return `<th data-key="${key}" data-align="${align}">${label}</th>`;
    }
    function updateSortIndicators(table) {
        table.querySelectorAll('thead th').forEach(thEl => {
            const key = thEl.getAttribute('data-key');
            const base = thEl.textContent.replace(/[↑↓]$/, '');
            thEl.textContent = base + (key === sortState.key ? (sortState.dir === 'asc' ? ' ↑' : ' ↓') : '');
        });
    }

    const colourChip = (c) => {
        if (!c) return '';
        const map = { grey: '#9ca3af', yellow: '#facc15', orange: '#fb923c', red: '#f87171' };
        return `<span style="display:inline-block; min-width:52px; text-align:center; padding:2px 6px; border-radius:999px; background:${map[c] || '#cbd5e1'}; color:#0b0b0c; font-weight:700;">${c}</span>`;
    };
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

    function applyFilter(arr) {
        const q = clean(filterEl.value || '').toLowerCase();
        if (!q) return arr;
        return arr.filter(r => {
            const bonusText = (r.bonuses || []).map(b => b.name + (b.pct != null ? ` ${b.pct}%` : '')).join(' ');
            const hay = [
                r.kind, r.name, r.type, r.colour, r.armoryId, r.itemId,
                r.damage, r.accuracy, r.defense, bonusText
            ].filter(Boolean).join(' ').toLowerCase();
            return hay.includes(q);
        });
    }

    function sortRows(arr) {
        const { key, dir } = sortState;
        const mul = dir === 'asc' ? 1 : -1;
        return arr.slice().sort((a, b) => {
            const va = a[key], vb = b[key];
            if (['damage', 'accuracy', 'defense'].includes(key)) {
                const na = typeof va === 'number' ? va : -Infinity;
                const nb = typeof vb === 'number' ? vb : -Infinity;
                return (na - nb) * mul;
            }
            if (key === 'bonuses') {
                const sa = (a.bonuses || []).map(x => x.name).join(', ');
                const sb = (b.bonuses || []).map(x => x.name).join(', ');
                return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' }) * mul;
            }
            return String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true, sensitivity: 'base' }) * mul;
        });
    }
    function colourChipClass(c) {
        if (!c) return '';
        const cls = c === 'grey' ? 'colour-grey'
            : c === 'yellow' ? 'colour-yellow'
                : c === 'orange' ? 'colour-orange'
                    : c === 'red' ? 'colour-red'
                        : '';
        return `<span class="colour-chip ${cls}">${c}</span>`;
    }

    function render() {
        const filtered = applyFilter(rows);
        const sorted = sortRows(filtered);
        tbody.innerHTML = sorted.map(r => {
            const trimmed = r.kind === 'armour'
                ? (r.bonuses || []).slice(0, 1)
                : (r.bonuses || []).slice(0, 2);
            const bonusText = trimmed.map(b => `${esc(b.name)}${b.pct != null ? ` (${b.pct}%)` : ''}`).join(' • ');
            return `
        <tr>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); font-weight:600; color:#f1f5f9;">${esc(r.name)}</td>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); color:#f1f5f9;">${esc(r.type)}</td>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); color:#f1f5f9;">${capKind(r.kind)}</td>
          <td style="padding:8px 10px; text-align:right; border-bottom:1px solid rgba(255,255,255,0.06); color:#f1f5f9;">${r.damage ?? ''}</td>
          <td style="padding:8px 10px; text-align:right; border-bottom:1px solid rgba(255,255,255,0.06); color:#f1f5f9;">${r.accuracy ?? ''}</td>
          <td style="padding:8px 10px; text-align:right; border-bottom:1px solid rgba(255,255,255,0.06); color:#f1f5f9;">${r.defense ?? ''}</td>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); color:#f1f5f9;">${bonusText}</td>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06);">${colourChipClass(r.colour)}</td>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); opacity:.85; color:#f1f5f9;">${esc(r.armoryId)}</td>
          <td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); opacity:.85; color:#f1f5f9;">${esc(r.itemId)}</td>
        </tr>`;
        }).join('');

        const root = findListRoot();
        const totalLis = root ? $$(SEL.li, root).length : 0;
        const unopened = getAllLis().filter(li => !isOpen(li)).length;
        const factionBadge = cachedFaction.fid ? ` • Faction: ${cachedFaction.fid}${cachedFaction.fname ? ' — ' + cachedFaction.fname : ''}` : '';
        totalEl.textContent = `Showing ${sorted.length} of ${rows.length} scraped. Items in list: ${totalLis}. Unopened right now: ${unopened}.${factionBadge}`;
    }

    function exportCSV() {
        const cols = ['kind', 'name', 'type', 'damage', 'accuracy', 'defense', 'bonuses', 'colour', 'armoryId', 'itemId'];
        const lines = [
            cols.join(','),
            ...rows.map(r => {
                const trimmed = r.kind === 'armour'
                    ? (r.bonuses || []).slice(0, 1)
                    : (r.bonuses || []).slice(0, 2);
                const vals = {
                    ...r,
                    bonuses: trimmed.map(b => `${b.name}${b.pct != null ? ` (${b.pct}%)` : ''}`).join(' | ')
                };
                return cols.map(k => {
                    const v = vals[k] == null ? '' : String(vals[k]);
                    return /[,"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
                }).join(',');
            })
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `armoury_items_${Date.now()}.csv`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    }

    /** ================= Live scrape + step-open ================= */
    function rescan() {
        const lis = getAllLis();
        for (const li of lis) {
            const data = scrapeOne(li);
            const key = (data.armoryId || '') + '|' + (data.itemId || '');
            const i = rows.findIndex(r => ((r.armoryId || '') + '|' + (r.itemId || '')) === key);
            if (i >= 0) rows[i] = { ...rows[i], ...data };
            else rows.push(data);
        }
        if (DEBUG) {
            const summary = rows.map(r => ({
                armoryId: r.armoryId, itemId: r.itemId, name: r.name,
                kind: r.kind, dmg: r.damage ?? null, acc: r.accuracy ?? null, def: r.defense ?? null,
                bonuses: (r.bonuses || []).length
            }));
            console.table(summary);
        }
        render();
        const total = lis.length;
        if (nextIndex >= total) nextIndex = 0;
    }

    function startObserver() { /* started in ensureUI() */ }

    // Legacy: step-open utility (kept for future use)
    async function openNextItem() {
        const lis = getAllLis();
        if (!lis.length) { totalEl.textContent = 'No armoury list detected.'; return; }
        const total = lis.length;
        for (let step = 0; step < total; step++) {
            const idx = (nextIndex + step) % total;
            const li = lis[idx];
            if (!isOpen(li)) {
                const c = getClicker(li);
                li.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => c?.click(), 80);
                nextIndex = (idx + 1) % total;
                totalEl.textContent = `Clicked item ${idx + 1}/${total}.`;
                return;
            }
        }
        totalEl.textContent = 'All items appear to be open.';
    }

    /** ================= Backend push ================= */
    function buildBackendPayload() {
        const items = rows
            .filter(r => r.armoryId && r.itemId && r.name && (r.kind === 'weapon' || r.kind === 'armour'))
            .map(r => {
                const rawBonuses = (r.kind === 'armour' ? (r.bonuses || []).slice(0, 1) : (r.bonuses || []).slice(0, 2));
                const bonuses = rawBonuses
                    .filter(b => b && b.name && !PLACEHOLDER_BONUS_RE.test(b.name))
                    .map(b => ({ name: b.name, pct: b.pct }));

                const base = {
                    armoryId: String(r.armoryId),
                    itemId: Number(r.itemId),
                    kind: r.kind,
                    name: r.name,
                    type: r.type || null,
                    colour: r.colour || null,
                    bonuses,
                };

                return (r.kind === 'weapon')
                    ? { ...base, damage: r.damage ?? null, accuracy: r.accuracy ?? null }
                    : { ...base, defense: r.defense ?? null };
            });

        return items;
    }
    // Fetch all existing items for this faction and return a Set of armoryIds
    async function fetchExistingArmouryIds(fid) {
        const perPage = 1000;
        let page = 1;
        let pages = 1;
        const seen = new Set();

        try {
            do {
                const qs = `?faction_id=${encodeURIComponent(String(fid))}&limit=${perPage}&page=${page}`;
                const data = await gmFetchBackend('GET', `/armoury/items${qs}`);
                const items = Array.isArray(data?.items) ? data.items : [];
                for (const it of items) {
                    if (it?.armoryId) seen.add(String(it.armoryId));
                }
                pages = Number(data?.pages || 1);
                page += 1;
            } while (page <= pages);
        } catch (e) {
            console.warn('[Armoury] Failed to prefetch existing items; proceeding without dedupe.', e);
        }

        if (DEBUG) {
            console.debug('[Armoury] Existing armoryIds fetched:', seen.size);
        }
        return seen;
    }

    async function pushToBackend() {
        try {
            const key = ensureApiKey();
            if (!key) { alert('Missing API key. Click ⚙️ to configure.'); return; }

            const { fid, fname } = await requireFaction();
            cachedFaction = { fid, fname };
            render();

            // Build full payload from the current scrape (weapons + armour)
            const items = buildBackendPayload();
            if (!items.length) { alert('No items to send.'); return; }

            // NEW: prefetch existing armoryIds for this faction to avoid re-adding
            const existingIds = await fetchExistingArmouryIds(fid);

            // Keep only brand-new items (identified by armoryId)
            const outgoing = items.filter(it => it?.armoryId && !existingIds.has(String(it.armoryId)));

            const skipped = items.length - outgoing.length;
            if (!outgoing.length) {
                totalEl.textContent = `No new items to push. (All ${items.length} already present for faction ${fid}${fname ? ' — ' + fname : ''}.)`;
                if (DEBUG) console.debug('[Armoury] All items already present; nothing to POST.');
                return;
            }

            const qs = `?faction_id=${encodeURIComponent(fid)}&faction_name=${encodeURIComponent(fname)}`;

            if (DEBUG) {
                console.groupCollapsed('[Armoury] Pushing new items to backend');
                console.log('Endpoint:', `/armoury/items/bulk${qs}`);
                console.log('Outgoing length:', outgoing.length, 'Skipped existing:', skipped);
                const counts = outgoing.reduce((m, x) => (m[x.kind] = (m[x.kind] || 0) + 1, m), {});
                console.log('By kind:', counts);
                console.groupEnd();
            }

            const out = await gmFetchBackend('POST', `/armoury/items/bulk${qs}`, outgoing);

            totalEl.textContent =
                `Pushed ${outgoing.length} new item(s). Skipped ${skipped} existing. `
                + `Upserted: ${out.nUpserted ?? '?'}, Modified: ${out.nModified ?? '?'}, Matched: ${out.nMatched ?? '?'}.`;
        } catch (e) {
            console.error(e);
            alert('Push failed: ' + (e?.message || e));
        }
    }


    /** ================= Boot ================= */
    function boot() {
        ensureUI();
        rescan();
    }

    window.addEventListener('hashchange', boot);
    window.addEventListener('load', boot);
})();