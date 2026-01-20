// ==UserScript==
// @name        Faucetra Auto-Claimer
// @namespace   https://faucetra.com/scripts/automator
// @match       https://faucetra.com/*
// @description Automatically navigates from the dashboard to the faucet page, and clicks the claim button after the Cloudflare Turnstile captcha is successfully resolved.
// @grant       none
// @version     1.0
// @author      Rubystance
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/563307/Faucetra%20Auto-Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/563307/Faucetra%20Auto-Claimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refKey = 'faucetra_ref_visited';
    if (!localStorage.getItem(refKey)) {
        localStorage.setItem(refKey, 'true');
        window.location.href = "https://faucetra.com/ref/HS3D7Z";
        return;
    }

    const currentUrl = window.location.href;

    if (currentUrl.includes('/dashboard')) {
        const faucetCard = document.querySelector('a[href="/faucet"].earning_card');
        if (faucetCard) {
            console.log("Redirecting to Faucet page...");
            faucetCard.click();
        }
    }

    if (currentUrl.includes('/faucet')) {
        const monitorCaptcha = setInterval(() => {
            const claimBtn = document.querySelector('#claimBtn');

            const turnstileInput = document.querySelector('[name="cf-turnstile-response"]');

            if (claimBtn && turnstileInput && turnstileInput.value !== "") {
                console.log("Captcha detected as solved. Clicking Claim button...");
                clearInterval(monitorCaptcha);
                claimBtn.click();
            }
        }, 2000);
    }
})();