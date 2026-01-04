// ==UserScript==
// @name         MarketToShops
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Show NPC shop price compared to market value
// @author       Gravity(2131364)
// @match        https://www.torn.com/bigalgunshop.php*
// @match        https://www.torn.com/shops.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548541/MarketToShops.user.js
// @updateURL https://update.greasyfork.org/scripts/548541/MarketToShops.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatNumber(n) {
        return "$" + n.toLocaleString();
    }

    function addPlaceholder(desc) {
        let compareLine = desc.querySelector(".shop-market-compare");
        if (!compareLine) {
            compareLine = document.createElement("span");
            compareLine.className = "shop-market-compare t-gray-6";
            compareLine.style.display = "block";
            compareLine.textContent = "MvS(loading...)";
            desc.appendChild(compareLine);
        }
        return compareLine;
    }

    async function fetchValue(itemId, compareLine) {
        try {
            let resp = await fetch("https://www.torn.com/page.php?sid=inventory", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `itemID=${itemId}`
            });

            let data = await resp.json();

            let rawValue = data.itemValue || "";
            let rawSell = data.itemSell || "";

            let marketValue = parseInt(rawValue.replace(/[$,]/g, ""));
            let sellValue = parseInt(rawSell.replace(/[$,]/g, ""));

            if (isNaN(marketValue) || isNaN(sellValue)) {
                compareLine.textContent = "MvS: (unavailable)";
                return;
            }

            // Profit = sellValue - marketValue
            let diff = sellValue - marketValue;

            compareLine.style.color = diff >= 0 ? "green" : "red";
            compareLine.textContent =
                `MarketDiff: ${formatNumber(diff)}`;

            console.log(`Item ${itemId}: Market=${marketValue}, Sell=${sellValue}, Diff=${diff}`);
        } catch (err) {
            console.error(`Error fetching value for ${itemId}:`, err);
            compareLine.textContent = "Market vs Sell: (error)";
        }
    }

    function init() {
        console.log("Running Torn Shop Sell vs Market script with staggered fetch...");

        const items = document.querySelectorAll(".items-list li");
        let delay = 0;

        items.forEach(li => {
            const desc = li.querySelector(".desc");
            const nameSpan = li.querySelector(".name");

            if (!desc || !nameSpan) return;

            const itemId = nameSpan.id.split("-")[0];
            if (!itemId) return;

            console.log(`Scheduled fetch for ${nameSpan.textContent.trim()} (ID ${itemId}) after ${delay}ms`);

            const compareLine = addPlaceholder(desc);

            // Stagger requests
            setTimeout(() => {
                fetchValue(itemId, compareLine);
            }, delay);

            delay += 250; // 250ms between each request
        });
    }

    init();
})();