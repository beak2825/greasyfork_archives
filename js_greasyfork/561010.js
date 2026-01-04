// ==UserScript==
// @name         Torn - NPC alert tags by srsbsns
// @namespace    http://torn.com/
// @version      2.1
// @description  NPC price and profit on market items.
// @author       srsbsns
// @match        *://www.torn.com/bazaar.php*
// @match        *://www.torn.com/imarket.php*
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561010/Torn%20-%20NPC%20alert%20tags%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/561010/Torn%20-%20NPC%20alert%20tags%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const S_KEY = 'torn_arbiter_api_key';
    const S_CAT = 'torn_arbiter_catalog';

    GM_addStyle(`
        @keyframes neonPulse {
            0% { box-shadow: 0 0 5px #66FF00; border-color: #66FF00; background: #004400; }
            50% { box-shadow: 0 0 20px #66FF00; border-color: #fff; background: #006600; }
            100% { box-shadow: 0 0 5px #66FF00; border-color: #66FF00; background: #004400; }
        }

        .npc-tag {
            background: rgba(0, 0, 0, 0.85) !important;
            color: #76c776 !important;
            font-size: 10px !important;
            padding: 1px 4px !important;
            border-radius: 2px !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            z-index: 9999 !important;
            border: 1px solid rgba(118, 199, 118, 0.5) !important;
            pointer-events: none !important;
        }

        .profit-deal .npc-tag {
            color: #fff !important;
            animation: neonPulse 1.2s infinite ease-in-out !important;
            font-weight: bold !important;
            border: 1px solid #fff !important;
        }
    `);

    let isRunning = false;

    function runNpcLogic() {
        const url = window.location.href;

        if (url.includes('bazaar.php#/add') || url.includes('bazaar.php#/manage')) {
            document.querySelectorAll('.npc-tag').forEach(tag => tag.remove());
            return;
        }

        if (isRunning) return;
        isRunning = true;

        const catalog = JSON.parse(GM_getValue(S_CAT, '{}'));
        if (Object.keys(catalog).length === 0) {
            isRunning = false;
            return;
        }

        const isBazaar = url.includes('bazaar.php');
        const items = document.querySelectorAll('li, [class*="bazaar-card"], [class*="item_"], [class*="item___"], .market-main-wrap .row');

        items.forEach(item => {
            if (item.closest('#search-container, .search-results, .search-dropdown, #header-root')) return;

            const text = item.innerText;
            if (!text) return;

            // Split into lines to identify the item name and the correct price line
            const lines = text.split('\n').map(l => l.trim().toLowerCase());

            let foundMatch = false;
            for (let i = 0; i < Math.min(lines.length, 5); i++) {
                let name = lines[i].replace(/ x\d+$/, '').replace(/^stock /, '');

                if (catalog[name]) {
                    const floor = catalog[name];
                    foundMatch = true;

                    // Locate the price. In Bazaars, the unit price usually appears right after the item name.
                    // We filter out any line that contains "total" to prevent buy-overlay cycling.
                    let unitPrice = null;
                    for (let j = 0; j < lines.length; j++) {
                        if (lines[j].includes('$') && !lines[j].includes('total') && !lines[j].includes('npc')) {
                            const match = lines[j].replace(/,/g, '').match(/\$([\d]+)/);
                            if (match) {
                                unitPrice = parseInt(match[1]);
                                break;
                            }
                        }
                    }

                    if (unitPrice !== null) {
                        const isProfit = (unitPrice > 1 && unitPrice < floor);
                        const profitAmount = floor - unitPrice;

                        if (!isBazaar || isProfit) {
                            let tag = item.querySelector('.npc-tag');
                            if (!tag) {
                                tag = document.createElement('div');
                                tag.className = 'npc-tag';
                                item.style.position = 'relative';
                                item.appendChild(tag);
                            }

                            if (isProfit) {
                                tag.innerText = `NPC Profit: $${profitAmount.toLocaleString()}`;
                                item.classList.add('profit-deal');
                            } else {
                                tag.innerText = `NPC: $${floor.toLocaleString()}`;
                                item.classList.remove('profit-deal');
                            }
                        } else {
                            const existingTag = item.querySelector('.npc-tag');
                            if (existingTag) existingTag.remove();
                            item.classList.remove('profit-deal');
                        }
                    }
                    break;
                }
            }
            if (!foundMatch) {
                const existingTag = item.querySelector('.npc-tag');
                if (existingTag) existingTag.remove();
            }
        });

        setTimeout(() => { isRunning = false; }, 400);
    }

    async function fetchCatalog() {
        const key = GM_getValue(S_KEY, '');
        if (!key) return;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/torn/?selections=items&key=${key}`,
            onload: (res) => {
                const data = JSON.parse(res.responseText);
                if (data.items) {
                    const catalog = {};
                    for (const id in data.items) {
                        catalog[data.items[id].name.toLowerCase()] = data.items[id].sell_price;
                    }
                    GM_setValue(S_CAT, JSON.stringify(catalog));
                    runNpcLogic();
                }
            }
        });
    }

    if (!GM_getValue(S_KEY)) {
        const key = prompt('Enter API Key for NPC Tags:');
        if (key) { GM_setValue(S_KEY, key.trim()); fetchCatalog(); }
    }

    const observer = new MutationObserver(runNpcLogic);
    observer.observe(document.body, { childList: true, subtree: true });

    fetchCatalog();
    runNpcLogic();
})();