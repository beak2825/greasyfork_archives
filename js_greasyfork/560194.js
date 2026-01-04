// ==UserScript==
// @name         SteamCardExchange Card Highlighter
// @namespace    https://github.com/kuvl/sce-card-highlighter
// @version      1.0
// @description  Highlight trading cards with one click and export/import your list
// @author       kuvl
// @match        https://www.steamcardexchange.net/index.php?inventorygame-appid-*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560194/SteamCardExchange%20Card%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/560194/SteamCardExchange%20Card%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'sce-card-highlighter';

    function loadData() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
            console.error('SCE Highlighter: Error loading data', e);
            return {};
        }
    }

    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('SCE Highlighter: Error saving data', e);
            alert('❌ Storage limit exceeded or error saving data');
        }
    }

    function getAppId() {
        const m = location.search.match(/inventorygame-appid-(\d+)/);
        return m ? m[1] : null;
    }

    function getGameName() {
        const el = document.querySelector('h1, h2');
        return el ? el.innerText.trim() : 'Unknown game';
    }

    /* Make card clickable */
    function makeCardClickable(card, index) {
        if (card.dataset.sceInit) return;
        card.dataset.sceInit = '1';

        const appId = getAppId();
        const data = loadData();

        function apply(state) {
            if (state === 'need') {
                card.style.backgroundColor = 'rgba(59, 130, 246, 0.10)';
            } else {
                card.style.backgroundColor = '';
            }
        }

        const saved = data?.[appId]?.cards?.[index] || '';
        apply(saved);

        const img = card.querySelector('img');
        if (img) {
            img.style.cursor = 'pointer';
            img.onclick = (e) => {
                e.stopPropagation();
                const d = loadData();
                if (!d[appId]) {
                    d[appId] = {
                        name: getGameName(),
                        cards: {}
                    };
                }
                // Toggle state
                d[appId].cards[index] = d[appId].cards[index] === 'need' ? '' : 'need';

                // Cleanup empty entries to save space
                if (!d[appId].cards[index]) {
                    delete d[appId].cards[index];
                }

                saveData(d);
                apply(d[appId].cards[index]);
            };
        }
    }

    function scanCards() {
        const cards = document.querySelectorAll('.grid > div.flex-col:not(.hidden)');
        cards.forEach((card, i) => makeCardClickable(card, i));
    }

    /* Add export/import buttons on game page */
    function addToolbar() {
        if (!location.search.match(/inventorygame-appid-(\d+)/)) return;
        if (document.querySelector('#sceGameToolbar')) return;

        const container = document.querySelector('div.bg-gray-dark.flex-wrap');
        if (!container) return;

        container.style.position = 'relative';

        const toolbar = document.createElement('div');
        toolbar.id = 'sceGameToolbar';
        toolbar.style.cssText = 'position:absolute; bottom:1px; right:16px; display:flex;';

        const btnStyle = 'cursor:pointer; font-size:20px; transition: opacity 0.2s; user-select: none;';

        // Export Button
        const exportBtn = document.createElement('div');
        exportBtn.textContent = '⬆️';
        exportBtn.title = 'Export All Highlights';
        exportBtn.style.cssText = btnStyle;
        exportBtn.onmouseover = () => exportBtn.style.opacity = '0.7';
        exportBtn.onmouseout = () => exportBtn.style.opacity = '1';

        exportBtn.onclick = () => {
            const data = loadData();
            if (Object.keys(data).length === 0) {
                alert('No highlights saved yet');
                return;
            }
            try {
                navigator.clipboard.writeText(JSON.stringify(data));
                alert('✅ All highlights exported to clipboard!');
            } catch (err) {
                prompt('Copy this data:', JSON.stringify(data));
            }
        };

        // Import Button
        const importBtn = document.createElement('div');
        importBtn.textContent = '⬇️';
        importBtn.title = 'Import All Highlights';
        importBtn.style.cssText = btnStyle;
        importBtn.onmouseover = () => importBtn.style.opacity = '0.7';
        importBtn.onmouseout = () => importBtn.style.opacity = '1';

        importBtn.onclick = () => {
            const input = prompt('Paste your exported highlights:');
            if (!input) return;
            try {
                const data = JSON.parse(input);
                saveData(data);
                alert('✅ All highlights imported! Reloading...');
                location.reload();
            } catch (err) {
                alert('❌ Invalid data format');
            }
        };

        toolbar.appendChild(exportBtn);
        toolbar.appendChild(importBtn);
        container.appendChild(toolbar);
    }

    // Init
    const observer = new MutationObserver(() => {
        scanCards();
        addToolbar();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // First run
    setTimeout(() => {
        scanCards();
        addToolbar();
    }, 500);

})();

