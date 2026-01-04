// ==UserScript==
// @name         Torn Elimination Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Filter players by Status, Level, Attacks, and BSP Stats (Min & Max)
// @author       You
// @match        https://www.torn.com/page.php?sid=competition*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558544/Torn%20Elimination%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558544/Torn%20Elimination%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_elim_filter_v6';
    let rowObserver = null;
    let lastUrl = location.href;

    // --- CSS STYLES ---
    GM_addStyle(`
        #torn-elim-filter-bar {
            background: linear-gradient(180deg, #333 0%, #222 100%);
            border: 1px solid #444;
            border-radius: 8px;
            padding: 12px;
            margin: 10px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            font-family: 'Arial', sans-serif;
            font-size: 13px;
            color: #ddd;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 1000;
        }
        #torn-elim-filter-bar .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #444;
            padding: 5px 10px;
            border-radius: 4px;
            border: 1px solid #555;
        }
        #torn-elim-filter-bar label {
            font-weight: bold;
            color: #bbb;
            cursor: pointer;
            user-select: none;
        }
        #torn-elim-filter-bar input[type="number"], #torn-elim-filter-bar input[type="text"] {
            background: #222;
            border: 1px solid #555;
            color: #fff;
            padding: 4px;
            border-radius: 3px;
            text-align: center;
        }
        #torn-elim-filter-bar input[type="checkbox"] {
            accent-color: #85c742;
            cursor: pointer;
            width: 14px;
            height: 14px;
        }
        #torn-elim-filter-bar select {
            background: #222;
            border: 1px solid #555;
            color: #fff;
            padding: 4px;
            border-radius: 3px;
        }
    `);

    // --- SELECTORS ---
    const SEL = {
        container: '.virtualContainer___Ft72x',
        row: '.dataGridRow___FAAJF.teamRow___R3ZLF',
        status: '.status___w4nOU',
        level: '.level___GCOaT',
        attacks: '.attacks___IJtzw',
        stats: '.TDup_ColoredStatsInjectionDivWithoutHonorBar .iconStats, .iconStats'
    };

    // --- CONFIGURATION ---
    let config = {
        minLevel: 0,
        maxLevel: 100,
        minAttacks: 0,
        maxAttacks: 99999,
        minStatsInput: '',
        maxStatsInput: '',
        onlyShowOkay: false,
        filterMode: 'opacity'
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try { config = { ...config, ...JSON.parse(saved) }; } catch (e) {}
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    function parseStatString(str) {
        if (!str) return 0;
        str = str.toLowerCase().replace(/,/g, '').trim();
        let multiplier = 1;
        if (str.endsWith('k')) multiplier = 1e3;
        else if (str.endsWith('m')) multiplier = 1e6;
        else if (str.endsWith('b')) multiplier = 1e9;
        else if (str.endsWith('t')) multiplier = 1e12;
        else if (str.endsWith('q')) multiplier = 1e15;
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num * multiplier;
    }

    // --- UI CREATION ---
    function createInterface() {
        if (document.getElementById('torn-elim-filter-bar')) return;

        // Try multiple targets for injection stability
        const target = document.querySelector('.filterContainer___hjP9P') ||
                       document.querySelector('.teamPageWrapper___WTu3D') ||
                       document.querySelector('.dataGrid___cmuUc');

        if (!target) return;

        const bar = document.createElement('div');
        bar.id = 'torn-elim-filter-bar';

        const isChecked = (val) => val ? 'checked' : '';

        bar.innerHTML = `
            <div class="filter-group">
                <input type="checkbox" id="tef-okay" ${isChecked(config.onlyShowOkay)}>
                <label for="tef-okay" style="color:#85c742">Only Show "Okay"</label>
            </div>
            <div class="filter-group">
                <span style="color:#888; font-size:10px; margin-right:5px; text-transform:uppercase;">Stats</span>
                <input type="text" id="tef-min-stats" value="${config.minStatsInput}" placeholder="Min (1m)" style="width: 60px;">
                <span>-</span>
                <input type="text" id="tef-max-stats" value="${config.maxStatsInput}" placeholder="Max (5b)" style="width: 60px;">
            </div>
            <div class="filter-group">
                <span style="color:#888; font-size:10px; margin-right:5px; text-transform:uppercase;">Level</span>
                <input type="number" id="tef-min-lvl" value="${config.minLevel}" min="1" max="100" style="width:40px">
                <span>-</span>
                <input type="number" id="tef-max-lvl" value="${config.maxLevel}" min="1" max="100" style="width:40px">
            </div>
            <div class="filter-group">
                <span style="color:#888; font-size:10px; margin-right:5px; text-transform:uppercase;">Attacks</span>
                <input type="number" id="tef-min-atk" value="${config.minAttacks}" placeholder="Min" style="width:40px">
                <span>-</span>
                <input type="number" id="tef-max-atk" value="${config.maxAttacks === 99999 ? '' : config.maxAttacks}" placeholder="Max" style="width:50px;">
            </div>
            <div class="filter-group" style="margin-left:auto; background:none; border:none;">
                <select id="tef-mode">
                    <option value="opacity" ${config.filterMode === 'opacity' ? 'selected' : ''}>Dimmed</option>
                    <option value="hide" ${config.filterMode === 'hide' ? 'selected' : ''}>Hidden</option>
                </select>
            </div>
        `;

        // Insert before the target, or as first child if no parent
        if(target.parentNode) {
            target.parentNode.insertBefore(bar, target);
        } else {
            target.prepend(bar);
        }

        attachListeners();
    }

    function updateSetting(key, value) {
        config[key] = value;
        saveConfig();
        reapplyFilters();
    }

    function attachListeners() {
        const get = (id) => document.getElementById(id);
        if(!get('tef-okay')) return; // Safety check

        get('tef-okay').addEventListener('change', e => updateSetting('onlyShowOkay', e.target.checked));
        get('tef-min-stats').addEventListener('input', e => updateSetting('minStatsInput', e.target.value));
        get('tef-max-stats').addEventListener('input', e => updateSetting('maxStatsInput', e.target.value));
        get('tef-min-lvl').addEventListener('input', e => updateSetting('minLevel', parseInt(e.target.value) || 0));
        get('tef-max-lvl').addEventListener('input', e => updateSetting('maxLevel', parseInt(e.target.value) || 100));
        get('tef-min-atk').addEventListener('input', e => updateSetting('minAttacks', parseInt(e.target.value) || 0));
        get('tef-max-atk').addEventListener('input', e => updateSetting('maxAttacks', e.target.value === '' ? 99999 : parseInt(e.target.value)));
        get('tef-mode').addEventListener('change', e => updateSetting('filterMode', e.target.value));
    }

    function shouldHideRow(row) {
        if (config.onlyShowOkay) {
            const statusNode = row.querySelector(SEL.status);
            if (statusNode && !statusNode.innerText.trim().toLowerCase().includes('okay')) return true;
        }

        if (config.minStatsInput || config.maxStatsInput) {
            const statNode = row.querySelector(SEL.stats);
            if (statNode) {
                const playerStats = parseStatString(statNode.innerText);
                const minLimit = parseStatString(config.minStatsInput);
                const maxLimit = parseStatString(config.maxStatsInput);
                if (minLimit > 0 && playerStats < minLimit) return true;
                if (maxLimit > 0 && playerStats > maxLimit) return true;
            }
        }

        const lvlNode = row.querySelector(SEL.level);
        if (lvlNode) {
            const lvl = parseInt(lvlNode.innerText.trim());
            if (lvl < config.minLevel || lvl > config.maxLevel) return true;
        }

        const atkNode = row.querySelector(SEL.attacks);
        if (atkNode) {
            const attacks = parseInt(atkNode.innerText.replace(/,/g, '').trim()) || 0;
            if (attacks < config.minAttacks || attacks > config.maxAttacks) return true;
        }

        return false;
    }

    function applyVisuals(row, shouldHide) {
        if (shouldHide) {
            if (config.filterMode === 'hide') {
                row.style.display = 'none';
            } else {
                row.style.display = '';
                row.style.opacity = '0.05';
                row.style.pointerEvents = 'none';
                row.style.filter = 'grayscale(100%)';
            }
        } else {
            row.style.display = '';
            row.style.opacity = '1';
            row.style.pointerEvents = 'auto';
            row.style.filter = 'none';
        }
    }

    function processRows(rows) {
        rows.forEach(row => {
            if (row.matches(SEL.row)) applyVisuals(row, shouldHideRow(row));
        });
    }

    function reapplyFilters() {
        const container = document.querySelector(SEL.container);
        if (container) processRows(container.querySelectorAll(SEL.row));
    }

    // --- INIT ---
    function checkAndInit() {
        const container = document.querySelector(SEL.container);
        const existingBar = document.getElementById('torn-elim-filter-bar');

        if (container && !existingBar) {
            console.log("Torn Filter: Found list, initializing...");
            createInterface();
            reapplyFilters();

            if (rowObserver) rowObserver.disconnect();
            rowObserver = new MutationObserver((mutations) => {
                let newNodes = [];
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches(SEL.row)) newNodes.push(node);
                    });
                });
                if (newNodes.length > 0) processRows(newNodes);
            });
            rowObserver.observe(container, { childList: true, subtree: true });
        }
    }

    // --- MAIN LOOP & URL DETECTION ---
    setInterval(() => {
        // 1. Check if URL changed
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log("Torn Filter: URL changed, checking UI...");
            setTimeout(checkAndInit, 500);
        }

        // 2. Regular check in case the DOM was wiped
        checkAndInit();
    }, 1000);

})();