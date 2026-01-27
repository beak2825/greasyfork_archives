// ==UserScript==
// @name         Torn Item Market - v9.1 WIDE YES
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  v8.0 logic + massive Yes button for easier clicking.
// @author       You
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/page.php*sid=ItemMarket*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563854/Torn%20Item%20Market%20-%20v91%20WIDE%20YES.user.js
// @updateURL https://update.greasyfork.org/scripts/563854/Torn%20Item%20Market%20-%20v91%20WIDE%20YES.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Market Aligner] Script loaded v9.1 - WIDE YES MODE');

    const alignedControls = new WeakSet();
    let pollingInterval = null;
    let pollingTimeout = null;

    function alignBuyControls() {
        try {
            const expandedItems = document.querySelectorAll('[class*="itemTile"][class*="expanded"]');

            if (!expandedItems || expandedItems.length === 0) {
                stopPolling();
                return;
            }

            let alignedThisRun = 0;

            expandedItems.forEach((itemTile) => {
                try {
                    const itemLi = itemTile.closest('li');
                    if (!itemLi) return;

                    const sellerListLi = itemLi.nextElementSibling;
                    if (!sellerListLi || !sellerListLi.classList.toString().includes('sellerListWrapper')) {
                        return;
                    }

                    const allRows = sellerListLi.querySelectorAll('[class*="sellerRow"]');
                    const sellerRows = Array.from(allRows).filter(row =>
                        !row.querySelector('[class*="userInfoHead"]')
                    );

                    if (sellerRows.length === 0) return;

                    const itemListContainer = document.querySelector('[class*="itemListWrapper"]');
                    if (!itemListContainer) return;

                    const containerRect = itemListContainer.getBoundingClientRect();
                    const tileRect = itemTile.getBoundingClientRect();

                    const tileLeftInContainer = tileRect.left - containerRect.left;
                    const tileCenter = tileLeftInContainer + (tileRect.width / 2);
                    const containerWidth = containerRect.width;

                    const buyControlsWidth = 200;

                    sellerRows.forEach((row) => {
                        const buyControls = row.querySelector('[class*="buyControlsInRow"]');
                        if (!buyControls) return;
                        if (alignedControls.has(buyControls)) return;

                        let targetLeft = tileCenter - (buyControlsWidth / 2);
                        const minLeft = 20;
                        const maxLeft = containerWidth - buyControlsWidth - 20;
                        targetLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));

                        buyControls.style.position = 'absolute';
                        buyControls.style.left = `${targetLeft}px`;
                        buyControls.style.zIndex = '100';
                        buyControls.style.backgroundColor = '#1a1a1a';
                        buyControls.style.padding = '2px 8px';
                        buyControls.style.borderRadius = '4px';

                        alignedControls.add(buyControls);
                        alignedThisRun++;
                    });
                } catch (e) {
                    console.error('[Market Aligner] Error:', e);
                }
            });

        } catch (e) {
            console.error('[Market Aligner] Error:', e);
        }
    }

    function startPolling() {
        if (pollingInterval) return;
        pollingInterval = setInterval(() => {
            alignBuyControls();
        }, 500);
        pollingTimeout = setTimeout(stopPolling, 6000);
    }

    function stopPolling() {
        if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }
        if (pollingTimeout) { clearTimeout(pollingTimeout); pollingTimeout = null; }
    }

    function handleUserInteraction(e) {
        setTimeout(alignBuyControls, 150);
        startPolling();
    }

    function init() {
        // --- NEW WIDE YES BUTTON STYLING ---
        const style = document.createElement('style');
        style.textContent = `
            div[class*="confirmMessage"] {
                background: #1a1a1a !important;
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 5px 20px !important; /* Thinner overall bar */
                gap: 20px !important;
            }

            button[class*="confirmButton"]:first-child {
                width: 720px !important;
                height: 30px !important;      /* FORCE HEIGHT HERE */
                padding-top: 0 !important;    /* Removes top space */
                padding-bottom: 0 !important; /* Removes bottom space */
                line-height: 24px !important;  /* Nudges text UP - adjust this number */
                vertical-align: top !important;
                background-color: #375a1f !important;
                color: white !important;
                font-weight: bold !important;
                border-radius: 4px !important;
                font-size: 16px !important;
            }

            button[class*="confirmButton"]:last-child {
                width: 80px !important;
                height: 30px !important;      /* FORCE HEIGHT HERE */
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                line-height: 24px !important;  /* Match the Yes button */
                background-color: #444 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('click', handleUserInteraction, true);
        const observer = new MutationObserver(() => { alignBuyControls(); startPolling(); });
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', alignEverything);
    }

    init();
})();