// ==UserScript==
// @name         Facebook Marketplace regex filter for search results
// @namespace    fbm-regex-filter
// @version      1.0
// @description  Adds a regex filter under the Marketplace search bar, aligned with native UI
// @match        https://www.facebook.com/marketplace*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556725/Facebook%20Marketplace%20regex%20filter%20for%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/556725/Facebook%20Marketplace%20regex%20filter%20for%20search%20results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ROW_ID = 'fbm-regex-row-final';
    let activeRegex = null;

    // The layout changes constantly on Facebook, but Marketplace item tiles
    // always follow a pattern: they are large flex containers with width limits
    // and contain an item link. This function reliably returns only those tiles.
    function getTiles() {
        return Array.from(
            document.querySelectorAll('div[style*="max-width"][style*="min-width"]')
        ).filter(t => t.querySelector('a[href*="/marketplace/item/"]'));
    }

    // Runs every time the regex changes. Each tile's text is read,
    // the price line is removed, and the remaining text is evaluated.
    // Tiles not matching the regex are hidden; others remain visible.
    function applyFilter() {
        const tiles = getTiles();

        tiles.forEach(tile => {
            let fullText = tile.innerText || '';

            // The first line of the tile text always represents the price.
            // Removing that prevents numbers on the price line from producing false matches.
            const lines = fullText.split('\n');
            lines.shift(); // remove price line

            const searchable = lines.join('\n').trim();

            if (!activeRegex || activeRegex.test(searchable)) {
                tile.style.display = '';
            } else {
                tile.style.display = 'none';
            }
        });
    }

    // Builds the new UI row that appears directly under the Marketplace search bar.
    // The row mimics Facebook's Level 3 container so alignment and spacing are perfect.
    function buildRegexRow(level3) {
        const cs = getComputedStyle(level3);

        const row = document.createElement('div');
        row.id = ROW_ID;

        // Copy the structural layout of the Level 3 container so the new row fits seamlessly.
        row.style.display = cs.display;
        row.style.flexDirection = cs.flexDirection;
        row.style.alignItems = cs.alignItems;
        row.style.justifyContent = cs.justifyContent;
        row.style.paddingLeft = cs.paddingLeft;
        row.style.paddingRight = cs.paddingRight;
        row.style.marginTop = '6px';
        row.style.boxSizing = 'border-box';

        // Internal wrapper that matches Facebook’s column layout.
        const inner = document.createElement('div');
        inner.style.display = 'flex';
        inner.style.flexDirection = 'column';
        inner.style.width = '100%';

        // Text label for the input field.
        const label = document.createElement('div');
        label.textContent = 'Regex Filter';
        label.style.fontFamily = 'Helvetica, Arial, sans-serif';
        label.style.fontSize = '20px';
        label.style.fontWeight = '700';
        label.style.color = 'rgb(226,229,233)';
        label.style.marginBottom = '6px';
        label.style.whiteSpace = 'nowrap';

        // The container that visually resembles Facebook’s search pill.
        const pill = document.createElement('div');
        pill.style.display = 'flex';
        pill.style.alignItems = 'center';
        pill.style.height = '36px';
        pill.style.background = 'rgb(51,51,52)';
        pill.style.borderRadius = '50px';
        pill.style.padding = '0 12px';
        pill.style.boxSizing = 'border-box';

        // Small search icon for visual consistency.
        const icon = document.createElement('span');
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.marginRight = '8px';
        icon.innerHTML = `
            <svg viewBox="0 0 16 16" width="16" height="16"
                 fill="rgb(176,179,184)">
                <path d="M10.743 2.257a6 6 0 1 1-8.485 8.486
                        6 6 0 0 1 8.485-8.486zM9.683 3.317a4.5
                        4.5 0 1 0-6.365 6.364 4.5 4.5 0 0
                        0 6.364-6.363z"></path>
            </svg>`;

        // The actual regex input field.
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter regex (example: washer|dryer)';
        input.autocomplete = 'off';
        input.spellcheck = false;

        Object.assign(input.style, {
            flex: '1',
            height: '36px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: 'rgb(226,229,233)',
            padding: '0 6px',
        });

        // Whenever the field changes, the regex is rebuilt and tiles are refreshed.
        input.addEventListener('input', () => {
            const v = input.value.trim();
            if (!v) {
                activeRegex = null;
                applyFilter();
                return;
            }
            try {
                activeRegex = new RegExp(v, 'i');
            } catch {
                activeRegex = null; // Invalid regex → disable filtering
            }
            applyFilter();
        });

        // Assemble the UI.
        pill.appendChild(icon);
        pill.appendChild(input);
        inner.appendChild(label);
        inner.appendChild(pill);
        row.appendChild(inner);

        return row;
    }

    // Places the regex row directly under Facebook's real search container.
    // Level 3 is reached by moving upward 3 parents from the search input label.
    function insertRegexRow() {
        if (document.getElementById(ROW_ID)) return;

        const searchInput = document.querySelector('input[placeholder="Search Marketplace"]');
        if (!searchInput) return;

        const pillLabel = searchInput.closest('label');
        if (!pillLabel) return;

        let level3 = pillLabel;
        for (let i = 0; i < 3 && level3; i++) {
            level3 = level3.parentElement;
        }
        if (!level3) return;

        const parent = level3.parentElement;
        if (!parent) return;

        const row = buildRegexRow(level3);

        // Insert immediately below Level 3 for perfect alignment.
        if (level3.nextSibling) {
            parent.insertBefore(row, level3.nextSibling);
        } else {
            parent.appendChild(row);
        }
    }

    // Facebook Marketplace is a single-page application.
    // This observer runs on every navigation event or DOM patch.
    // It re-inserts the filter row when needed and re-applies the filter on new items.
    const mo = new MutationObserver(() => {
        insertRegexRow();
        if (activeRegex) applyFilter();
    });

    mo.observe(document.body, { childList: true, subtree: true });

    // Initial placement of the UI when the script loads.
    insertRegexRow();
})();
