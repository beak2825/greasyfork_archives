// ==UserScript==
// @name         CryptoFaucetScan Auto Claim
// @namespace    https://cryptofaucetscan.com/
// @version      1.0
// @description  Auto fill email and auto click claim buttons when timers are ready
// @author       Rubystance
// @license      MIT
// @match        https://cryptofaucetscan.com/crypto/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559444/CryptoFaucetScan%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/559444/CryptoFaucetScan%20Auto%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = "YOUR_FAUCETPAY_EMAIL"; // ← Your faucetpay email here

    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject("Element not found: " + selector);
                }
            }, 400);
        });
    }

    function waitForClaimReady(button, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const text = button.innerText.toUpperCase();
                const disabled =
                    button.disabled ||
                    button.classList.contains("disabled") ||
                    button.getAttribute("aria-disabled") === "true";

                if (
                    !disabled &&
                    (text.includes("CLAIM NOW") || text.includes("READY NEXT CLAIM"))
                ) {
                    clearInterval(interval);
                    resolve();
                }

                if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    reject("Claim button did not become available");
                }
            }, 500);
        });
    }

    async function run() {
        const url = location.href;

        if (url.endsWith("/crypto/")) {
            const emailInput = await waitForElement("#email");
            emailInput.value = EMAIL;
            emailInput.dispatchEvent(new Event("input", { bubbles: true }));

            (await waitForElement("#captcha")).click();
            (await waitForElement(".btn-start")).click();
        }

        if (document.querySelector("#notificationConfirmBtn")) {
            (await waitForElement("#notificationConfirmBtn")).click();
        }

        if (url.includes("/crypto/dashboard")) {
            (await waitForElement("a[href*='/crypto/faucet']")).click();
        }

        if (url.endsWith("/crypto/faucet")) {
            (await waitForElement(
                "button[onclick*=\"goToCryptoPage('doge')\"]"
            )).click();
        }

        if (url.includes("/crypto/faucet/doge")) {
            const claimBtn = await waitForElement("#claimButton");

            console.log("⏳ Waiting for claim timer...");

            await waitForClaimReady(claimBtn);

            claimBtn.click();
            console.log("⚡ Claim executed");
        }
    }

    run().catch(console.error);
})();
