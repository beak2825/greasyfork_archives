// ==UserScript==
// @name         Wealthfront Show Daily $ Gain/Loss
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Display daily gain/loss in dollars on Wealthfront dashboard alongside the percentage gain/loss.
// @author       @trumpetbear
// @match        https://www.wealthfront.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562785/Wealthfront%20Show%20Daily%20%24%20GainLoss.user.js
// @updateURL https://update.greasyfork.org/scripts/562785/Wealthfront%20Show%20Daily%20%24%20GainLoss.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseMoney(str) {
        const match = str.match(/\$([0-9,.]+)/);
        return match ? parseFloat(match[1].replace(/,/g, '')) : null;
    }

    function injectDollarChange() {
        const container = document.querySelector('[data-testid="default-account-summary-total-value"]');
        const percentEl = container?.querySelector('[data-testid="daily-time-weighted-percentage"] span');
        const totalEl = container?.querySelector('h1');

        if (!container || !percentEl || !totalEl) return;

        // Use only the visible text node in the h1, excluding the screen reader "Total balance:" part
        const visibleTextNode = Array.from(totalEl.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        const totalText = visibleTextNode?.textContent.trim();

        const percentText = percentEl.textContent.trim();

        const total = parseMoney(totalText);
        const percent = parseFloat(percentText.replace('%', ''));

        if (isNaN(total) || isNaN(percent)) return;

        const dollarChange = total * (percent / 100);
        const sign = dollarChange >= 0 ? '+' : '-';
        const formatted = ` ($${Math.abs(dollarChange).toFixed(2)})`;

        if (!percentEl.textContent.includes('$')) {
            percentEl.textContent += formatted;
        }
    }

    const observer = new MutationObserver(() => {
        injectDollarChange();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();
