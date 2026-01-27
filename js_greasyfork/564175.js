// ==UserScript==
// @name         Torn Item Market Hider by Ketum13
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows hiding items in the Item Market listings
// @author       Ketum13
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564175/Torn%20Item%20Market%20Hider%20by%20Ketum13.user.js
// @updateURL https://update.greasyfork.org/scripts/564175/Torn%20Item%20Market%20Hider%20by%20Ketum13.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const HIDDEN_KEY = 'hiddenItemTypes_ItemMarket_2026_v1';
    let hiddenTypes = GM_getValue(HIDDEN_KEY, {});

    function getItemIDFromElement(el) {
        const btn = el.closest('div')?.querySelector('button[aria-controls^="wai-itemInfo-"]');
        if (btn) {
            const controls = btn.getAttribute('aria-controls');
            const match = controls.match(/wai-itemInfo-(\d+)/);
            if (match) return match[1];
        }
        return null;
    }

    function getItemContainer(el) {
        let container = el;
        let levelsUp = 0;

        while (container && container !== document.body && levelsUp < 6) {
            levelsUp++;
            const btnsInContainer = container.querySelectorAll('button[aria-controls^="wai-itemInfo-"]');


            if (btnsInContainer.length === 1) {
                if (container.offsetHeight > 80 && container.offsetHeight < 500) {
                    return container;
                }
            }

            container = container.parentElement;
        }
        return null; 
    }

    function hideHiddenItems() {
        document.querySelectorAll('button[aria-controls^="wai-itemInfo-"]').forEach(btn => {
            const idMatch = btn.getAttribute('aria-controls').match(/wai-itemInfo-(\d+)/);
            if (idMatch) {
                const itemId = idMatch[1];
                if (hiddenTypes[itemId]) {
                    const container = getItemContainer(btn);
                    if (container) {
                        container.style.display = 'none';
                    }
                }
            }
        });
    }

    function addRightClickHandler() {
        document.addEventListener('contextmenu', function(e) {
            const target = e.target;
            const id = getItemIDFromElement(target);
            if (id) {
                e.preventDefault();
                e.stopPropagation();

                if (confirm(`Hide Item ID: ${id}\n\n `)) {
                    hiddenTypes[id] = true;
                    GM_setValue(HIDDEN_KEY, hiddenTypes);
                    hideHiddenItems();
                    alert(`✅ Hidden (ID: ${id})! Total hidden: ${Object.keys(hiddenTypes).length}`);
                }
            }
        }, true);
    }

    function createResetButton() {
        if (document.getElementById('imarket-hide-reset-v1')) return;

        const resetBtn = document.createElement('div');
        resetBtn.id = 'imarket-hide-reset-v1';
        resetBtn.style.cssText = `
            position: fixed; top: 90px; right: 20px; z-index: 99999;
            background: #2c3e50; color: white; padding: 10px 16px;
            border-radius: 10px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6); border: 2px solid #e74c3c;
        `;
        resetBtn.innerHTML = `Hidden: <span id="hide-count">${Object.keys(hiddenTypes).length}</span><br><small>Reset</small>`;

        resetBtn.onclick = () => {
            if (confirm('Confirm to reset hidden items.')) {
                GM_deleteValue(HIDDEN_KEY);
                hiddenTypes = {};
                location.reload();
            }
        };

        document.body.appendChild(resetBtn);
    }

    const observer = new MutationObserver(() => {
        hideHiddenItems();
        createResetButton();
    });

    function init() {
        addRightClickHandler();
        createResetButton();
        hideHiddenItems();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();