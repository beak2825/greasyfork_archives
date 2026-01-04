// ==UserScript==
// @name         Torn IM After-Tax Price Toggle
// @namespace    https://greasyfork.org/en/scripts/553584-torn-im-after-tax-price-toggle
// @version      2.0
// @description  Toggle between showing pre-tax and post-tax prices in Torn Item Market (5% tax)
// @author       Felsync [3921027]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/page.php*sid=ItemMarket*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553584/Torn%20IM%20After-Tax%20Price%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/553584/Torn%20IM%20After-Tax%20Price%20Toggle.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Configuration constants
    const TAX_RATE = 0.05;                    // Torn Item Market tax rate (5%)
    const BATCH_SIZE = 50;                    // Max elements to process per batch
    const BATCH_DELAY_MS = 10;                // Delay between batches (ms)
    const DEBOUNCE_DELAY_MS = 100;            // Debounce delay for DOM scanning (ms)
    const MOBILE_FIX_INTERVAL_MS = 2000;      // Interval for mobile price fix (ms)

    let showAfterTax = GM_getValue('showAfterTax', false);
    const prices = new WeakMap();
    let debounceTimer = null;

    // Add styles
    document.head.insertAdjacentHTML('beforeend',
        `<style>.tax-btn{background:#2c5aa0;color:#fff;border:1px solid #1a3a6b;padding:5px 12px;margin:0 0 10px;border-radius:3px;cursor:pointer;font-size:11px}.tax-btn.on{background:#28a745}</style>`);

    const updatePrice = elem => {
        const price = prices.get(elem);
        if (price) {
            elem.textContent = (showAfterTax ? '✓ $' : '$') + Math.floor(showAfterTax ? price * (1 - TAX_RATE) : price).toLocaleString();
        }
    };

    const processNewPrices = () => {
        // Only process prices within seller rows, not category headers
        const elements = document.querySelectorAll('div[class*="sellerRow"] div[class*="price"]:not([data-tax])');
        let count = 0;

        for (const elem of elements) {
            if (++count > BATCH_SIZE) {
                // Process rest after a break to prevent freezing
                setTimeout(processNewPrices, BATCH_DELAY_MS);
                break;
            }

            const price = parseInt(elem.textContent.replace(/\D/g, ''));
            if (price > 0) {
                prices.set(elem, price);
                elem.setAttribute('data-tax', '1');
                updatePrice(elem);
            }
        }
    };

    const setupButtons = () => {
        document.querySelectorAll('ul[class*="sellerList"]').forEach(list => {
            const container = list.parentElement;
            if (!container || container.querySelector('.tax-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'tax-btn' + (showAfterTax ? ' on' : '');
            btn.textContent = showAfterTax ? 'After-Tax ✓' : 'Pre-Tax';

            btn.onclick = () => {
                showAfterTax = !showAfterTax;
                GM_setValue('showAfterTax', showAfterTax);
                btn.textContent = showAfterTax ? 'After-Tax ✓' : 'Pre-Tax';
                btn.classList.toggle('on');

                // Update all tracked prices
                document.querySelectorAll('div[class*="sellerRow"] div[class*="price"][data-tax]').forEach(updatePrice);
            };

            container.insertBefore(btn, list);
        });
    };

    const scan = () => {
        setupButtons();
        processNewPrices();
    };

    const debouncedScan = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scan, DEBOUNCE_DELAY_MS);
    };

    // Watch for changes
    new MutationObserver(mutations => {
        const hasRelevantChange = mutations.some(m =>
            Array.from(m.addedNodes).some(n =>
                n.nodeType === 1 && (
                    n.querySelector?.('[class*="sellerList"]') ||
                    n.querySelector?.('[class*="sellerRow"]')
                )
            )
        );

        if (hasRelevantChange) debouncedScan();
    }).observe(document.body, { childList: true, subtree: true });

    // Initial setup
    scan();

    // Fix prices that get reset (mobile)
    setInterval(() => {
        if (showAfterTax) {
            document.querySelectorAll('div[class*="sellerRow"] div[class*="price"][data-tax]').forEach(elem => {
                if (!elem.textContent.includes('✓')) updatePrice(elem);
            });
        }
    }, MOBILE_FIX_INTERVAL_MS);
})();