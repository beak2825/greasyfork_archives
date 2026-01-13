// ==UserScript==
// @name         [USING] Torn Armory Cleaner
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Batch disposal cleaner. Features "Keep Best", "Exclude RW", Smart "Tricky Items" settings, and manual scroll. // 11/01/2026
// @author       LOKaa [2834316]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/562282/%5BUSING%5D%20Torn%20Armory%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/562282/%5BUSING%5D%20Torn%20Armory%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const STORAGE_KEY_TRICKY = 'TORN_CLEANER_TRICKY_LIST';
    const STORAGE_KEY_MINIMIZED = 'TORN_CLEANER_MINIMIZED';

    // Default list
    const DEFAULT_TRICKY = ["Blowgun"];

    // Load config
    let trickyList = [];
    try {
        trickyList = JSON.parse(localStorage.getItem(STORAGE_KEY_TRICKY));
        if (!Array.isArray(trickyList)) trickyList = DEFAULT_TRICKY;
    } catch (e) {
        trickyList = DEFAULT_TRICKY;
    }

    let isMinimized = localStorage.getItem(STORAGE_KEY_MINIMIZED) === 'true';

    // --- CSS ---
    GM_addStyle(`
        .cleaner-dash {
            background: #1b1b1b;
            border: 1px solid #333;
            border-radius: 8px;
            margin: 15px 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 13px;
            color: #ddd;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }
        .cleaner-header {
            background: linear-gradient(90deg, #8b0000, #4a0000);
            padding: 8px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #500;
        }
        .cleaner-title { font-weight: 700; font-size: 14px; color: #fff; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
        .cleaner-header-controls { display: flex; gap: 10px; }
        .cleaner-icon-btn { cursor: pointer; color: #ffcccc; font-size: 16px; opacity: 0.8; transition: 0.2s; background: none; border: none; }
        .cleaner-icon-btn:hover { color: #fff; opacity: 1; }

        .cleaner-content {
            padding: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            transition: max-height 0.3s ease-out;
            max-height: 500px;
        }
        .cleaner-content.minimized {
            max-height: 0;
            padding: 0 15px;
            overflow: hidden;
        }

        .cleaner-group { display: flex; flex-direction: column; gap: 5px; flex: 1 1 200px; }
        .cleaner-label { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; }
        .cleaner-select { background: #2a2a2a; border: 1px solid #444; color: #fff; padding: 8px; border-radius: 4px; width: 100%; outline: none; }
        .cleaner-checks { display: flex; gap: 15px; align-items: center; padding-top: 5px; }
        .cleaner-chk-label { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 12px; }
        .cleaner-chk-label input { accent-color: #8b0000; width: 16px; height: 16px; }

        .cleaner-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            width: 100%;
            border-top: 1px solid #333;
            padding-top: 15px;
            margin-top: 5px;
        }
        .cleaner-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 11px;
            transition: all 0.2s;
            text-align: center;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        .btn-select { background: #444; border: 1px solid #555; }
        .btn-select:hover { background: #555; border-color: #777; }
        .btn-trash { background: rgba(255, 68, 68, 0.15); border: 1px solid #d32f2f; color: #ff5252; }
        .btn-trash:hover { background: #d32f2f; color: #fff; box-shadow: 0 0 10px rgba(211, 47, 47, 0.4); }
        .btn-clear { background: transparent; border: 1px solid #444; color: #888; flex: 0 0 auto; }
        .btn-clear:hover { color: #ddd; border-color: #666; }
        .btn-scroll-give { background: #007bff; border: 1px solid #0056b3; flex: 0 0 50px; font-size: 16px; }
        .btn-scroll-give:hover { background: #0056b3; }

        .cleaner-stats { background: #111; padding: 4px 15px; font-size: 11px; color: #666; text-align: right; border-top: 1px solid #222; }

        /* Settings Modal */
        .cleaner-modal {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 99999; align-items: center; justify-content: center;
        }
        .cleaner-modal-box {
            background: #222; border: 1px solid #444; padding: 20px; border-radius: 8px; width: 400px;
            color: #ddd; box-shadow: 0 0 20px rgba(0,0,0,0.8);
        }
        .cleaner-modal h3 { margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 10px; color: #fff; }
        .cleaner-modal textarea {
            width: 100%; height: 150px; background: #111; border: 1px solid #444; color: #0f0;
            font-family: monospace; padding: 10px; margin: 10px 0; resize: vertical; outline: none;
        }
        .cleaner-modal-btns { display: flex; gap: 10px; justify-content: flex-end; }
        .cleaner-help { font-size: 11px; color: #888; margin-bottom: 10px; line-height: 1.4; }

        @media (max-width: 600px) {
            .cleaner-checks { width: 100%; justify-content: space-between; }
            .cleaner-btn { font-size: 10px; padding: 12px 5px; }
        }
    `);

    // --- Helpers ---

    function getActiveTabSelector() {
        if (document.querySelector('#armoury-weapons') && document.querySelector('#armoury-weapons').style.display !== 'none') return '#armoury-weapons';
        if (document.querySelector('#armoury-armour') && document.querySelector('#armoury-armour').style.display !== 'none') return '#armoury-armour';
        if (document.querySelector('#armoury-temporary') && document.querySelector('#armoury-temporary').style.display !== 'none') return '#armoury-temporary';
        return null;
    }

    // --- Core Logic ---

    function scanItems(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return [];

        const items = [];
        const rows = container.querySelectorAll('ul.item-list > li');

        rows.forEach((li, index) => {
            if (li.classList.contains('ts-placeholder')) return;

            // Name Parsing
            const nameEl = li.querySelector('.name');
            if (!nameEl) return;
            const rawName = nameEl.textContent.trim();
            const name = rawName.split(' x')[0];

            // Loan Status
            const loanLink = li.querySelector('.loaned a');
            const isLoaned = !!loanLink;

            // RW / Quality Logic
            let isRW = false;
            let isTricky = trickyList.includes(name);

            // 1. Check Visual Glow (Gold/Orange/Red is ALWAYS special/RW)
            const imgWrap = li.querySelector('.img-wrap');
            if (imgWrap) {
                if (imgWrap.classList.contains('glow-yellow') ||
                    imgWrap.classList.contains('glow-orange') ||
                    imgWrap.classList.contains('glow-red')) {
                    isRW = true;
                }
            }

            // 2. Check Bonuses ONLY if it's not already marked as RW by color
            // And ONLY if it is not in the Tricky List (Blowgun etc)
            if (!isRW && !isTricky) {
                const bonuses = li.querySelectorAll('ul.bonuses i[title]');
                let hasBonuses = false;
                bonuses.forEach(b => {
                    if (!b.getAttribute('title').includes('blank')) hasBonuses = true;
                });
                if (hasBonuses) isRW = true;
            }

            // Checkbox
            const checkbox = li.querySelector('input[type="checkbox"]');

            items.push({
                index: index,
                element: li,
                name: name,
                isLoaned: isLoaned,
                isRW: isRW,
                checkbox: checkbox
            });
        });

        return items;
    }

    function clearSelections(items) {
        items.forEach(item => {
            if (item.checkbox && item.checkbox.checked) item.checkbox.click();
        });
    }

    function applySelection(targetName, keepBest, excludeRW) {
        const selector = getActiveTabSelector();
        if (!selector) return;

        const items = scanItems(selector);
        clearSelections(items);

        let count = 0;
        const grouped = {};

        // Group items by name
        items.forEach(item => {
            if (!grouped[item.name]) grouped[item.name] = [];
            grouped[item.name].push(item);
        });

        for (const [itemName, groupItems] of Object.entries(grouped)) {
            // Filter by Name
            if (targetName !== 'ALL' && itemName !== targetName) continue;

            // Filter: Valid targets (not loaned)
            let validItems = groupItems.filter(i => !i.isLoaned);

            // Filter: Exclude RW
            if (excludeRW) {
                validItems = validItems.filter(i => !i.isRW);
            }

            // Filter: Keep Best (First one in the list is always best stats in Torn)
            if (keepBest && validItems.length > 0) {
                validItems.shift();
            }

            // Select
            validItems.forEach(item => {
                if (item.checkbox && !item.checkbox.checked && !item.checkbox.disabled) {
                    item.checkbox.click();
                    count++;
                }
            });
        }

        updateStatus(`Selected ${count} items.`);
    }

    function updateStatus(msg) {
        const el = document.getElementById('cleaner-status-text');
        if (el) el.textContent = msg;
    }

    function scrollToGiveBar(parentSelector) {
        const parent = document.querySelector(parentSelector);
        if (parent) {
            const giveBar = parent.querySelector('.give-all');
            if (giveBar) {
                giveBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert("Give bar not visible yet. Please select at least one item first.");
            }
        }
    }

    // --- UI Construction ---

    function buildDashboard() {
        const selector = getActiveTabSelector();
        if (!selector) return;
        const container = document.querySelector(selector);

        if (document.getElementById('cleaner-dash')) return; // Already exists

        const listHeader = container.querySelector('ul.list-title');
        if (!listHeader) return;

        // Dropdown Options
        const items = scanItems(selector);
        const uniqueNames = [...new Set(items.map(i => i.name))].sort();
        let optionsHtml = `<option value="ALL">-- ALL ITEMS --</option>`;
        uniqueNames.forEach(n => {
            optionsHtml += `<option value="${n}">${n}</option>`;
        });

        // Dashboard HTML
        const dash = document.createElement('div');
        dash.id = 'cleaner-dash';
        dash.className = 'cleaner-dash';
        dash.innerHTML = `
            <div class="cleaner-header">
                <div class="cleaner-title">
                    <span style="font-size:16px;">🧹</span> Armory Cleaner
                </div>
                <div class="cleaner-header-controls">
                    <span id="cleaner-status-text" class="cleaner-status" style="margin-right:10px; color:#aaa;">Ready</span>
                    <button id="btn-settings" class="cleaner-icon-btn" title="Tricky Items Settings">⚙️</button>
                    <button id="btn-minimize" class="cleaner-icon-btn" title="Toggle Dashboard">${isMinimized ? '➕' : '➖'}</button>
                </div>
            </div>

            <div class="cleaner-content ${isMinimized ? 'minimized' : ''}">
                <div class="cleaner-group" style="flex: 2;">
                    <span class="cleaner-label">Target Item Type</span>
                    <select id="cleaner-target" class="cleaner-select">${optionsHtml}</select>
                </div>

                <div class="cleaner-group" style="flex: 2;">
                    <span class="cleaner-label">Filters</span>
                    <div class="cleaner-checks">
                        <label class="cleaner-chk-label" title="Keep the 1st item of a group (Best stats)">
                            <input type="checkbox" id="cleaner-keep-best" checked> Keep Best
                        </label>
                        <label class="cleaner-chk-label" title="Ignore Yellow/Orange/Red items">
                            <input type="checkbox" id="cleaner-no-rw" checked> Exclude RW
                        </label>
                    </div>
                </div>

                <div class="cleaner-actions">
                    <button id="btn-select-target" class="cleaner-btn btn-trash">Select Target</button>
                    <button id="btn-select-trash" class="cleaner-btn btn-select" title="Target=All, KeepBest=Yes, NoRW=Yes">Select All Trash</button>
                    <button id="btn-clear-all" class="cleaner-btn btn-clear">Clear</button>
                    <button id="btn-scroll-down" class="cleaner-btn btn-scroll-give" title="Scroll to Give Button">⬇</button>
                </div>
            </div>

            <div class="cleaner-stats">
                Found ${items.length} items. Tricky List: ${trickyList.length} items.
            </div>

            <div id="cleaner-settings-modal" class="cleaner-modal">
                <div class="cleaner-modal-box">
                    <h3>Tricky Items Whitelist</h3>
                    <div class="cleaner-help">
                        LOKaa [2834316] </br>
                        -----------------------------</br>
                        Add items here (standard JSON format preferred).<br>
                        Items in this list will be treated as REGULAR items even if they have bonuses.<br>
                        <i>Example:</i><br>
                        <code style="color:#666">
                        [<br>
                          "Blowgun",<br>
                          "Trout"<br>
                        ]
                        </code>
                    </div>
                    <textarea id="tricky-input" spellcheck="false"></textarea>
                    <div class="cleaner-modal-btns">
                        <button id="btn-save-tricky" class="cleaner-btn btn-select">Save & Close</button>
                        <button id="btn-cancel-tricky" class="cleaner-btn btn-clear">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        container.insertBefore(dash, listHeader);

        // --- Event Binding ---

        // Minimize Toggle
        document.getElementById('btn-minimize').addEventListener('click', (e) => {
            const content = dash.querySelector('.cleaner-content');
            isMinimized = !isMinimized;
            localStorage.setItem(STORAGE_KEY_MINIMIZED, isMinimized);
            content.classList.toggle('minimized', isMinimized);
            e.target.textContent = isMinimized ? '➕' : '➖';
        });

        // Settings Modal Controls
        const modal = document.getElementById('cleaner-settings-modal');
        const txtArea = document.getElementById('tricky-input');

        document.getElementById('btn-settings').addEventListener('click', () => {
            // Display neatly formatted JSON
            txtArea.value = JSON.stringify(trickyList, null, 2);
            modal.style.display = 'flex';
        });

        document.getElementById('btn-cancel-tricky').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // -- Smart Save Handler --
        document.getElementById('btn-save-tricky').addEventListener('click', () => {
            let raw = txtArea.value.trim();
            let parsed = [];

            try {
                // Attempt 1: Parse strict JSON
                parsed = JSON.parse(raw);
            } catch (e) {
                // Attempt 2: Smart Recovery
                // User might have messed up syntax or used simple list.
                // We split by newline, then strip standard JSON syntax chars (brackets, quotes, commas)
                // This converts `["Item",` or `Item,` or `[Item]` into just `Item`
                parsed = raw.split('\n')
                    .map(line => line.replace(/[\[\]",]/g, '').trim())
                    .filter(line => line.length > 0);
            }

            if (Array.isArray(parsed)) {
                // Remove duplicates and save
                trickyList = [...new Set(parsed)];
                localStorage.setItem(STORAGE_KEY_TRICKY, JSON.stringify(trickyList));
                modal.style.display = 'none';
                updateStatus('Settings Saved. Refreshing...');
                setTimeout(() => { dash.remove(); buildDashboard(); }, 200);
            } else {
                alert("Could not interpret list. Please verify format.");
            }
        });

        // Actions
        document.getElementById('btn-select-target').addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('cleaner-target').value;
            const keepBest = document.getElementById('cleaner-keep-best').checked;
            const excludeRW = document.getElementById('cleaner-no-rw').checked;
            applySelection(target, keepBest, excludeRW);
        });

        document.getElementById('btn-select-trash').addEventListener('click', (e) => {
            e.preventDefault();
            applySelection('ALL', true, true);
        });

        document.getElementById('btn-clear-all').addEventListener('click', (e) => {
            e.preventDefault();
            clearSelections(scanItems(selector));
            updateStatus('Cleared.');
        });

        document.getElementById('btn-scroll-down').addEventListener('click', (e) => {
            e.preventDefault();
            scrollToGiveBar(selector);
        });
    }

    // --- Observer ---
    let debounce = null;
    const observer = new MutationObserver((mutations) => {
        const isInternal = mutations.every(m => m.target.closest('#cleaner-dash'));
        if (isInternal) return;

        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
            const selector = getActiveTabSelector();
            if (selector) {
                const container = document.querySelector(selector);
                const dash = document.getElementById('cleaner-dash');
                // Check if dash is missing or in wrong container
                if (!dash || (container && !container.contains(dash))) {
                    if (dash) dash.remove();
                    buildDashboard();
                }
            }
        }, 300);
    });

    function init() {
        const target = document.getElementById('faction-armoury-tabs');
        if (target) {
            observer.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'aria-expanded'] });
            buildDashboard();
        } else {
            setTimeout(init, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();