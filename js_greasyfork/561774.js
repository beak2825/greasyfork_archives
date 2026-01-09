// ==UserScript==
// @name         Execute Highlight
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlight #weapon_second in RED when target health is below a set threshold
// @author       Gemini + Omanpx
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561774/Execute%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/561774/Execute%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION
    const TARGET_WEAPON_ID = 'weapon_second';
    const STORAGE_KEY = 'torn_weapon_highlight_threshold';

    // --- UTILITY FUNCTIONS ---

    function parseNumber(str) {
        return parseInt(str.replace(/,/g, ''), 10);
    }

    // --- UI CREATION ---

    function createSettingsUI() {
        if (document.getElementById('hp-threshold-settings')) return;

        const container = document.createElement('div');
        container.id = 'hp-threshold-settings';
        container.style.position = 'fixed';
        container.style.top = '70%';
        container.style.left = '10px';
        container.style.zIndex = '99999';
        container.style.backgroundColor = '#333';
        container.style.color = '#fff';
        container.style.padding = '5px 10px';
        container.style.borderRadius = '5px';
        container.style.fontSize = '12px';
        container.style.border = '1px solid #999';

        const label = document.createElement('span');
        label.innerText = 'Execute %: ';
        container.appendChild(label);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = GM_getValue(STORAGE_KEY, 25);
        input.style.width = '50px';
        input.style.marginLeft = '5px';
        input.addEventListener('change', (e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val)) val = 0;
            if (val > 100) val = 100;
            GM_setValue(STORAGE_KEY, val);
            checkHealth();
        });
        container.appendChild(input);
        document.body.appendChild(container);
    }

    // --- MAIN LOGIC ---

    function checkHealth() {
        // 1. Find the Health Element (Robust Fuzzy Search)
        const playerWraps = document.querySelectorAll("[class*='playersModelWrap']");
        let enemyHealthSpan = null;

        for (let wrap of playerWraps) {
            // Looking for the enemy header (usually class 'rose' or distinct from 'blue' which is self)
            const roseHeader = wrap.querySelector("[class*='headerWrapper'][class*='rose']");
            if (roseHeader) {
                const spans = roseHeader.querySelectorAll("span");
                for (let span of spans) {
                    if (span.innerText.includes('/')) {
                        enemyHealthSpan = span;
                        break;
                    }
                }
            }
        }

        if (!enemyHealthSpan) return;

        // 2. Parse Health
        const txt = enemyHealthSpan.innerText;
        const parts = txt.split('/');
        if (parts.length !== 2) return;

        const currentHp = parseNumber(parts[0]);
        const maxHp = parseNumber(parts[1]);

        if (isNaN(currentHp) || isNaN(maxHp) || maxHp === 0) return;

        // 3. Calculate Threshold
        const thresholdPercent = GM_getValue(STORAGE_KEY, 25);
        const thresholdHp = (maxHp * thresholdPercent) / 100;

        // 4. Highlight Logic
        const weaponEl = document.getElementById(TARGET_WEAPON_ID);
        if (weaponEl) {
            if (currentHp < thresholdHp) {
                // APPLY STRONG HIGHLIGHT
                // Using rgba for background allows the weapon icon to be seen through the red
                weaponEl.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
                weaponEl.style.border = '5px solid red';
                weaponEl.style.boxShadow = '0 0 15px red, inset 0 0 20px red';
                weaponEl.style.transition = 'all 0.2s ease';
                weaponEl.dataset.highlighted = "true";
            } else {
                // REMOVE HIGHLIGHT
                if (weaponEl.dataset.highlighted === "true") {
                    weaponEl.style.backgroundColor = '';
                    weaponEl.style.border = '';
                    weaponEl.style.boxShadow = '';
                    weaponEl.style.transition = '';
                    delete weaponEl.dataset.highlighted;
                }
            }
        }
    }

    // --- INITIALIZATION ---

    function init() {
        createSettingsUI();
        checkHealth();

        // Monitor DOM for React changes
        const observer = new MutationObserver((mutations) => {
            checkHealth();
        });

        const config = { childList: true, subtree: true, characterData: true };
        observer.observe(document.body, config);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();