// ==UserScript==
// @name         Torn ELIM Filter Panel
// @namespace    yoyoyossarian
// @license      MIT
// @version      3.4
// @description  Filtering (level, stats, attacks, FFScouter arrows) for ELIM team pages. Supports raw+percent stats. Auto-reapplies on infinite scroll.
// @match        https://www.torn.com/page.php?sid=competition*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558083/Torn%20ELIM%20Filter%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/558083/Torn%20ELIM%20Filter%20Panel.meta.js
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
       STATS MODE DETECTION (RAW OR PERCENT)
    ======================================================================== */

    function detectStatsMode() {
        const cell = document.querySelector('.TDup_ColoredStatsInjectionDiv .iconStats');
        if (!cell) return "raw"; // fallback
        return cell.innerText.includes('%') ? "percent" : "raw";
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

    /* ========================================================================
       FLEX INPUT PARSER (Accepts both raw + %)
       BUT will only return a value if it matches the current stats mode.
    ======================================================================== */

    function parseUserStatsInput(inputText, statsMode) {
        if (!inputText) return null;

        const txt = inputText.trim();

        // PERCENT INPUT?
        const isPercentInput = txt.includes("%") || txt.match(/^\d*\.?\d+$/);

        if (statsMode === "percent") {
            // Only percent input is valid
            if (isPercentInput) return parsePercentValue(txt);
            return null;
        }

        // statsMode === "raw"
        const raw = parseRawValue(txt);
        return raw;
    }

    /* ========================================================================
       STATS FROM ROW BASED ON MODE
    ======================================================================== */

    function extractStatsFromRow(row, statsMode) {
        const text = row.querySelector('.TDup_ColoredStatsInjectionDiv .iconStats')?.innerText.trim();
        if (!text) return 0;

        if (statsMode === "percent") {
            const pct = parsePercentValue(text);
            return pct === null ? 0 : pct;
        }

        return parseRawValue(text) || 0;
    }

    /* ========================================================================
       EXTRACT OTHER VALUES
    ======================================================================== */

    function parseIntSafe(text) {
        if (!text) return 0;
        const n = parseInt(text.replace(/[^0-9\-]/g, ''), 10);
        return Number.isNaN(n) ? 0 : n;
    }

    function extractValuesFromRow(row, statsMode) {
        const level   = parseIntSafe(row.querySelector('[class*="level"] span')?.innerText);
        const attacks = parseIntSafe(row.querySelector('[class*="attacks"] span')?.innerText);
        const stats   = extractStatsFromRow(row, statsMode);
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

    function readFilterValue(selector, parser) {
        const el = qs(selector);
        if (!el || !el.value.trim()) return null;
        return parser(el.value.trim());
    }

    /* ========================================================================
       APPLY FILTERS
    ======================================================================== */

    function applyFilters() {
        const rows = getRows();
        if (!rows.length) return;

        const statsMode = detectStatsMode();

        const minL = readFilterValue(filterFields.minLevel, parseIntSafe);
        const maxL = readFilterValue(filterFields.maxLevel, parseIntSafe);

        const minS = parseUserStatsInput(qs(filterFields.minStats)?.value, statsMode);
        const maxS = parseUserStatsInput(qs(filterFields.maxStats)?.value, statsMode);

        const minA = readFilterValue(filterFields.minAttacks, parseIntSafe);
        const maxA = readFilterValue(filterFields.maxAttacks, parseIntSafe);

        const hideBlue  = qs('#efp-hide-blue')?.checked;
        const hideGreen = qs('#efp-hide-green')?.checked;
        const hideRed   = qs('#efp-hide-red')?.checked;

        rows.forEach(row => {
            const { level, attacks, stats } = extractValuesFromRow(row, statsMode);
            const arrows = getArrowColors(row);

            let visible = true;

            if (minL !== null && level < minL) visible = false;
            if (maxL !== null && level > maxL) visible = false;

            if (minA !== null && attacks < minA) visible = false;
            if (maxA !== null && attacks > maxA) visible = false;

            if (minS !== null && stats < minS) visible = false;
            if (maxS !== null && stats > maxS) visible = false;

            if (hideBlue  && arrows.includes("blue"))  visible = false;
            if (hideGreen && arrows.includes("green")) visible = false;
            if (hideRed   && arrows.includes("red"))   visible = false;

            row.style.display = visible ? '' : 'none';
        });
    }

    function clearFilters() {
        Object.values(filterFields).forEach(sel => {
            const el = qs(sel);
            if (el) el.value = '';
        });

        ['#efp-hide-blue', '#efp-hide-green', '#efp-hide-red'].forEach(sel => {
            const el = qs(sel);
            if (el) el.checked = false;
        });

        applyFilters();
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
                <button id="efp-collapse-btn">−</button>
            </div>

            <div id="efp-body">
                <label>Level (Min → Max)
                    <div class="efp-range">
                        <input type="number" id="efp-min-level" placeholder="Min">
                        <input type="number" id="efp-max-level" placeholder="Max">
                    </div>
                </label>

                <label>Stats (Min → Max)
                    <div class="efp-range">
                        <input type="text" id="efp-min-stats" placeholder="500k or 80%">
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
            #efp-collapse-btn {
                all: unset; width: 14px; height: 14px;
                border: 1px solid #555; border-radius: 3px;
                color: #ccc; font-size: 10px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
            }
            #efp-body { padding: 8px; }
            .efp-range { display: flex; gap: 4px; margin-top: 2px; }
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
        });

        qs('#efp-clear-filters').addEventListener('click', clearFilters);

        Object.values(filterFields).forEach(sel => {
            const el = qs(sel);
            if (el) el.addEventListener('input', applyFilters);
        });

        ['#efp-hide-blue','#efp-hide-green','#efp-hide-red']
            .forEach(sel => qs(sel).addEventListener('change', applyFilters));
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

    function refresh() {
        if (!getElimRoot() || !getRowContainer()) return;
        createPanel();
        makePanelDraggable();
        applyFilters();
    }

    function scheduleRefresh() {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => { scheduled = false; refresh(); }, 80);
    }

    scheduleRefresh();

    new MutationObserver(() => scheduleRefresh())
        .observe(document.body, { childList: true, subtree: true });

})();
