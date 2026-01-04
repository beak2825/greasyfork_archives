// ==UserScript==
// @name         Torn Travel Shop – Profit Display
// @namespace    muppet.travelshopfix
// @version      0.7.1
// @description  Show estimated profit for travel shop items (no stock upload)
// @author       Muppet [3926388]
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        GM_xmlhttpRequest
// @connect      protective-donnamarie-hobbyprojectme-22661a0f.koyeb.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558728/Torn%20Travel%20Shop%20%E2%80%93%20Profit%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/558728/Torn%20Travel%20Shop%20%E2%80%93%20Profit%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;

    const MARKET_PRICE_API =
        "https://protective-donnamarie-hobbyprojectme-22661a0f.koyeb.app/api/items/market-prices";

    let alreadyProcessed = false;

    // Torn is SPA-based; wait until shop rows exist
    const observer = new MutationObserver(() => {
        if (alreadyProcessed) return;

        const rows = document.querySelectorAll(".row___wHVtu");
        if (rows.length > 0) {
            alreadyProcessed = true;
            observer.disconnect();
            if (DEBUG) console.log("[TravelFix] Shop detected");
            run(Array.from(rows));
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    async function run(rows) {
        const items = parseItems(rows);
        if (!items.length) return;

        const prices = await fetchMarketPrices(items.map(i => i.id));
        injectProfitInlineText(items, prices);
    }

    // Read item id, quantity and cost
    function parseItems(rows) {
        const items = [];

        rows.forEach(row => {
            const img = row.querySelector("img.torn-item");
            const stockSpan = row.querySelector(".inlineStock___nVixU");
            const costCell = row.querySelector(".right___a6o9i");

            if (!img || !stockSpan || !costCell) return;

            const idMatch = img.src.match(/\/items\/(\d+)\//);
            if (!idMatch) return;

            const id = Number(idMatch[1]);
            const quantity = Number(stockSpan.textContent.replace(/\D/g, ""));
            const cost = Number(costCell.textContent.replace(/\D/g, ""));

            if (!id || !quantity || !cost) return;

            items.push({ id, quantity, cost, costCell });
        });

        return items;
    }

    // Fetch market prices
    function fetchMarketPrices(ids) {
        return new Promise(resolve => {
            const url = `${MARKET_PRICE_API}?itemIds=${ids.join(",")}`;

            if (DEBUG) console.log("[TravelFix] Fetching prices:", url);

            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: res => {
                    try {
                        const json = JSON.parse(res.responseText);
                        resolve(json.prices || {});
                    } catch {
                        resolve({});
                    }
                },
                onerror: () => resolve({})
            });
        });
    }

    // Profit on the left, cost on the right
    function injectProfitInlineText(items, prices) {
        items.forEach(item => {
            const market = prices[item.id];
            if (!market) return;

            const costCell = item.costCell;
            if (!costCell || costCell.querySelector(".travelfix-profit")) return;

            const profit = market - item.cost;

            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.justifyContent = "space-between";
            wrapper.style.alignItems = "center";
            wrapper.style.width = "100%";

            // Profit (left)
            const profitEl = document.createElement("div");
            profitEl.className = "travelfix-profit";
            profitEl.textContent =
                (profit >= 0 ? "+" : "-") + "$" + Math.abs(profit).toLocaleString();
            profitEl.style.fontSize = "11px";
            profitEl.style.fontWeight = "500";
            profitEl.style.opacity = "0.85";
            profitEl.style.color = profit >= 0 ? "#6fbf73" : "#d36b6b";
            profitEl.style.whiteSpace = "nowrap";
            profitEl.style.textAlign = "left";

            // Cost (right)
            const costEl = document.createElement("div");
            costEl.textContent = "$" + item.cost.toLocaleString();
            costEl.style.whiteSpace = "nowrap";
            costEl.style.textAlign = "right";

            costCell.textContent = "";
            wrapper.appendChild(profitEl);
            wrapper.appendChild(costEl);
            costCell.appendChild(wrapper);
        });
    }

})();
