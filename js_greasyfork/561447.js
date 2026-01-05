// ==UserScript==
// @name         Steam Inventory Bulk Sell Button
// @namespace    https://github.com/brodante
// @version      1.4.1
// @description  Adds a Bulk Sell button.
// @author       brodante
// @homepageURL  https://github.com/brodante
// @supportURL   https://github.com/brodante/scripts/issues
// @match        https://steamcommunity.com/id/*/inventory*
// @match        https://steamcommunity.com/profiles/*/inventory*
// @grant        none
// @license      MIT
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/561447/Steam%20Inventory%20Bulk%20Sell%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561447/Steam%20Inventory%20Bulk%20Sell%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        let activePanel = document.getElementById('iteminfo1');
        if (!activePanel || activePanel.style.display === 'none') {
            activePanel = document.getElementById('iteminfo0');
        }
        if (!activePanel) return;

        const sellButton = Array.from(activePanel.querySelectorAll('button')).find(btn =>
            btn.textContent.trim().toLowerCase() === 'sell'
        );
        if (!sellButton) return;

        if (activePanel.querySelector('#bulk_sell_button')) return;

        const marketLink = Array.from(activePanel.querySelectorAll('a')).find(a =>
            a.textContent.includes('Community Market') && a.href.startsWith('https://steamcommunity.com/market/listings/')
        );
        if (!marketLink) return;

        const href = marketLink.href;
        const match = href.match(/\/market\/listings\/(\d+)\/(.+)$/);
        if (!match) return;

        const appid = match[1];
        const encodedName = match[2];
        const multisellUrl = `https://steamcommunity.com/market/multisell?appid=${appid}&contextid=2&items[]=${encodedName}`;

        // Clone the entire Sell button container to get perfect identical styling and alignment
        const sellContainer = sellButton.closest('div');
        if (!sellContainer) return;

        const bulkContainer = sellContainer.cloneNode(true);

        // Find the button inside the cloned container and modify it
        const bulkButton = bulkContainer.querySelector('button');
        bulkButton.id = 'bulk_sell_button';
        bulkButton.textContent = 'Bulk Sell';
        bulkButton.onclick = () => window.open(multisellUrl, '_blank');

        // Insert right after the original Sell container for perfect side-by-side alignment
        sellContainer.parentNode.insertBefore(bulkContainer, sellContainer.nextSibling);

        // Optional: add a tiny left margin if Steam doesn't already space them naturally
        // bulkContainer.style.marginLeft = '8px';
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();