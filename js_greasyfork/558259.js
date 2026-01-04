// ==UserScript==
// @name         Torn ELIM Filter Panel made by D1pl0753
// @namespace    D1pl0753
// @license      MIT
// @version      3.5
// @description  Filtering (level, stats, attacks, FFScouter arrows) for ELIM team pages. Supports raw+percent stats. Auto-reapplies on infinite scroll.
// @match        https://www.torn.com/page.php?sid=competition*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558259/Torn%20ELIM%20Filter%20Panel%20made%20by%20D1pl0753.user.js
// @updateURL https://update.greasyfork.org/scripts/558259/Torn%20ELIM%20Filter%20Panel%20made%20by%20D1pl0753.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========================================================================
       DOM HELPERS
    ======================================================================== */

    const qs = sel => document.querySelector(sel);

    function getElimRoot() {
        return qs('#eliminationRoot');
    }

    function getRowContainer() {
        const root = getElimRoot();
        if (!root) return null;

        const wrapper = root.querySelector('[class*="tableWrapper"]') ||
                        root.querySelector('[class*="dataGrid"]');
        if (!wrapper) return null;

        const body = wrapper.querySelector('[class*="dataGridBody"]') || wrapper;
        const virtual = body.querySelector('[class*="virtualContainer"]');
        return virtual || body;
    }

    function getRows() {
        const cont = getRowContainer();
        return cont ? [...cont.querySelectorAll('[class*="teamRow"]')] : [];
    }



    /* ========================================================================
       PARSING HELPERS
    ======================================================================== */

    function parsePercentValue(text) {
        text = text.trim().toLowerCase();
        if (text.endsWith("%")) text = text.slice(0, -1).trim();

        const v = parseFloat(text);
        return Number.isNaN(v) ? null : (v / 100);
    }

    function parseRawValue(text) {
        if (!text) return null;

        const cleaned = text.toLowerCase().replace(/,/g, '').trim();
        const m = cleaned.match(/([\d.]+)\s*([kmbt])?/);
        if (!m) return null;

        let val = parseFloat(m[1]);
        if (Number.isNaN(val)) return null;

        const mult = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
        if (m[2] && mult[m[2]]) val *= mult[m[2]];

        return val;
    }

    function parseUserStatsInput(inputText) {
        if (!inputText || typeof inputText !== 'string') return null;
        const txt = inputText.trim();
        if (!txt) return null;
        return parseRawValue(txt);
    }

    /* ========================================================================
       AUTOCOMPLETE ABBREVIATIONS (500k -> 500,000)
    ======================================================================== */

    function autocompleteStatsInput(inputElement) {
        const val = inputElement.value.trim();
        if (!val) return;

        const match = val.match(/^([\d.]+)\s*([kmbt])?$/i);
        if (match) {
            const num = parseFloat(match[1]);
            const mult = match[2]?.toLowerCase();
            const multipliers = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };

            if (mult && multipliers[mult]) {
                inputElement.value = (num * multipliers[mult]).toLocaleString();
            } else if (mult === undefined && /^\d+$/.test(match[1])) {
                inputElement.value = num.toLocaleString();
            }
        }
    }

    /* ========================================================================
       STATS FROM ROW BASED ON MODE
    ======================================================================== */

    function extractStatsFromRow(row) {
        const playerId = getPlayerIdFromRow(row);
        if (!playerId) return null;

        try {
            const cached = localStorage.getItem('ffscouterv2-' + playerId);
            if (!cached) return null;

            const data = JSON.parse(cached);
            if (data && data.bs_estimate && data.expiry > Date.now()) {
                return data.bs_estimate;
            }
        } catch (e) {
            // Ignore errors
        }
        return null;
    }

    // Trigger FF-Scouter to load stats for all visible players
    function triggerFFScouterLoad() {
        const rows = getRows();
        const playerIds = rows.map(r => getPlayerIdFromRow(r)).filter(id => id);

        console.log(`[EFP] Triggering FF-Scouter for ${playerIds.length} players...`);

        // Simulate hovering over each row to trigger FF-Scouter
        rows.forEach(row => {
            const nameCell = row.querySelector('[class*="name"]');
            if (nameCell) {
                nameCell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            }
        });

        console.log('[EFP] FF-Scouter load triggered. Wait a few seconds for data to load.');
    }

    window.triggerFFScouterLoad = triggerFFScouterLoad;

    // Debug specific player - call this from console: window.debugPlayer('PLAYER_ID')
    window.debugPlayer = function(playerId) {
        console.log('=== DEBUG PLAYER', playerId, '===');

        // Check localStorage
        const cached = localStorage.getItem('ffscouterv2-' + playerId);
        if (!cached) {
            console.log('❌ No data in localStorage for player', playerId);
            return;
        }

        const data = JSON.parse(cached);
        console.log('📦 Raw localStorage data:', data);
        console.log('📊 bs_estimate (raw):', data.bs_estimate);
        console.log('📊 bs_estimate_human (display):', data.bs_estimate_human);
        console.log('⏰ Expiry:', new Date(data.expiry));
        console.log('✅ Is expired?', data.expiry <= Date.now());

        // Find the row
        const rows = getRows();
        const row = rows.find(r => getPlayerIdFromRow(r) === playerId);
        if (!row) {
            console.log('❌ Row not found on page');
            return;
        }

        console.log('🎯 Found row:', row);
        const extracted = extractValuesFromRow(row);
        console.log('📈 Extracted values:', extracted);

        // Check what profile shows
        console.log('\n💡 To compare with profile:');
        console.log('   1. Open player profile:', `https://www.torn.com/profiles.php?XID=${playerId}`);
        console.log('   2. Look for "Est. Stats:" in the FF Scouter display');
        console.log('   3. Compare with bs_estimate_human above');
    };

    function getPlayerIdFromRow(row) {
        const link = row.querySelector('a[href*="XID="]');
        if (!link) return null;
        const match = link.href.match(/XID=(\d+)/);
        return match ? match[1] : null;
    }

    /* ========================================================================
       EXTRACT OTHER VALUES
    ======================================================================== */

    function parseIntSafe(text) {
        if (!text) return 0;
        const n = parseInt(text.replace(/[^0-9\-]/g, ''), 10);
        return Number.isNaN(n) ? 0 : n;
    }

    function extractValuesFromRow(row) {
        const level   = parseIntSafe(row.querySelector('[class*="level"] span')?.innerText);
        const attacks = parseIntSafe(row.querySelector('[class*="attacks"] span')?.innerText);
        const stats   = extractStatsFromRow(row);
        return { level, attacks, stats };
    }

    /* ========================================================================
       FF SCOUTER ARROW DETECTION
    ======================================================================== */

    function getArrowColors(row) {
        const colors = new Set();
        const nameCell = row.querySelector('[class*="name"]');
        if (!nameCell) return [];

        const cls = nameCell.className.toLowerCase();
        if (cls.includes("ffsc-color-red"))   colors.add("red");
        if (cls.includes("ffsc-color-green")) colors.add("green");
        if (cls.includes("ffsc-color-blue"))  colors.add("blue");

        const imgs = [...nameCell.querySelectorAll('.ff-scouter-arrow')];
        imgs.forEach(img => {
            const src = img.src.toLowerCase();
            if (src.includes("red")) colors.add("red");
            if (src.includes("green")) colors.add("green");
            if (src.includes("blue")) colors.add("blue");
        });

        return [...colors];
    }

    /* ========================================================================
       FILTER PANEL
    ======================================================================== */

    const filterFields = {
        minLevel:   '#efp-min-level',
        maxLevel:   '#efp-max-level',
        minStats:   '#efp-min-stats',
        maxStats:   '#efp-max-stats',
        minAttacks: '#efp-min-attacks',
        maxAttacks: '#efp-max-attacks'
    };

    let scriptActive = true;

    function stopScript() {
        scriptActive = false;
        if (mutationObserver) mutationObserver.disconnect();
        stopRowObserver();
        qs('#efp-stop-btn').style.display = 'none';
        qs('#efp-start-btn').style.display = 'flex';
    }

    function startScript() {
        scriptActive = true;
        qs('#efp-start-btn').style.display = 'none';
        qs('#efp-stop-btn').style.display = 'flex';
        refresh();
        if (!mutationObserver) {
            mutationObserver = new MutationObserver(() => {
                if (scriptActive) scheduleRefresh();
            });
            mutationObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    function readFilterValue(selector, parser) {
        const el = qs(selector);
        if (!el || !el.value.trim()) return null;
        return parser(el.value.trim());
    }

    // Save filter parameters to localStorage
    function saveFilterParams() {
        const params = {};
        Object.entries(filterFields).forEach(([key, selector]) => {
            const el = qs(selector);
            if (el && el.value.trim()) {
                params[key] = el.value.trim();
            }
        });

        // Save arrow checkboxes
        ['#efp-hide-blue', '#efp-hide-green', '#efp-hide-red'].forEach(selector => {
            const el = qs(selector);
            if (el && el.checked) {
                params[selector] = true;
            }
        });

        localStorage.setItem('efp-filter-params', JSON.stringify(params));
    }

    // Load and restore filter parameters from localStorage
    function loadFilterParams() {
        try {
            const saved = localStorage.getItem('efp-filter-params');
            if (!saved) return;

            const params = JSON.parse(saved);
            Object.entries(params).forEach(([key, value]) => {
                if (key.startsWith('#efp-hide-')) {
                    // Handle arrow checkboxes
                    const el = qs(key);
                    if (el) el.checked = value;
                } else {
                    // Handle input fields
                    const selector = filterFields[key];
                    const el = qs(selector);
                    if (el) el.value = value;
                }
            });
        } catch (e) {
            // Ignore errors
        }
    }

    // Clear saved filter parameters
    function clearFilterParams() {
        localStorage.removeItem('efp-filter-params');
        Object.values(filterFields).forEach(selector => {
            const el = qs(selector);
            if (el) el.value = '';
        });
    }

    /* ========================================================================
       APPLY FILTERS
    ======================================================================== */

    let filterTimeout;

    function applyFilters() {
        saveFilterParams(); // Save parameters when applying filters
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(_applyFilters, 50);
    }

    function hideRow(row) {
        row.classList.add('efp-hidden');
    }

    function showRow(row) {
        row.classList.remove('efp-hidden');
    }

    function shouldHideRow(row, filters) {
        const { level, attacks, stats } = extractValuesFromRow(row);

        // Debug first row
        if (!window.efpFilterDebug) {
            console.log('[EFP Filter Debug]', { level, attacks, stats, filters });
            window.efpFilterDebug = true;
        }

        if (filters.minL !== null && level < filters.minL) return true;
        if (filters.maxL !== null && level > filters.maxL) return true;
        if (filters.minA !== null && attacks < filters.minA) return true;
        if (filters.maxA !== null && attacks > filters.maxA) return true;

        // Only apply stats filter if stats are available (not null)
        if (stats !== null) {
            if (filters.minS !== null && stats < filters.minS) return true;
            if (filters.maxS !== null && stats > filters.maxS) return true;
        }

        if (filters.hideBlue || filters.hideGreen || filters.hideRed) {
            const arrows = getArrowColors(row);
            if (filters.hideBlue && arrows.includes("blue")) return true;
            if (filters.hideGreen && arrows.includes("green")) return true;
            if (filters.hideRed && arrows.includes("red")) return true;
        }

        return false;
    }

    function getFilterSettings() {
        const minStatsValue = qs(filterFields.minStats)?.value;
        const minS = parseUserStatsInput(minStatsValue);

        if (!window.efpParseDebug) {
            console.log('[EFP Parse Debug] minStatsValue:', minStatsValue, 'parsed:', minS);
            window.efpParseDebug = true;
        }

        return {
            minL: readFilterValue(filterFields.minLevel, parseIntSafe),
            maxL: readFilterValue(filterFields.maxLevel, parseIntSafe),
            minS: minS,
            maxS: parseUserStatsInput(qs(filterFields.maxStats)?.value),
            minA: readFilterValue(filterFields.minAttacks, parseIntSafe),
            maxA: readFilterValue(filterFields.maxAttacks, parseIntSafe),
            hideBlue: qs('#efp-hide-blue')?.checked,
            hideGreen: qs('#efp-hide-green')?.checked,
            hideRed: qs('#efp-hide-red')?.checked
        };
    }

    function _applyFilters() {
        const rows = getRows();
        if (!rows.length) return;

        const filters = getFilterSettings();

        for (const row of rows) {
            if (shouldHideRow(row, filters)) {
                hideRow(row);
            } else {
                showRow(row);
            }
        }

        updateStatistics(rows);
    }

    function updateStatistics(rows) {
        const visible = rows.filter(r => !r.classList.contains('efp-hidden')).length;
        const total = rows.length;
        const statsEl = qs('#efp-statistics');
        if (statsEl) {
            statsEl.innerHTML = `Showing <strong>${visible}</strong> of <strong>${total}</strong> players.`;
        }
    }

    function clearFilters() {
        clearFilterParams(); // Clear saved parameters

        ['#efp-hide-blue', '#efp-hide-green', '#efp-hide-red'].forEach(sel => {
            const el = qs(sel);
            if (el) el.checked = false;
        });

        _applyFilters();
    }

    /* ========================================================================
       PANEL UI + CSS
    ======================================================================== */

    function createPanel() {
        if (qs('#elimFilterPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'elimFilterPanel';

        panel.innerHTML = `
            <div class="efp-header">
                <span>ELIM Filters</span>
                <div style="display: flex; gap: 4px;">
                    <button id="efp-collapse-btn">−</button>
                    <button id="efp-refresh-btn" title="Refresh filters">↻</button>
                    <button id="efp-stop-btn" title="Stop filtering">Stop</button>
                    <button id="efp-start-btn" title="Start filtering" style="display: none;">Start</button>
                </div>
            </div>

            <div id="efp-body">
                <div id="efp-statistics" class="efp-statistics">Showing <strong>0</strong> of <strong>0</strong> players.</div>
                <label>Level (Min → Max)
                    <div class="efp-range">
                        <input type="number" id="efp-min-level" placeholder="Min">
                        <input type="number" id="efp-max-level" placeholder="Max">
                    </div>
                </label>

                <label>Stats (Min → Max)
                    <div class="efp-range">
                        <input type="text" id="efp-min-stats" placeholder="500k">
                        <input type="text" id="efp-max-stats" placeholder="Max">
                    </div>
                </label>

                <label>Attacks (Min → Max)
                    <div class="efp-range">
                        <input type="number" id="efp-min-attacks" placeholder="Min">
                        <input type="number" id="efp-max-attacks" placeholder="Max">
                    </div>
                </label>

                <div class="efp-arrows">
                    <label><input type="checkbox" id="efp-hide-blue"> Hide Blue Arrow</label>
                    <label><input type="checkbox" id="efp-hide-green"> Hide Green Arrow</label>
                    <label><input type="checkbox" id="efp-hide-red"> Hide Red Arrow</label>
                </div>

                <div class="efp-buttons">
                    <button id="efp-clear-filters">Clear</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        injectStyles();
        bindEvents();
        loadFilterParams(); // Load saved parameters after creating panel
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #elimFilterPanel {
                position: fixed;
                top: 80px; right: 20px;
                background: rgba(10,10,10,0.95);
                border: 1px solid #444;
                border-radius: 6px;
                color: #ddd;
                width: 240px;
                font-size: 12px;
                z-index: 99999;
            }
            .efp-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 6px 8px; background: #222; border-bottom: 1px solid #444;
                font-weight: bold;
            }
            #efp-collapse-btn, #efp-stop-btn, #efp-start-btn, #efp-refresh-btn {
                all: unset; width: 14px; height: 14px;
                border: 1px solid #555; border-radius: 3px;
                color: #ccc; font-size: 10px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
            }
            #efp-stop-btn, #efp-start-btn {
                width: auto; padding: 2px 6px; font-size: 9px;
            }
            #efp-stop-btn {
                background: #3a2222;
            }
            #efp-stop-btn:hover {
                background: #5a3333;
            }
            #efp-start-btn {
                background: #223a22;
            }
            #efp-start-btn:hover {
                background: #335a33;
            }
            #efp-body { padding: 8px; }
            .efp-statistics {
                padding: 6px 8px;
                background: #1a1a1a;
                border-radius: 3px;
                margin-bottom: 8px;
                font-size: 11px;
                text-align: center;
            }
            .efp-statistics strong {
                color: #4a9eff;
            }
            .efp-range { display: flex; gap: 4px; margin-top: 2px; }
            .efp-hidden { display: none !important; }
            input[type="text"], input[type="number"] {
                width:100%; background:#222; border:1px solid #555; border-radius:3px;
                color:#ddd; padding:2px 4px; font-size:11px;
            }
            .efp-arrows {
                margin-top: 8px; border-top: 1px solid #333; padding-top: 6px;
                display:flex; flex-direction:column; gap:4px;
            }
            .efp-buttons { display:flex; margin-top:10px; gap:4px; }
            .efp-buttons button {
                flex:1; background:#333; border:1px solid #555; border-radius:3px;
                color:#eee; cursor:pointer; padding:4px;
            }
        `;
        document.head.appendChild(style);
    }

    function bindEvents() {
        qs('#efp-collapse-btn').addEventListener('click', () => {
            const body = qs('#efp-body');
            const collapsed = body.style.display === 'none';
            body.style.display = collapsed ? 'block' : 'none';
            qs('#efp-collapse-btn').textContent = collapsed ? '−' : '+';
            localStorage.setItem('efp-collapsed', collapsed ? 'false' : 'true');
        });

        qs('#efp-stop-btn').addEventListener('click', stopScript);
        qs('#efp-start-btn').addEventListener('click', startScript);

        qs('#efp-refresh-btn').addEventListener('click', _applyFilters);

        qs('#efp-clear-filters').addEventListener('click', clearFilters);

        Object.values(filterFields).forEach(sel => {
            const el = qs(sel);
            if (el) el.addEventListener('input', applyFilters);
        });

        // Add autocomplete for stats inputs on blur
        [filterFields.minStats, filterFields.maxStats].forEach(sel => {
            const el = qs(sel);
            if (el) {
                el.addEventListener('blur', () => {
                    autocompleteStatsInput(el);
                    applyFilters();
                });
            }
        });

        ['#efp-hide-blue','#efp-hide-green','#efp-hide-red'].forEach(sel => {
            const el = qs(sel);
            if (el) el.addEventListener('change', applyFilters);
        });

        // Restore collapse state
        const isCollapsed = localStorage.getItem('efp-collapsed') === 'true';
        const body = qs('#efp-body');
        if (isCollapsed && body) {
            body.style.display = 'none';
            qs('#efp-collapse-btn').textContent = '+';
        }
    }

    /* ========================================================================
       DRAGGABLE PANEL
    ======================================================================== */

    function makePanelDraggable() {
        const panel = qs('#elimFilterPanel');
        const header = panel?.querySelector('.efp-header');
        if (!panel || !header) return;

        let dragging = false, offsetX = 0, offsetY = 0;

        header.style.cursor = "move";

        header.addEventListener("mousedown", e => {
            dragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        document.addEventListener("mousemove", e => {
            if (!dragging) return;
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top  = `${e.clientY - offsetY}px`;
            panel.style.right = "auto";
        });

        document.addEventListener("mouseup", () => dragging = false);
    }

    /* ========================================================================
       OBSERVER
    ======================================================================== */

    let scheduled = false;
    let mutationObserver = null;
    let rowObserver = null;

    function filterNewRows(mutations) {
        if (!scriptActive) return;

        const filters = getFilterSettings();
        let hasNewRows = false;

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.className && node.className.includes && node.className.includes('teamRow')) {
                    hasNewRows = true;
                    if (shouldHideRow(node, filters)) {
                        hideRow(node);
                    } else {
                        showRow(node);
                    }
                }
            }
        }

        if (hasNewRows) {
            updateStatistics(getRows());
        }
    }

    function startRowObserver() {
        const container = getRowContainer();
        if (!container || rowObserver) return;

        rowObserver = new MutationObserver(filterNewRows);
        rowObserver.observe(container, { childList: true, subtree: true });
    }

    function stopRowObserver() {
        if (rowObserver) {
            rowObserver.disconnect();
            rowObserver = null;
        }
    }

    function refresh() {
        if (!getElimRoot() || !getRowContainer()) return;
        createPanel();
        makePanelDraggable();
        _applyFilters();
        startRowObserver();
    }

    function scheduleRefresh() {
        if (!scriptActive || scheduled) return;
        scheduled = true;
        setTimeout(() => { scheduled = false; refresh(); }, 80);
    }

    scheduleRefresh();

    mutationObserver = new MutationObserver(() => {
        if (scriptActive) scheduleRefresh();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Poll for FF-Scouter stats updates every 2 seconds
    let lastStatsCheck = 0;
    setInterval(() => {
        if (!scriptActive) return;

        const rows = getRows();
        if (!rows.length) return;

        let statsCount = 0;
        for (const row of rows.slice(0, 10)) {
            const stats = extractStatsFromRow(row);
            if (stats !== null) {
                statsCount++;
            }
        }

        if (statsCount > lastStatsCheck) {
            lastStatsCheck = statsCount;
            _applyFilters();
        }
    }, 2000);



    // Create a global interface for stop/start
    window.efpStop = stopScript;
    window.efpStart = startScript;

})();

