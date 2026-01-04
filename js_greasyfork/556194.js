// ==UserScript==
// @name         Auto Claim Feyorra
// @namespace    http://tampermonkey.net/
// @description  Auto claim
// @author       nubiebot
// @version      1.0
// @match        https://feyorra.top/faucet*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556194/Auto%20Claim%20Feyorra.user.js
// @updateURL https://update.greasyfork.org/scripts/556194/Auto%20Claim%20Feyorra.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let solvedDetected = false;
    let claimClicked = false;

    const tryClaim = () => {
        if (claimClicked) return;
        const btn = document.querySelector('.btn.fc_btn.mb-2.claim-button.mt-2');
        if (btn) {
            console.log("CLICK → Collect your reward");
            claimClicked = true;
            btn.click();
        }
        const sub = document.querySelector('#subbutt');
        if (sub) {
            console.log("CLICK → Submittng form");
            claimClicked = true;
            sub.click();
            const form = document.querySelector('#fauform');
            if (form) form.submit();
        }
    };
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!node) continue;
                if (node.tagName === "IMG" &&
                    node.src &&
                    node.src.startsWith("chrome-extension://") &&
                    node.src.includes("success.png")
                ) {
                    console.log("Extension solved detected via image");
                    solvedDetected = true;
                    tryClaim();
                }
                if (node.textContent &&
                    node.textContent.toLowerCase().includes("solved")
                ) {
                    console.log("Extension solved detected via text");
                    solvedDetected = true;
                    tryClaim();
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
