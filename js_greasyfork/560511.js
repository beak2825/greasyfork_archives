// ==UserScript==
// @name         Torn Christmas Shop - Spam Buyer (Manual)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a button to buy items directly. 1 Click = 1 Buy. No automation, just speed.
// @author       Manuel [3747263]
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560511/Torn%20Christmas%20Shop%20-%20Spam%20Buyer%20%28Manual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560511/Torn%20Christmas%20Shop%20-%20Spam%20Buyer%20%28Manual%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Get Token from Cookies ---
    function getRfcv() {
        const match = document.cookie.match(/(?:^|;\s*)rfc_v=([^;]*)/);
        return match ? match[1] : null;
    }

    // --- 2. Buy Function (Direct API Call) ---
    async function buyItem(itemId, rfcv) {
        const url = `https://www.torn.com/christmas_town.php?q=miniGameAction&rfcv=${rfcv}`;
        const payload = {
            gameType: "gameGiftShop",
            action: "buyItem",
            result: {
                giftShopType: "basic",
                itemType: parseInt(itemId),
                itemCategory: "tornItems"
            }
        };

        try {
            // We use 'await' here but we don't block the UI, allowing for spamming
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            // We don't strictly need to parse the JSON for speed, but good for debugging
            return response.ok;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // --- 3. UI Injection ---
    function injectControls() {
        // Target the container using the class from your snippet
        const itemCards = document.querySelectorAll('.item___usHrY:not([data-script-loaded])');

        itemCards.forEach(card => {
            card.setAttribute('data-script-loaded', 'true');

            // Get Item ID from the image wrapper ID (e.g., shopItem816 -> 816)
            const imgWrap = card.querySelector('.imageWrap___O5X6r');
            if (!imgWrap) return;
            const itemId = imgWrap.id.replace('shopItem', '');

            // Find the info section to insert our button
            const infoSection = card.querySelector('.info___kGfdz');
            if (!infoSection) return;

            // Create the new SPAM button
            const btn = document.createElement('button');
            btn.innerText = "SPAM BUY";
            // Copying Torn's red button style for contrast, or keep it blue
            btn.className = "btn-blue";
            btn.style.marginTop = "5px";
            btn.style.width = "100%";
            btn.style.fontWeight = "bold";
            btn.style.border = "1px solid #444";
            btn.style.cursor = "pointer";

            // Insert the button into the card
            infoSection.appendChild(btn);

            // --- Click Handler ---
            btn.onclick = () => {
                const rfcv = getRfcv();
                if (!rfcv) { console.log("No token"); return; }

                // Visual Feedback (Flash Color)
                // We do NOT disable the button to allow spamming
                const originalColor = btn.style.backgroundColor;
                btn.style.backgroundColor = "#4caf50"; // Flash Green
                btn.innerText = "BUYING...";

                // Fire the buy command
                buyItem(itemId, rfcv);

                // Reset visual quickly
                setTimeout(() => {
                    btn.style.backgroundColor = originalColor;
                    btn.innerText = "SPAM BUY";
                }, 100);
            };
        });
    }

    // --- 4. Observer (Keeps script running when you change pages/tabs in the game) ---
    const observer = new MutationObserver((mutations) => {
        // Check if items are loaded
        if (document.querySelector('.item___usHrY')) {
            injectControls();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();