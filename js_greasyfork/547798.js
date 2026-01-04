// ==UserScript==
// @name         Torn Russian Roulette Quick Bet Buttons (2x2 Grid)
// @namespace    TornRRQuickBet
// @version      2.4
// @description  Adds 4 small quick bet buttons in a 2x2 grid next to the Start button in Russian Roulette
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547798/Torn%20Russian%20Roulette%20Quick%20Bet%20Buttons%20%282x2%20Grid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547798/Torn%20Russian%20Roulette%20Quick%20Bet%20Buttons%20%282x2%20Grid%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your 4 quick bet amounts
    const BET_AMOUNTS = [200000, 500000, 1000000, 3000000]; // 200K, 500K, 1M, 3M

    // React-safe setter for read-only inputs
    function setReactValue(input, value) {
        const lastValue = input.value;
        input.value = value;
        const tracker = input._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function addButtons() {
        // Grab the money input
        const betInput = document.querySelector('input.input-money.input___j7D9i');
        if (!betInput) return;

        // Grab the "Start" button
        const startBtn = document.querySelector('button.submit___Yr2z1.torn-btn');
        if (!startBtn) return;

        // Prevent duplicates
        if (document.querySelector("#quickBetContainer")) return;

        // Container
        const container = document.createElement("div");
        container.id = "quickBetContainer";
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(2, auto)";
        container.style.gap = "4px";
        container.style.marginLeft = "8px";

        BET_AMOUNTS.forEach(amount => {
            const btn = document.createElement("button");
            btn.textContent = amount >= 1000000
                ? (amount / 1000000) + "M"
                : (amount / 1000) + "k";
            btn.className = "torn-btn";
            btn.style.fontSize = "11px";
            btn.style.padding = "2px 6px";
            btn.style.minWidth = "40px";
            btn.addEventListener("click", () => {
                setReactValue(betInput, amount);
            });
            container.appendChild(btn);
        });

        // Insert container right after Start button
        startBtn.parentNode.insertBefore(container, startBtn.nextSibling);
    }

    // Watch for UI reload
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Backup interval
    setInterval(addButtons, 2000);
    addButtons();
})();
