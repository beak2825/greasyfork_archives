// ==UserScript==
// @name         Dead Frontier Auto Scrap
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Free your hand from clicking scrap button
// @author       Catss
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
// @grant        none
// @license      LGPL License
// @downloadURL https://update.greasyfork.org/scripts/564375/Dead%20Frontier%20Auto%20Scrap.user.js
// @updateURL https://update.greasyfork.org/scripts/564375/Dead%20Frontier%20Auto%20Scrap.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Configuration
    const config = {
        autoClickEnabled: false,
        clickDelay: 200, // Faster - 200ms between clicks
        buttonSelector: 'button.opElem'
    };

    let clickCount = 0;
    let isProcessing = false;
    let toggleBtn = null;

    // Create toggle button with better positioning
    function createToggleButton() {
        // Remove old button if it exists
        const oldBtn = document.getElementById('autoScrapToggle');
        if (oldBtn) oldBtn.remove();

        toggleBtn = document.createElement('div');
        toggleBtn.id = 'autoScrapToggle';
        toggleBtn.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Auto Scrap</div>
            <div id="autoScrapStatus" style="font-size: 12px;">OFF</div>
            <div id="autoScrapCount" style="font-size: 11px; margin-top: 3px;">Clicks: 0</div>
        `;
        toggleBtn.style.cssText = `
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            z-index: 999999 !important;
            padding: 12px 16px;
            background-color: rgba(244, 67, 54, 0.95);
            color: white;
            border: 2px solid white;
            border-radius: 8px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            user-select: none;
            pointer-events: auto;
        `;

        toggleBtn.addEventListener('click', toggleAutoScrap);

        // Ensure button stays on top
        document.body.appendChild(toggleBtn);

        // Re-append periodically to keep it visible
        setInterval(() => {
            if (!document.getElementById('autoScrapToggle')) {
                document.body.appendChild(toggleBtn);
            }
        }, 2000);

        return toggleBtn;
    }

    function toggleAutoScrap() {
        config.autoClickEnabled = !config.autoClickEnabled;
        if (!config.autoClickEnabled) {
            clickCount = 0; // Reset counter when turning off
        }
        updateButtonDisplay();
    }

    function updateButtonDisplay() {
        const statusEl = document.getElementById('autoScrapStatus');
        const countEl = document.getElementById('autoScrapCount');

        if (statusEl) {
            statusEl.textContent = config.autoClickEnabled ? 'ON' : 'OFF';
        }
        if (countEl) {
            countEl.textContent = `Clicks: ${clickCount}`;
        }
        if (toggleBtn) {
            toggleBtn.style.backgroundColor = config.autoClickEnabled ?
                'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)';
        }
    }

    // Find and click scrap buttons one at a time
    function clickScrapButtons() {
        if (!config.autoClickEnabled || isProcessing) return;

        const scrapButtons = Array.from(document.querySelectorAll(config.buttonSelector))
            .filter(btn => btn.textContent.includes('Scrap') && btn.offsetParent !== null);

        if (scrapButtons.length > 0) {
            isProcessing = true;
            const button = scrapButtons[0];

            console.log('Clicking scrap button:', button.textContent);
            button.click();
            clickCount++;
            updateButtonDisplay();

            setTimeout(() => {
                isProcessing = false;
            }, config.clickDelay);
        }
    }

    // Observer to watch for new scrap menus
    function observeScrapMenu() {
        const observer = new MutationObserver((mutations) => {
            if (!config.autoClickEnabled || isProcessing) return;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            const scrapButtons = node.querySelectorAll ?
                                node.querySelectorAll('button.opElem') : [];

                            if (scrapButtons.length > 0) {
                                setTimeout(clickScrapButtons, 100);
                                return;
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Prevent accidental page refresh
    function preventAccidentalRefresh() {
        const storageKey = 'df_autoscrap_enabled';

        window.addEventListener('beforeunload', () => {
            localStorage.setItem(storageKey, config.autoClickEnabled);
        });

        const savedState = localStorage.getItem(storageKey);
        if (savedState === 'true') {
            config.autoClickEnabled = true;
            setTimeout(updateButtonDisplay, 500);
        }
    }

    // Initialize
    function init() {
        console.log('Dead Frontier Auto Scrap v1.3 loaded - Fast & Unlimited');

        // Wait a bit for page to fully load
        setTimeout(() => {
            createToggleButton();
            observeScrapMenu();
            preventAccidentalRefresh();
            updateButtonDisplay();
        }, 1000);

        // Check more frequently for faster response
        setInterval(() => {
            if (config.autoClickEnabled && !isProcessing) {
                clickScrapButtons();
            }
        }, 300); // Faster polling
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();