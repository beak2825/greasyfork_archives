// ==UserScript==
// @name         Block Pulse Auto Claim Antibot
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Solves the antibot order, waits for Cloudflare Turnstile, then clicks Claim
// @author       Rubystance
// @license      MIT
// @match        https://blockpulse.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562391/Block%20Pulse%20Auto%20Claim%20Antibot.user.js
// @updateURL https://update.greasyfork.org/scripts/562391/Block%20Pulse%20Auto%20Claim%20Antibot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function solve() {
        const header = document.querySelector('h6.text-white.fw-bold');
        if (!header) return;

        const sequence = header.innerText.split('•').map(s => s.trim());
        const images = Array.from(document.querySelectorAll('img.antibot-item'));

        if (sequence.length > 0 && images.length > 0) {
            console.log("Order detected:", sequence);

            sequence.forEach((word, index) => {
                setTimeout(() => {
                    const targetImg = images.find(img => img.src.includes(`text=${word}`));

                    if (targetImg) {
                        console.log(`Clicking: ${word}`);
                        targetImg.click();
                    }

                    if (index === sequence.length - 1) {
                        console.log("Antibot finished. Waiting for Cloudflare Turnstile...");
                        watchTurnstile();
                    }
                }, index * 600);
            });
        }
    }

    function watchTurnstile() {
        const turnstileCheck = setInterval(() => {

            const response = document.querySelector('[name="cf-turnstile-response"]');

            if (response && response.value !== "") {
                console.log("Cloudflare Turnstile solved detected!");
                clearInterval(turnstileCheck);
                setTimeout(submitForm, 500);
            }
        }, 1000);
    }

    function submitForm() {

        const claimBtn = document.querySelector('button.btn-claim');

        if (claimBtn) {
            console.log("Submitting: EXECUTE CLAIM");
            claimBtn.click();
        }
    }

    window.addEventListener('load', () => {

        setTimeout(solve, 2000);
    });

})();
