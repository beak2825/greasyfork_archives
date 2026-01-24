// ==UserScript==
// @name         Torn Item Market - Align Buy Controls (v8.0 SIMPLE)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Simple overlay positioning - buy controls under item cards
// @author       You
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/page.php*sid=ItemMarket*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563817/Torn%20Item%20Market%20-%20Align%20Buy%20Controls%20%28v80%20SIMPLE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563817/Torn%20Item%20Market%20-%20Align%20Buy%20Controls%20%28v80%20SIMPLE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Market Aligner] Script loaded v8.0 - SIMPLE OVERLAY');

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

                    // Get positions
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

                        // Calculate ideal position (centered under tile)
                        let targetLeft = tileCenter - (buyControlsWidth / 2);

                        // Clamp to keep it visible - leave 20px margin on each side
                        const minLeft = 20;
                        const maxLeft = containerWidth - buyControlsWidth - 20;
                        targetLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));

                        console.log(`[Market Aligner] Positioning at ${targetLeft}px (tile center: ${tileCenter}px)`);

                        // Position absolutely within the row
                        buyControls.style.position = 'absolute';
                        buyControls.style.left = `${targetLeft}px`;
                        buyControls.style.zIndex = '100';
                        buyControls.style.backgroundColor = '#1a1a1a'; // Dark background so it's readable when overlaying
                        buyControls.style.padding = '2px 8px';
                        buyControls.style.borderRadius = '4px';

                        alignedControls.add(buyControls);
                        alignedThisRun++;
                    });
                } catch (e) {
                    console.error('[Market Aligner] Error:', e);
                }
            });

            if (alignedThisRun > 0) {
                console.log(`[Market Aligner] Positioned ${alignedThisRun} controls`);
            }

        } catch (e) {
            console.error('[Market Aligner] Error:', e);
        }
    }

    function startPolling() {
        if (pollingInterval) return;

        let pollCount = 0;
        pollingInterval = setInterval(() => {
            alignBuyControls();
            pollCount++;
            if (pollCount >= 10) stopPolling();
        }, 500);

        pollingTimeout = setTimeout(stopPolling, 6000);
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
        if (pollingTimeout) {
            clearTimeout(pollingTimeout);
            pollingTimeout = null;
        }
    }

    function handleUserInteraction(e) {
        const target = e.target.closest('[class*="itemTile"]') ||
                      e.target.closest('[class*="actionButton"]') ||
                      e.target.closest('button');

        if (target) {
            setTimeout(alignBuyControls, 150);
            setTimeout(alignBuyControls, 400);
            setTimeout(alignBuyControls, 800);
            startPolling();
        }
    }

    function init() {
        console.log('[Market Aligner] Starting SIMPLE mode...');

        document.addEventListener('click', handleUserInteraction, true);
        document.addEventListener('mousedown', handleUserInteraction, true);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleUserInteraction(e);
            }
        }, true);

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.classList &&
                            node.classList.toString().includes('sellerListWrapper')) {
                            setTimeout(alignBuyControls, 200);
                            setTimeout(alignBuyControls, 500);
                            startPolling();
                            return;
                        }
                    }
                }
            }
        });

        const mainContent = document.querySelector('[class*="itemListWrapper"]') || document.body;
        observer.observe(mainContent, {
            childList: true,
            subtree: true
        });

        window.addEventListener('scroll', alignBuyControls, { passive: true });
        window.addEventListener('resize', alignBuyControls);

        setTimeout(alignBuyControls, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();