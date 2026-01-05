// ==UserScript==
// @name         Elimination Team FF Filter + Quick Attack
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds FF Filters and quick attack button
// @author       WinterValor [3945658]
// @match        https://www.torn.com/page.php?sid=competition*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558433/Elimination%20Team%20FF%20Filter%20%2B%20Quick%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/558433/Elimination%20Team%20FF%20Filter%20%2B%20Quick%20Attack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_PREFIX = 'tm_scouter_filter_';
    // Arrow images: works for both PC & TornPDA (same tt-ff-scouter-arrow img)
    const ARROW_SELECTOR =
        'img.tt-ff-scouter-arrow, img[src*="blue-arrow"], img[src*="green-arrow"], img[src*="red-arrow"]';

    function isTeamPage() {
        return window.location.hash.startsWith('#/team/');
    }

    function waitFor(selector, timeoutMs = 15000) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) {
                resolve(existing);
                return;
            }
            const start = Date.now();
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                } else if (Date.now() - start > timeoutMs) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 250);
        });
    }

    function injectStyles() {
        if (document.getElementById('tm-scouter-style')) return;

        const style = document.createElement('style');
        style.id = 'tm-scouter-style';
        style.textContent = `
            /* Put "Only show available targets" and filters on one row */
            #eliminationRoot .choice-container,
            #eliminationRoot div[class^="choice-container"] {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                flex-wrap: wrap;
                column-gap: 8px;
            }

            #eliminationRoot .scouter-filter-wrap {
                display: inline-flex;
                align-items: center;
            }

            #eliminationRoot .scouter-filter-wrap label {
                margin-left: 3px;
            }

            /* Style for our quick-attack button */
            .tm-attack-btn {
                margin-right: 4px;
                padding: 1px 4px;
                font-size: 11px;
                line-height: 1;
                cursor: pointer;
                background: rgba(0,0,0,0.3);
                border: 1px solid #666;
                border-radius: 3px;
                color: #ff6666;
            }

            .tm-attack-btn:hover {
                border-color: #ff6666;
            }
        `;
        document.head.appendChild(style);
    }

    // STRICT color detection: only from the arrow <img> src/alt/title
    function getColorFromArrow(img) {
        if (!img) return null;
        const src = (img.getAttribute('src') || '').toLowerCase();
        const alt = (img.getAttribute('alt') || img.getAttribute('title') || '').toLowerCase();

        const blob = src + ' ' + alt;

        if (blob.includes('blue-arrow')) return 'blue';
        if (blob.includes('green-arrow')) return 'green';
        if (blob.includes('red-arrow')) return 'red';

        // Fallback: extremely unlikely needed, but leave in
        if (blob.includes('blue')) return 'blue';
        if (blob.includes('green')) return 'green';
        if (blob.includes('red')) return 'red';

        return null;
    }

    function getRows() {
        const root = document.getElementById('eliminationRoot') || document;
        return root.querySelectorAll('div[class^="dataGridRow"]');
    }

    // --- per-row quick attack button ---
    function addAttackButton(row) {
        // Avoid duplicates
        if (row.querySelector('.tm-attack-btn')) return;

        const anchor = row.querySelector('a[href*="/profiles.php?XID="]');
        if (!anchor) return;

        const href = anchor.getAttribute('href') || '';
        const match = href.match(/XID=(\d+)/);
        if (!match) return;

        const userId = match[1];

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tm-attack-btn';
        btn.textContent = '⚔';
        btn.title = 'Quick attack';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
            window.open(url, '_blank');
        });

        // Put the button before the name link
        const cell = anchor.parentElement || row;
        cell.insertBefore(btn, anchor);
    }

    function applyFilters() {
        const blueInput = document.getElementById('scouter-filter-blue');
        const greenInput = document.getElementById('scouter-filter-green');
        const redInput = document.getElementById('scouter-filter-red');
        const unknownInput = document.getElementById('scouter-filter-unknown');

        const showBlue = blueInput ? blueInput.checked : true;
        const showGreen = greenInput ? greenInput.checked : true;
        const showRed = redInput ? redInput.checked : true;
        const showUnknown = unknownInput ? unknownInput.checked : true;

        const rows = getRows();

        // If there are literally no arrow images at all, don't let filters hide everything.
        const anyArrowEver = document.querySelector(ARROW_SELECTOR);
        if (!anyArrowEver) {
            rows.forEach(row => {
                const anchor = row.querySelector('a[href*="/profiles.php?XID="]');
                if (!anchor) return; // keep non-player rows unchanged
                row.style.display = '';
            });
            return;
        }

        rows.forEach(row => {
            const anchor = row.querySelector('a[href*="/profiles.php?XID="]');
            const isPlayerRow = !!anchor;

            // Keep header / non-player rows always visible
            if (!isPlayerRow) {
                row.style.display = '';
                return;
            }

            // Find the arrow image in this row
            const arrowEl = row.querySelector(ARROW_SELECTOR);
            const color = getColorFromArrow(arrowEl);

            // No arrow or unknown color => Unknown bucket
            if (!arrowEl || !color) {
                row.style.display = showUnknown ? '' : 'none';
                return;
            }

            if (color === 'blue') {
                row.style.display = showBlue ? '' : 'none';
            } else if (color === 'green') {
                row.style.display = showGreen ? '' : 'none';
            } else if (color === 'red') {
                row.style.display = showRed ? '' : 'none';
            } else {
                // Anything unexpected -> treat as Unknown
                row.style.display = showUnknown ? '' : 'none';
            }
        });
    }

    function processRows() {
        const rows = getRows();
        rows.forEach(row => addAttackButton(row));
        applyFilters();
    }

    let observer = null;

    function setupObserver() {
        if (observer) return;

        const root = document.getElementById('eliminationRoot');
        if (!root) return;

        const container =
            root.querySelector('div[class^="virtualContainer"]') ||
            root.querySelector('div[class^="dataGridBody"]') ||
            root;

        let scheduled = false;
        function scheduleProcess() {
            if (scheduled) return;
            scheduled = true;
            setTimeout(() => {
                scheduled = false;
                processRows();
            }, 50);
        }

        observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'childList' &&
                    (m.addedNodes.length || m.removedNodes.length)) {
                    scheduleProcess();
                    break;
                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    async function init() {
        if (!isTeamPage()) return;

        injectStyles();

        // If filters already exist (e.g. hashchange), just re-process rows
        if (document.getElementById('scouter-filter-blue')) {
            processRows();
            return;
        }

        const baseLabel = await waitFor('label[for="show-available-targets"]');
        if (!baseLabel) return;

        const choiceContainer =
            baseLabel.closest('.choice-container') || baseLabel.parentElement;
        if (!choiceContainer) return;

        // Hook into "Only show available targets"
        const osatInput = document.getElementById('show-available-targets');
        if (osatInput && !osatInput.dataset.tmHandler) {
            osatInput.dataset.tmHandler = '1';
            osatInput.addEventListener('change', () => {
                setTimeout(processRows, 150);
            });
        }

        // Blue / Green / Red / Unknown filters
        const colors = ['blue', 'green', 'red', 'unknown'];
        const niceName = {
            blue: 'Blue',
            green: 'Green',
            red: 'Red',
            unknown: 'Unknown'
        };
        const textColor = {
            blue: '#5fa9ff',
            green: '#66cc66',
            red: '#ff6666',
            unknown: '#cccccc'
        };

        colors.forEach(color => {
            const wrap = document.createElement('div');
            wrap.className = 'checkbox-wrap scouter-filter-wrap scouter-filter-' + color;

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'scouter-filter-' + color;
            input.className = 't3-s-checkbox-css';

            const stored = localStorage.getItem(STORAGE_PREFIX + color);
            input.checked = stored === null ? true : stored === '1';

            const label = document.createElement('label');
            label.className = 'marker-css';
            label.htmlFor = input.id;
            label.textContent = niceName[color];
            label.style.color = textColor[color];

            input.addEventListener('change', () => {
                localStorage.setItem(
                    STORAGE_PREFIX + color,
                    input.checked ? '1' : '0'
                );
                applyFilters();
            });

            wrap.appendChild(input);
            wrap.appendChild(label);
            choiceContainer.appendChild(wrap);
        });

        setupObserver();
        processRows();
    }

    const readyInterval = setInterval(() => {
        if (document.readyState === 'complete' ||
            document.readyState === 'interactive') {
            clearInterval(readyInterval);
            init();
        }
    }, 200);

    window.addEventListener('hashchange', () => {
        setTimeout(init, 200);
    });
})();
