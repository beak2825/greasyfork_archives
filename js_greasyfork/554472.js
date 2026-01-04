// ==UserScript==
// @name         Mass Bazaar and Trade adder for Torn.com
// @namespace    http://tampermonkey.net/
// @version      9.6
// @description  Batch toggle items safely and quickly (checkbox-only, 5ms/item). Persistent input storage, per-tab session state. Active-tab only and “No Limit” toggle overrides batch input.
// @author       Fists [2830940] & ChatGPT
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554472/Mass%20Bazaar%20and%20Trade%20adder%20for%20Torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/554472/Mass%20Bazaar%20and%20Trade%20adder%20for%20Torncom.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let isProcessing = false;
    const PER_ITEM_DELAY = 5; // ms per item
    const MESSAGE_DURATION = 2000; // 2 seconds
    let messageTimeout = null; // for consistent messages

    // --- Utility to show messages consistently ---
    function showMessage(msg) {
        const progress = document.getElementById("massAdderProgress");
        if (!progress) return;
        if (messageTimeout) {
            clearTimeout(messageTimeout);
            messageTimeout = null;
        }
        progress.textContent = msg;
        messageTimeout = setTimeout(() => {
            progress.textContent = "";
            messageTimeout = null;
        }, MESSAGE_DURATION);
    }

    function itemIsOnActiveTab(item) {
        const list = item.closest('.items-cont');
        if (!list) return false;
        return window.getComputedStyle(list).display !== 'none';
    }

    function getMatchingItemsByName(nameLower) {
        const all = Array.from(document.querySelectorAll('.clearfix[data-group="child"], .item___jLJcf'));
        return all.filter(item => {
            if (!itemIsOnActiveTab(item)) return false;
            if (!item.querySelector(".checkbox-css")) return false; // only items with checkboxes
            if (item.classList.contains("disabled") || item.classList.contains("bg-red")) return false;
            const used = item.querySelector(".used");
            if (used && used.textContent.trim().toLowerCase() === "equipped") return false;
            const nameEl = item.querySelector('.name-wrap .t-overflow, .desc___VJSNQ span b');
            const txt = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
            return txt.includes(nameLower);
        });
    }

    function isItemSelected(item) {
        const cb = item.querySelector(".checkbox-css");
        return !!(cb && cb.checked);
    }

    function selectItem(item, itemPrice, itemPriceRaw) {
        const priceEl = item.querySelector(".input-money");
        const qtyEl = item.querySelector('.amount input[type="text"]');
        const cb = item.querySelector(".checkbox-css");

        if (cb && !cb.checked) {
            cb.checked = true;
            cb.dispatchEvent(new Event("click", { bubbles: true }));
        }
        if (qtyEl && (!qtyEl.value || qtyEl.value === "0")) {
            qtyEl.value = "999999999";
            qtyEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (itemPriceRaw !== "" && priceEl && !isNaN(itemPrice)) {
            priceEl.value = itemPrice;
            priceEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    function clearItem(item) {
        const priceEl = item.querySelector(".input-money");
        const qtyEl = item.querySelector('.amount input[type="text"]');
        const cb = item.querySelector(".checkbox-css");

        if (cb && cb.checked) {
            cb.checked = false;
            cb.dispatchEvent(new Event("click", { bubbles: true }));
        }
        if (qtyEl && qtyEl.value) {
            qtyEl.value = "";
            qtyEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (priceEl && priceEl.value) {
            priceEl.value = "";
            priceEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    function processSequential(items, fn, progressEl, label) {
        if (!items || items.length === 0) {
            showMessage("Nothing to do.");
            return lockUI(false);
        }

        let i = 0;
        progressEl.textContent = `${label} 0/${items.length}`;

        function step() {
            if (i >= items.length) {
                showMessage("Done.");
                return lockUI(false);
            }
            try { fn(items[i], i); } catch (e) {}
            i++;
            progressEl.textContent = `${label} ${i}/${items.length}`;
            setTimeout(step, PER_ITEM_DELAY);
        }

        lockUI(true);
        step();
    }

    function lockUI(lock) {
        const onBtn = document.getElementById("toggleOnButton");
        const offBtn = document.getElementById("toggleOffButton");
        if (!onBtn || !offBtn) return;
        isProcessing = !!lock;
        onBtn.disabled = lock;
        offBtn.disabled = lock;
        onBtn.style.opacity = lock ? "0.6" : "1";
        offBtn.style.opacity = lock ? "0.6" : "1";
    }

    function toggleOnNextBatch() {
        if (isProcessing) return;

        const name = (document.getElementById("itemNameInput").value || "").trim().toLowerCase();
        const itemPriceRaw = (document.getElementById("itemPriceInput").value || "").trim();
        const itemPrice = itemPriceRaw === "" ? NaN : parseFloat(itemPriceRaw);
        const batchRaw = document.getElementById("batchSizeInput").value;
        const noLimit = document.getElementById("noLimitCheckbox").checked;
        const progress = document.getElementById("massAdderProgress");

        if (!name) {
            showMessage("Enter an item name.");
            return;
        }

        let batch = parseInt(batchRaw, 10);
        if (!noLimit && (isNaN(batch) || batch < 1)) {
            showMessage("You want to change nothing?");
            return;
        }

        try {
            localStorage.setItem("massAdder_itemName", name);
            localStorage.setItem("massAdder_itemPrice", itemPriceRaw);
            localStorage.setItem("massAdder_batchSize", String(batch));
            localStorage.setItem("massAdder_noLimit", noLimit ? "1" : "0");
        } catch (e) {}

        const matching = getMatchingItemsByName(name);
        if (matching.length === 0) {
            showMessage("No matching items with checkboxes.");
            return;
        }

        const need = matching.filter(item => !isItemSelected(item));
        if (need.length === 0) {
            showMessage("Nothing left to toggle on.");
            return;
        }

        const toUse = noLimit ? need : need.slice(0, batch);
        processSequential(toUse, (it) => selectItem(it, itemPrice, itemPriceRaw), progress, "Selecting");
    }

    function toggleOffNextBatch() {
        if (isProcessing) return;

        const name = (document.getElementById("itemNameInput").value || "").trim().toLowerCase();
        const batchRaw = document.getElementById("batchSizeInput").value;
        const noLimit = document.getElementById("noLimitCheckbox").checked;
        const progress = document.getElementById("massAdderProgress");

        if (!name) {
            showMessage("Enter an item name.");
            return;
        }

        let batch = parseInt(batchRaw, 10);
        if (!noLimit && (isNaN(batch) || batch < 1)) {
            showMessage("You want to change nothing?");
            return;
        }

        try {
            localStorage.setItem("massAdder_batchSize", String(batch));
            localStorage.setItem("massAdder_noLimit", noLimit ? "1" : "0");
        } catch (e) {}

        const matching = getMatchingItemsByName(name);
        if (matching.length === 0) {
            showMessage("No matching items with checkboxes.");
            return;
        }

        const selected = matching.filter(item => isItemSelected(item));
        if (selected.length === 0) {
            showMessage("No items to clear.");
            return;
        }

        const toUse = noLimit ? selected : selected.slice(0, batch);
        processSequential(toUse, (it) => clearItem(it), progress, "Clearing");
    }

    function createUI() {
        const panel = document.createElement("div");
        panel.style.cssText =
            "position:fixed;top:10px;right:10px;width:200px;padding:8px;background:rgba(0,0,0,0.55);color:white;font-size:12px;z-index:99999;border-radius:6px;box-sizing:border-box;";
        document.body.appendChild(panel);

        const title = document.createElement("div");
        title.textContent = "Mass Item Adder";
        title.style.cssText = "font-weight:600;font-size:13px;margin-bottom:6px;";
        panel.appendChild(title);

        function label(txt) {
            const d = document.createElement("div");
            d.textContent = txt;
            d.style.cssText = "margin-top:6px;margin-bottom:3px;font-size:11px;";
            panel.appendChild(d);
        }

        label("Item Name");
        const nameInput = document.createElement("input");
        nameInput.id = "itemNameInput";
        nameInput.style.cssText = "width:100%;height:28px;font-size:11px;box-sizing:border-box;";
        panel.appendChild(nameInput);

        label("Price (blank = keep existing)");
        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.id = "itemPriceInput";
        priceInput.style.cssText = nameInput.style.cssText;
        panel.appendChild(priceInput);

        label("Batch Size (per click)");
        const batchInput = document.createElement("input");
        batchInput.type = "number";
        batchInput.id = "batchSizeInput";
        batchInput.style.cssText = nameInput.style.cssText;
        panel.appendChild(batchInput);

        label("No batch limit (ALL)");
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.id = "noLimitCheckbox";
        chk.style.transform = "scale(1.1)";
        panel.appendChild(chk);

        const row = document.createElement("div");
        row.style.cssText = "display:flex;gap:6px;margin-top:8px;";
        panel.appendChild(row);

        const onBtn = document.createElement("button");
        onBtn.id = "toggleOnButton";
        onBtn.textContent = "Toggle On";
        onBtn.style.cssText =
            "flex:1;height:32px;background:#2E7D32;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;";
        onBtn.onmouseover = () => (onBtn.style.background = "#43A047");
        onBtn.onmouseout = () => (onBtn.style.background = "#2E7D32");
        onBtn.onclick = toggleOnNextBatch;
        row.appendChild(onBtn);

        const offBtn = document.createElement("button");
        offBtn.id = "toggleOffButton";
        offBtn.textContent = "Toggle Off";
        offBtn.style.cssText =
            "flex:1;height:32px;background:#D32F2F;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;";
        offBtn.onmouseover = () => (offBtn.style.background = "#E53935");
        offBtn.onmouseout = () => (offBtn.style.background = "#D32F2F");
        offBtn.onclick = toggleOffNextBatch;
        row.appendChild(offBtn);

        const progress = document.createElement("div");
        progress.id = "massAdderProgress";
        progress.style.cssText = "margin-top:8px;min-height:16px;font-size:11px;";
        panel.appendChild(progress);

        const credit = document.createElement("div");
        credit.textContent = "Made by Fists [2830940] & ChatGPT";
        credit.style.cssText = "margin-top:8px;font-size:10px;text-align:center;color:#ddd;";
        panel.appendChild(credit);

        try {
            nameInput.value = localStorage.getItem("massAdder_itemName") || "";
            priceInput.value = localStorage.getItem("massAdder_itemPrice") || "";
            batchInput.value = localStorage.getItem("massAdder_batchSize") || "100";
            chk.checked = localStorage.getItem("massAdder_noLimit") === "1";
        } catch (e) {}
    }

    setTimeout(createUI, 1200);
})();
