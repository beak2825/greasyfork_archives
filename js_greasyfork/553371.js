// ==UserScript==
// @name         Torn - Show item market 95% price
// @namespace    https://torn.com/
// @version      1.1
// @description  Show item market 95% price
// @author       JohnNash
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553371/Torn%20-%20Show%20item%20market%2095%25%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/553371/Torn%20-%20Show%20item%20market%2095%25%20price.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add ::after CSS
    GM_addStyle(`
        .show-net-value::after {
            position: absolute;
            top: 20px;
            right: 0;
            color: var(--tt-color-green);
            cursor: pointer;
            width: 86px;
            text-align: right;
            font-size: 11px;
            content: attr(data-net-value);
        }
    `);

    // format price
    function formatMoney(value) {
        return '$' + value.toLocaleString('en-US');
    }

    // get price and update dom
    function updatePrices() {
        const prices = document.querySelectorAll('[class*="rowWrapper__"] [class*="price"]');
        prices.forEach(priceEl => {
            // Evitar processar mais do que uma vez
            if (priceEl.classList.contains('show-net-value')) return;

            const text = priceEl.textContent.trim();
            const match = text.match(/\$([\d,]+)/);
            if (!match) return;

            const rawValue = parseFloat(match[1].replace(/,/g, ''));
            if (isNaN(rawValue)) return;

            const netValue = Math.floor(rawValue * 0.95);
            const formatted = formatMoney(netValue);

            priceEl.classList.add('show-net-value');
            priceEl.setAttribute('data-net-value', formatted);
            priceEl.style.position = 'relative';
        });
    }

    // DOM mutations
    const observer = new MutationObserver(updatePrices);
    observer.observe(document.body, { childList: true, subtree: true });

    updatePrices();
})();
