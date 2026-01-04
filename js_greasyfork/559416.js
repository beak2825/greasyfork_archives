// ==UserScript==
// @name         Zerofaucet Auto Loop
// @namespace    https://zerofaucet.top/
// @version      1.0
// @description  Fully automated faucet claim
// @author       Rubystance
// @license      MIT
// @match        https://zerofaucet.top/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559416/Zerofaucet%20Auto%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/559416/Zerofaucet%20Auto%20Loop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ADDRESS = "YOUR_ADDRESS_HERE";
    const LOOP_TIME = 65000; // 1 minute and 5 seconds

    function click(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            return true;
        }
        return false;
    }

    function goDashboardThenFaucet() {
        setTimeout(() => {
            click('a[href="index.php?page=dashboard"]');

            setTimeout(() => {
                click('a[href="index.php?page=faucet"]');
            }, 1500);

        }, LOOP_TIME);
    }

    if (location.pathname.endsWith("index.php") && !location.search) {
        const input = document.querySelector('input[name="address"]');
        const button = document.querySelector('button[type="submit"]');

        if (input && button) {
            input.value = ADDRESS;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => button.click(), 500);
        }
    }

    if (location.search.includes("page=dashboard")) {
        setTimeout(() => {
            click('a[href="index.php?page=faucet"]');
        }, 1000);
    }

    if (location.search.includes("page=faucet")) {
        setTimeout(() => {
            click('button.btn.btn-success.btn-lg');
        }, 1000);
    }

    if (location.search.includes("page=verify")) {
        const interval = setInterval(() => {
            const claimButton = document.querySelector('button.btn.btn-success[type="submit"]');
            if (!claimButton) return;

            const rect = claimButton.getBoundingClientRect();
            const style = getComputedStyle(claimButton);

            if (
                rect.width > 0 &&
                rect.height > 0 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden'
            ) {
                claimButton.click();
                clearInterval(interval);
            }
        }, 1500);
    }

    if (
        location.search.includes("page=faucet") &&
        document.body.innerText.includes("You've claimed successfully")
    ) {
        goDashboardThenFaucet();
    }

})();
