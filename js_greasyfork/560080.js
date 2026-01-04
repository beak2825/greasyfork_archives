// ==UserScript==
// @name         Torn Market Seller Banner + Sale Tracker
// @namespace    torn.market.banner.sales
// @version      1.4
// @description  Shows seller banner, tracks live sales, clears on item change
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560080/Torn%20Market%20Seller%20Banner%20%2B%20Sale%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/560080/Torn%20Market%20Seller%20Banner%20%2B%20Sale%20Tracker.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /******************************************************************
     * UI
     ******************************************************************/
    const panel = document.createElement("div");
    panel.id = "market-tracker-panel";
    panel.innerHTML = `
    <div id="market-header">
        <h3 id="ma-title">Market Activity</h3>
        <button id="market-minimize">–</button>
    </div>

    <div id="market-content">
        <div class="controls">
            <label>
                Min price:
                <input type="number" id="min-price" placeholder="0" min="0">
            </label>

            <button id="clear-log">Clear</button>
        </div>

        <div id="seller-banner"></div>
        <div id="sales-log"></div>
    </div>
`;

    document.body.appendChild(panel);

    GM_addStyle(`
    #market-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

#market-header h3 {
    margin: 0;
    text-align: left;
}

#market-minimize {
    background: none;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
}

/* MINIMIZED STATE */
#market-tracker-panel.minimized {
    width: auto;
    padding: 6px;
}

#market-tracker-panel.minimized #market-content {
    display: none;
}
        #market-tracker-panel {
            position: fixed;
            right: 20px;
            top: 120px;
            width: 360px;
            max-height: 75vh;
            overflow-y: auto;
            background: #1d1f23;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 10px;
            color: #fff;
            z-index: 99999;
            font-size: 13px;
        }
        #market-tracker-panel h3 {
            margin: 0 0 8px;
            text-align: center;
        }
        .seller-card {
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1px solid #333;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }
        .seller-card img {
            width: 42px;
            height: auto;
        }
        .sale-entry {
            border-bottom: 1px solid #333;
            padding: 6px 0;
        }
        .controls {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
}

.controls input {
    width: 90px;
    padding: 2px 4px;
    background: #121316;
    color: #fff;
    border: 1px solid #444;
    border-radius: 4px;
}

.controls button {
    padding: 3px 8px;
    background: #2a2d33;
    border: 1px solid #444;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}

.controls button:hover {
    background: #3a3f47;
}

    `);

    const bannerDiv = document.getElementById("seller-banner");
    const salesDiv = document.getElementById("sales-log");
    const minPriceInput = panel.querySelector("#min-price");
    const clearBtn = panel.querySelector("#clear-log");
    const title = panel.querySelector("#ma-title");

    minPriceInput.addEventListener("input", () => {
        minPriceFilter = parseInt(minPriceInput.value, 10) || 0;
    });

    clearBtn.addEventListener("click", () => {
        salesDiv.innerHTML = "";
    });

    const minimizeBtn = document.getElementById("market-minimize");
    let minimized = false;

    minimizeBtn.addEventListener("click", () => {
        minimized = !minimized;
        title.textContent = minimized ? "" : "Market Activity";
        panel.classList.toggle("minimized", minimized);
        minimizeBtn.textContent = minimized ? "+" : "–";
    });

    /******************************************************************
     * STATE
     ******************************************************************/
    let listings = []; // key -> qty
    let recentChanges = [];
    let lastReset = Date.now();
    let minPriceFilter = 0;


    /******************************************************************
     * HELPERS
     ******************************************************************/
    function getItemName(row) {
        return row.querySelector("img")?.alt?.trim() || "Unknown";
    }

    function getPrice(row) {
        return row.querySelector('[class*="price"]')?.textContent.trim() || "?";
    }

    function getQty(row) {
        const txt = row.querySelector('[class*="available"]')?.textContent || "";
        const m = txt.match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
    }

    function getSeller(row) {
        const link = row.querySelector('a[href*="profiles.php"]');
        if (!link) return null;

        const banner = link;
        const id = new URL(link.href).searchParams.get("XID");
        const img = link.querySelector("img")?.src;

        return { banner, id, img };
    }
    function findListing(item, price,seller) {
        return listings.find(l =>
                             l.item === item && l.price === price && l.seller.id == seller.id
                            );
    }


    function logSale(seller, text, price) {
        if (price < minPriceFilter) return;

        const div = document.createElement("div");
        div.className = "sale-entry";

        const bannerClone = seller.banner.cloneNode(true);
        div.appendChild(bannerClone);

        const info = document.createElement("div");
        info.innerHTML = `
        <div><b>${price.toLocaleString()}$</b></div>
        <div>[${new Date().toLocaleTimeString()}] ${text}</div>
    `;

      div.appendChild(info);
      salesDiv.prepend(div);
  }
    function hookItemButtons() {
        document.querySelectorAll('button[class*="actionButton"]').forEach(btn => {
            if (btn.__tornHooked) return;
            btn.__tornHooked = true;

            btn.addEventListener('click', () => {
                console.log("Item clicked → manual scan reset");

                // Clear state BEFORE React swaps DOM
                listings = [];
                recentChanges = [];
                salesDiv.innerHTML = "";
                bannerDiv.innerHTML = "";

                // Delay scan slightly to let DOM update
                setTimeout(() => {
                    observer.disconnect();
                    wait();
                }, 150);
            }, true); // CAPTURE PHASE
        });
    }

    function findSellerList() {
        const ul = [...document.querySelectorAll('ul[class*="sellerList"]')]
        .find(ul => ul.offsetParent !== null)
        if (!ul) return null;
        console.log(ul);
        return ul;
    }


    /******************************************************************
     * ITEM CHANGE DETECTION
     ******************************************************************/
    function detectItemChange() {

        const now = Date.now();
        recentChanges = recentChanges.filter(t => now - t < 1000);

        if (recentChanges.length >= 5 && now - lastReset > 1500) {
            listings.clear();
            salesDiv.innerHTML = "";
            bannerDiv.innerHTML = "";
            lastReset = now;
            logSale("Item changed — tracker reset");
        }
    }

    /******************************************************************
     * SCAN
     ******************************************************************/
    function scan() {
        const rows = document.querySelectorAll('li[class*="rowWrapper"]');
        const seen = new Set(); // keys seen this scan
        rows.forEach(row => {
            const item = getItemName(row);
            const price = getPrice(row);
            const qty = getQty(row);
            const seller = getSeller(row);

            if (!seller) return;

            const key = `${item}|${price}|${seller.id}`;
            seen.add(key);

            let entry = findListing(item, price,seller);

            // NEW LISTING
            if (!entry) {
                listings.push({
                    item,
                    price,
                    qty,
                    seller
                });
                return;
            }

            // REDUCED AMOUNT → SALE
            if (qty < entry.qty) {
                const sold = entry.qty - qty;
                entry.qty = qty;

                recentChanges.push(Date.now());

                logSale(
                    entry.seller,
                    `${sold} sold @ ${price} — ${item}`,
                    sold * parseInt(price.substring(1).replace(/,/g, ""), 10)
                );

                detectItemChange();
            }
        });
        let lastPrice = 0;
        if (listings.length > 5){
            lastPrice = listings[4].price
        }
        console.log(lastPrice);
        // FULL SELL-OUTS (missing from DOM)
        listings = listings.filter(entry => {
            const key = `${entry.item}|${entry.price}|${entry.seller.id}`;

            if (!seen.has(key) && (entry.price <= lastPrice )) {
                recentChanges.push(Date.now());

                logSale(
                    entry.seller,
                    `${entry.qty} sold out @ ${entry.price} — ${entry.item}`,
                    entry.qty * parseInt(entry.price.substring(1).replace(/,/g, ""), 10)
                );

                detectItemChange();
                return false; // remove entry
            }

            return true;
        });
        console.log(listings);
    }


    /******************************************************************
     * OBSERVER
     ******************************************************************/
    const observer = new MutationObserver(() => {
        console.log("scanning");
        scan();

    });
    const buttonObserver = new MutationObserver(hookItemButtons);

    buttonObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    hookItemButtons();

    function wait() {
        let ul = findSellerList();
        if (!ul) return setTimeout(wait, 500);
        observer.observe(ul, { childList: true, subtree: true });
        scan();
    }

    wait();
})();
