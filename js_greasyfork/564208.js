// ==UserScript==
// @name         The West Gunsmith Multi-Buy (Button)
// @namespace    tw-gunsmith-multibuy
// @version      2.0
// @description  Buy a hardcoded Gunsmith item in bulk via floating button (safe 1/sec)
// @author       Roman
// @include      *.the-west.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564208/The%20West%20Gunsmith%20Multi-Buy%20%28Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564208/The%20West%20Gunsmith%20Multi-Buy%20%28Button%29.meta.js
// ==/UserScript==
// @license MIT

(function () {
    'use strict';

    const BUY_DELAY = 1000;
    const ITEM_ID = 53711000;            // <<< CHANGE THIS to your desired item ID

    function waitForGame(cb) {
        const i = setInterval(() => {
            if (window.Trader && window.Ajax && window.west && west.gui && window.$) {
                clearInterval(i);
                cb();
            }
        }, 500);
    }

    waitForGame(() => {
        console.log("[Gunsmith MultiBuy] Loaded (Button version)");
        createMultiBuyButton();
    });

    function isGunsmithOpen() {
        return window.Trader && Trader.type === "gunsmith";
    }

    // ================= UI BUTTON =================

    function createMultiBuyButton() {
        if (document.getElementById('mb_button')) return;

        const btn = document.createElement('button');
        btn.id = 'mb_button';
        btn.textContent = 'Multi Buy';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '99999';
        btn.style.padding = '10px 14px';
        btn.style.background = '#2c3e50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

        btn.onclick = () => {
            if (!isGunsmithOpen()) {
                new UserMessage("Open Gunsmith first", UserMessage.TYPE_ERROR).show();
                return;
            }
            showMultiBuyDialog(ITEM_ID);
        };

        document.body.appendChild(btn);
    }

    // ================= DIALOG =================

    function showMultiBuyDialog(itemId) {
        const item = ItemManager.get(itemId);
        if (!item) {
            console.error("Item not found", itemId);
            new UserMessage("Item not found", UserMessage.TYPE_ERROR).show();
            return;
        }

        const name = item.name || item.label || `Item ${itemId}`;
        const price = item.price_buy || item.price || '?';

        const html = `
            <div style="padding:10px;">
                <b>${name}</b><br><br>
                Price: $${price}<br><br>
                Amount:
                <input type="number" id="mb_amount" value="1" min="1" style="width:80px;"><br><br>
            </div>
        `;

        const dialog = new west.gui.Dialog("Multi Buy", html)
            .addButton("Buy", () => {
                const amount = parseInt(document.getElementById("mb_amount").value, 10);
                closeDialogSafe(dialog);
                startBuying(itemId, amount);
            })
            .addButton("Close", () => closeDialogSafe(dialog))
            .setModal(true, true)
            .show();
    }

    function closeDialogSafe(dialog) {
        if (!dialog) return;
        if (typeof dialog.close === 'function') dialog.close();
        else if (typeof dialog.hide === 'function') dialog.hide();
        else if (typeof dialog.destroy === 'function') dialog.destroy();
    }

    // ================= BUY LOGIC =================

    function startBuying(itemId, total) {
        let bought = 0;

        function buyNext() {
            if (bought >= total) {
                new UserMessage(`Finished buying ${bought}`, UserMessage.TYPE_SUCCESS).show();
                return;
            }

            if (!Bag.getLastInvId()) {
                console.warn("Inventory not ready yet");
                setTimeout(buyNext, BUY_DELAY);
                return;
            }

            //SHOP TYPES
            //building_gunsmith,building_general,building_tailor,item_trader
            Ajax.remoteCall("building_gunsmith", "buy", {
                item_id: itemId,
                town_id: Trader.id,
                last_inv_id: Bag.getLastInvId()
            }, function (json) {
                if (!json || json.error) {
                    console.error("Buy error:", json);
                    new UserMessage(json?.error || "Buy failed", UserMessage.TYPE_ERROR).show();
                    return;
                }

                Trader.handleBuyResponse(json);
                bought++;
                setTimeout(buyNext, BUY_DELAY);
            });
        }

        buyNext();
    }

})();
