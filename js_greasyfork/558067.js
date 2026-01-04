// ==UserScript==
// @name         Auto Claim Cryptoearns
// @namespace    http://tampermonkey.net/
// @description  Auto claim
// @author        nubiebot
// @version      1.0
// @match        https://cryptoearns.com/faucet*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558067/Auto%20Claim%20Cryptoearns.user.js
// @updateURL https://update.greasyfork.org/scripts/558067/Auto%20Claim%20Cryptoearns.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let solvedDetected = false;
    let claimClicked = false;
    let retryCount = 0;
    const maxRetry = 3;

    const tryClaim = () => {
        if (claimClicked) return;

        const btn = document.querySelector('button.claim-button.btn.btn_primary');

        if (btn && !btn.disabled) {
            claimClicked = true;
            btn.click();
            return;
        }
    };

    const delayedTry = () => {
        const interval = setInterval(() => {
            retryCount++;

            tryClaim();

            if (claimClicked || retryCount >= maxRetry) {
                clearInterval(interval);
            }
        }, 1000);
    };

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!node) continue;
                if (
                    node.tagName === "IMG" &&
                    node.src &&
                    node.src.startsWith("chrome-extension://") &&
                    node.src.includes("success.png")
                ) {
                    solvedDetected = true;
                    delayedTry();
                }

                if (
                    node.textContent &&
                    node.textContent.toLowerCase().includes("solved")
                ) {
                    solvedDetected = true;
                    delayedTry();
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
