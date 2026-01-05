// ==UserScript==
// @name         Torn Market - Auto-Scraper
// @namespace    http://tampermonkey.net/
// @version      1.7
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @description  displays the item market in  a box
// @license      licence is private and (c) 
// @downloadURL https://update.greasyfork.org/scripts/561439/Torn%20Market%20-%20Auto-Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/561439/Torn%20Market%20-%20Auto-Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const globalInventory = new Map();
    // 1. Create the UI Summary Box
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'scraped-summary-box'; // Unique ID for filtering
    summaryDiv.style = `
        position: fixed; top: 80px; right: 20px; z-index: 999999;
        background: #222; color: #fff; padding: 15px; border-radius: 5px;
        border: 2px solid #444; font-family: sans-serif; min-width: 250px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        /* SCROLLBAR LOGIC */
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;          /* Firefox: Makes scrollbar narrow */
        scrollbar-color: #555 #222;    /* Firefox: Thumb and Track color */
    `;
    summaryDiv.innerHTML = '<h3 style="margin-top:0">Market Summary</h3><div id="summary-content">Loading...</div>';
    document.body.appendChild(summaryDiv);

    function performScrape() {
        // Use the wildcard selectors we proved work
        const rows = document.querySelectorAll('li[class*="rowWrapper___"]');
        if (rows.length === 0) return;
        let newItemsFound = false;

        let html = '<table style="width:100%; font-size:12px;">';
        rows.forEach(row => {
            const nameEl= row.querySelector('[class^="honorName___"]') || row.querySelector('[class^="anonymous___"]');
            const priceEl = row.querySelector('[class^="price___"]');
            const qtyEl = row.querySelector('[class^="available___"]');
            const imgEl = row.querySelector('[class^="thumbnail___"] img');
            const playerLinkEl = row.querySelector('a[class^="linkWrap___"]');

            if (nameEl && priceEl && qtyEl && imgEl && playerLinkEl ) {
                const name = nameEl.innerText.trim();
                const price = priceEl.innerText.trim();
                const qty = qtyEl.innerText.replace(' available', '').trim();
                const src = imgEl.getAttribute('src');
                const match = src.match(/\/items\/(\d+)\//);
                const itemId = match ? match[1] : "??";

                const playerHref = playerLinkEl.getAttribute('href');
                const playerMatch = playerHref.match(/ID=(\d+)/);
                const playerId = playerMatch ? playerMatch[1] : "??";

                // Create a unique key for this specific listing
                const itemKey = `${itemId}-${name}-${price}`;
                // Only add if it's not already in our globalInventory
                if (!globalInventory.has(itemKey)) {
                    globalInventory.set(itemKey, { itemId, playerId, name, price, qty });
                    newItemsFound = true;
                }
                /*
                const qtyText = qtyEl.innerText.replace(' available', '').trim();
                html += `<tr style="border-bottom: 1px solid #333;">
                <td style="color:#00aaff; padding: 4px 0;">${nameEl.innerText}</td>
                <td style="color:#00aaff;text-align:right; padding: 4px 5px;">${priceEl.innerText}</td>
                <td style="color:#00aaff;text-align:right; padding: 4px 0;">${qtyText}</td>
            </tr>`;
            */
            }
        });
        if (newItemsFound) {
            updateUI();
        }
        /*
        html += '</table>';
        document.getElementById('summary-content').innerHTML = html;
        */
    }

    function updateUI() {
        const content = document.getElementById('summary-content');
        let html = '<table style="width:100%; font-size:11px; border-collapse: collapse;">';
        html += '<tr style="border-bottom: 1px solid #555;"><th>Seller</th><th>Price</th><th>Qty</th></tr>';

        // Convert Map values back to an array to display them
        globalInventory.forEach((item) => {
            html += `<tr style="border-bottom: 1px solid #333;">
                <td style="color:#00aaff; padding: 2px 0;">${item.itemId} ${item.name} ${item.playerId}</td>
                <td style="color:#00aaff; text-align:right;">${item.price}</td>
                <td style="color:#00aaff; text-align:right;">${item.qty}</td>
            </tr>`;
        });

        html += '</table>';
        html += `<div style="margin-top:8px; font-size:10px; color:#aaa;">Unique Listings Captured: ${globalInventory.size}</div>`;
        content.innerHTML = html;
    }

    // 2. The Safe Observer
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            // IGNORE if the change happened inside our own summary box
            if (mutation.target.id === 'scraped-summary-box' ||
                mutation.target.closest('#scraped-summary-box')) {
                continue;
            }

            // Only scrape if we see a rowWrapper appearing
            if (document.querySelector('li[class*="rowWrapper___"]')) {
                performScrape();
                break; // One scrape per mutation batch is enough
            }
        }
    });

    // Start watching the body, but our logic inside will filter out the noise
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    setTimeout(performScrape, 2000);
})();