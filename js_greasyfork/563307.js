// ==UserScript==
// @name         Kill Animations + Auto Claim (No Adblock Trigger)
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Lightweight mode without triggering anti-adblock.
// @author       Rubystance
// @license      MIT
// @match        https://faucetra.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563307/Kill%20Animations%20%2B%20Auto%20Claim%20%28No%20Adblock%20Trigger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563307/Kill%20Animations%20%2B%20Auto%20Claim%20%28No%20Adblock%20Trigger%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REF_CODE = "HS3D7Z";

    const style = document.createElement('style');
    style.innerHTML = `
        /* We stop the movement, but we don't HIDE the elements */
        *, *:before, *:after {
            animation: none !important;
            transition: none !important;
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
        }

        /* Essential for Captchas to render correctly */
        [class*="captcha"], [id*="captcha"], iframe[src*="captcha"],
        iframe[src*="recaptcha"], iframe[src*="hcaptcha"],
        .h-captcha, .g-recaptcha, #cf-turnstile-wrapper, .cf-turnstile,
        iframe[src*="challenges.cloudflare.com"] {
            animation: auto !important;
            transition: auto !important;
        }

        /* Prevent background objects from moving without removing them from DOM */
        .floating-objects, .bg-animation {
            pointer-events: none !important;
            opacity: 0.5 !important;
        }
    `;
    document.documentElement.appendChild(style);

    const checkCaptchas = () => {
        const claimBtn = document.getElementById('claimBtn');
        if (!claimBtn || claimBtn.disabled) return;

        const recaptchaResp = document.getElementById('g-recaptcha-response')?.value;
        const hcaptchaResp = document.querySelector('[name="h-captcha-response"]')?.value;
        const turnstileResp = document.querySelector('[name="cf-turnstile-response"]')?.value;

        if (
            (recaptchaResp && recaptchaResp.length > 20) ||
            (hcaptchaResp && hcaptchaResp.length > 20) ||
            (turnstileResp && turnstileResp.length > 20)
        ) {
            console.log("Harvesting coins for ref " + REF_CODE);

            setTimeout(() => {

                claimBtn.dispatchEvent(new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
            }, 800);

            clearInterval(autoClickInterval);
        }
    };

    const autoClickInterval = setInterval(checkCaptchas, 1000);

    window.addEventListener('load', () => {
        document.querySelectorAll('video').forEach(v => {
            v.pause();
            v.muted = true;
        });
    });

})();