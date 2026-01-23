// ==UserScript==
// @name         Coinadster Faucet
// @namespace    Coinadster Auto Faucet Claim
// @version      0.9
// @description  Faucet Automation
// @author       Shnethan
// @match        *://coinadster.com/*
// @icon         https://coinadster.com/logos2.png
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563649/Coinadster%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563649/Coinadster%20Faucet.meta.js
// ==/UserScript==

(function() {
    const i = setInterval(() => {
        const b = document.getElementById('unlock_btn');
        if (!b || b.disabled || b.textContent.trim() !== "Claim 4.4 bits and 1 lottery ticket") return;

        const h = document.querySelector('textarea[name="h-captcha-response"]');
        const t = document.querySelector('input[name="cf-turnstile-response"]');

        if ((!h && !t) || (h?.value.trim() || t?.value.trim())) {
            clearInterval(i);
            b.click();
        }
    }, 500);
})();
