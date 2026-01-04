// ==UserScript==
// @name         srsValuebsns strategy Sniper Glows by srsbsns
// @namespace    http://torn.com/
// @version      2.3
// @description  Advanced bazaar bargain highlighting with custom colors and labels Update:choose your own colours and write labels!
// @author       srsbsns
// @match        *://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561003/srsValuebsns%20strategy%20Sniper%20Glows%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/561003/srsValuebsns%20strategy%20Sniper%20Glows%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DEFAULT SETTINGS (matching your original structure) ---
    let igniteSettings = JSON.parse(localStorage.getItem('sniperSettings')) || {
        yellow: 3, yellowEnabled: true, yellowColor: '#ffff00', yellowLabel: '',
        orange: 10, orangeEnabled: true, orangeColor: '#ff8c00', orangeLabel: '',
        red: 20, redEnabled: true, redColor: '#ff0000', redLabel: ''
    };

    // --- CSS ANIMATIONS & STYLES ---
    GM_addStyle(`
        /* Base Effect Class */
        .ignite-active {
            position: relative;
            overflow: visible !important;
            border-radius: 4px;
            z-index: 1;
            border: 2px solid var(--fire-color) !important;
            box-shadow: inset 0 0 15px var(--fire-color), 0 0 10px var(--fire-color);
        }

        /* Custom Label */
        .sniper-label {
            position: absolute;
            top: 2px;
            right: 6px;
            background: rgba(50, 50, 50, 0.75);
            color: #ffffff;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10;
            pointer-events: none;
            border: 1px solid var(--fire-color);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
            white-space: nowrap;
        }

        /* Settings Menu */
        #ignite-menu {
            position: fixed;
            bottom: 35px;
            left: 20px;
            z-index: 1000000;
            background: #222;
            color: #ccc;
            border: 1px solid #444;
            border-radius: 5px;
            font-family: Tahoma, Arial, sans-serif;
            width: 200px;
            box-shadow: 0 0 10px #000;
            max-height: 600px;
            overflow: hidden;
        }

        #ignite-header {
            padding: 6px;
            cursor: pointer;
            background: #333;
            border-radius: 5px 5px 0 0;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
            color: #fff;
        }

        #ignite-content {
            display: none;
            padding: 10px;
            border-top: 1px solid #444;
            max-height: 520px;
            overflow-y: auto;
        }

        #ignite-content::-webkit-scrollbar {
            width: 6px;
        }

        #ignite-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 3px;
        }

        .tier-section {
            background: #2a2a2a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;
        }

        .tier-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px solid #444;
        }

        .tier-title {
            font-weight: bold;
            font-size: 10px;
            color: #fff;
            flex: 1;
        }

        .ignite-row {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 9px;
        }

        .ignite-label {
            color: #aaa;
            width: 50px;
            flex-shrink: 0;
            font-size: 9px;
        }

        .ignite-row input[type="number"] {
            width: 35px;
            background: #000;
            color: #fff;
            border: 1px solid #555;
            text-align: center;
            border-radius: 2px;
            font-size: 9px;
            padding: 2px;
        }

        .ignite-row input[type="color"] {
            width: 40px;
            height: 22px;
            background: #000;
            border: 1px solid #555;
            border-radius: 2px;
            cursor: pointer;
            padding: 1px;
        }

        .ignite-row input[type="text"] {
            flex: 1;
            background: #000;
            color: #fff;
            border: 1px solid #555;
            border-radius: 2px;
            font-size: 9px;
            padding: 2px 4px;
        }

        #ignite-save {
            width: 100%;
            cursor: pointer;
            background: #ce1111;
            color: #fff;
            border: none;
            padding: 8px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 11px;
            margin-top: 6px;
        }

        #ignite-save:hover {
            background: #e01313;
        }
    `);

    // --- MAIN LOGIC (based on your original) ---
    let isRunning = false; // Prevent simultaneous executions

    function runSniperLogic() {
        if (isRunning) return; // Prevent overlapping executions
        isRunning = true;

        const items = document.querySelectorAll('li, [class*="bazaar-card"], [class*="item_"], [class*="item___"]');

        items.forEach(item => {
            // Skip if already processed with current settings
            if (item.dataset.sniperProcessed === 'true') return;

            // Remove all classes
            item.classList.remove('ignite-active');
            item.style.removeProperty('--fire-color');

            // Remove any existing sniper labels (only our labels)
            const existingLabels = item.querySelectorAll('.sniper-label');
            existingLabels.forEach(label => label.remove());

            // Skip locked items
            if (item.querySelector('svg[class*="lock"], img[src*="lock"], [class*="locked"]')) {
                isRunning = false;
                return;
            }

            const possibleNodes = item.querySelectorAll('span, font');
            let matched = false;

            possibleNodes.forEach(node => {
                if (matched) return; // Only process first match

                const text = node.textContent;
                const match = text.match(/(\d+)%/);

                if (match) {
                    const style = window.getComputedStyle(node);
                    const rgb = style.color.match(/\d+/g);

                    if (rgb && rgb.length >= 3) {
                        const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);

                        // Check if green (your original check)
                        if ((g > (r + 40)) && (g > (b + 40))) {
                            const percent = parseInt(match[1]);
                            let appliedLabel = '';

                            // Apply highest matching tier (red → orange → yellow)
                            if (percent >= igniteSettings.red && igniteSettings.redEnabled) {
                                item.style.setProperty('--fire-color', igniteSettings.redColor);
                                item.classList.add('ignite-active');
                                appliedLabel = igniteSettings.redLabel;
                                matched = true;
                            } else if (percent >= igniteSettings.orange && igniteSettings.orangeEnabled) {
                                item.style.setProperty('--fire-color', igniteSettings.orangeColor);
                                item.classList.add('ignite-active');
                                appliedLabel = igniteSettings.orangeLabel;
                                matched = true;
                            } else if (percent >= igniteSettings.yellow && igniteSettings.yellowEnabled) {
                                item.style.setProperty('--fire-color', igniteSettings.yellowColor);
                                item.classList.add('ignite-active');
                                appliedLabel = igniteSettings.yellowLabel;
                                matched = true;
                            }

                            // Add custom label if set (only once)
                            if (matched && appliedLabel && appliedLabel.trim() !== '') {
                                const label = document.createElement('div');
                                label.className = 'sniper-label';
                                label.textContent = appliedLabel;
                                item.style.position = 'relative';
                                item.appendChild(label);
                            }
                        }
                    }
                }
            });

            // Mark as processed
            item.dataset.sniperProcessed = 'true';
        });

        isRunning = false;
    }

    // --- MENU GENERATION ---
    const menu = document.createElement('div');
    menu.id = 'ignite-menu';
    menu.innerHTML = `
        <div id="ignite-header">🎯 srsValuebsns | Strategy</div>
        <div id="ignite-content">
            <div class="tier-section">
                <div class="tier-header">
                    <input type="checkbox" id="check-red" ${igniteSettings.redEnabled ? 'checked' : ''}>
                    <span class="tier-title">Tier 3 (Highest)</span>
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Percent:</span>
                    <input type="number" id="in-red" value="${igniteSettings.red}" min="1" max="100">
                    <span style="color:#888;">%</span>
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Color:</span>
                    <input type="color" id="color-red" value="${igniteSettings.redColor}">
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Label:</span>
                    <input type="text" id="label-red" value="${igniteSettings.redLabel || ''}" placeholder="e.g. Great!">
                </div>
            </div>

            <div class="tier-section">
                <div class="tier-header">
                    <input type="checkbox" id="check-orange" ${igniteSettings.orangeEnabled ? 'checked' : ''}>
                    <span class="tier-title">Tier 2 (Medium)</span>
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Percent:</span>
                    <input type="number" id="in-orange" value="${igniteSettings.orange}" min="1" max="100">
                    <span style="color:#888;">%</span>
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Color:</span>
                    <input type="color" id="color-orange" value="${igniteSettings.orangeColor}">
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Label:</span>
                    <input type="text" id="label-orange" value="${igniteSettings.orangeLabel || ''}" placeholder="e.g. Good">
                </div>
            </div>

            <div class="tier-section">
                <div class="tier-header">
                    <input type="checkbox" id="check-yellow" ${igniteSettings.yellowEnabled ? 'checked' : ''}>
                    <span class="tier-title">Tier 1 (Lowest)</span>
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Percent:</span>
                    <input type="number" id="in-yellow" value="${igniteSettings.yellow}" min="1" max="100">
                    <span style="color:#888;">%</span>
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Color:</span>
                    <input type="color" id="color-yellow" value="${igniteSettings.yellowColor}">
                </div>
                <div class="ignite-row">
                    <span class="ignite-label">Label:</span>
                    <input type="text" id="label-yellow" value="${igniteSettings.yellowLabel || ''}" placeholder="e.g. OK">
                </div>
            </div>

            <button id="ignite-save">Save & Apply</button>
        </div>
    `;
    document.body.appendChild(menu);

    // --- EVENT LISTENERS (matching your original structure) ---
    document.getElementById('ignite-header').onclick = () => {
        const c = document.getElementById('ignite-content');
        c.style.display = (c.style.display === 'block') ? 'none' : 'block';
    };

    document.getElementById('ignite-save').onclick = () => {
        igniteSettings.redEnabled = document.getElementById('check-red').checked;
        igniteSettings.orangeEnabled = document.getElementById('check-orange').checked;
        igniteSettings.yellowEnabled = document.getElementById('check-yellow').checked;

        igniteSettings.red = parseInt(document.getElementById('in-red').value);
        igniteSettings.orange = parseInt(document.getElementById('in-orange').value);
        igniteSettings.yellow = parseInt(document.getElementById('in-yellow').value);

        igniteSettings.redColor = document.getElementById('color-red').value;
        igniteSettings.orangeColor = document.getElementById('color-orange').value;
        igniteSettings.yellowColor = document.getElementById('color-yellow').value;

        igniteSettings.redLabel = document.getElementById('label-red').value;
        igniteSettings.orangeLabel = document.getElementById('label-orange').value;
        igniteSettings.yellowLabel = document.getElementById('label-yellow').value;

        localStorage.setItem('sniperSettings', JSON.stringify(igniteSettings));

        // Clear all processed flags to force re-render
        document.querySelectorAll('[data-sniper-processed]').forEach(item => {
            delete item.dataset.sniperProcessed;
        });

        // Immediate visual update
        runSniperLogic();
    };

    // --- OBSERVER (your original) ---
    const observer = new MutationObserver((mutations) => {
        // Debounce: only run if new nodes were added
        let shouldRun = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
            }
        });

        if (shouldRun && !isRunning) {
            setTimeout(runSniperLogic, 100); // Small delay to batch updates
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    setTimeout(runSniperLogic, 500);
})();