// ==UserScript==
// @name         BigBTC Auto Enter + hCaptcha Aware Claim
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Forces referral entry, auto-fills BTC address and waits for hCaptcha before claiming
// @author       Rubystance
// @license      MIT
// @match        https://bigbtc.win/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560798/BigBTC%20Auto%20Enter%20%2B%20hCaptcha%20Aware%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/560798/BigBTC%20Auto%20Enter%20%2B%20hCaptcha%20Aware%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BTC_ADDRESS = 'PUT_YOUR_BTC_FAUCETPAY_ADDRESS_HERE';
    const REF_ID = '50875290';

    const url = new URL(window.location.href);

    if (!url.searchParams.has('id') && url.pathname === '/') {
        url.searchParams.set('id', REF_ID);
        window.location.replace(url.toString());
        return;
    }

    function handleHomePage() {
        const addressInput = document.querySelector('input[name="address"]');
        const submitBtn = document.querySelector('input[type="submit"][value="ENTER"]');

        if (!addressInput || !submitBtn) return;

        addressInput.value = BTC_ADDRESS;
        addressInput.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
            submitBtn.click();
        }, 800);
    }

    function handleFaucetPage() {
        const claimBtn = document.querySelector('#claimbutn');
        if (!claimBtn) return;

        const interval = setInterval(() => {
            const captchaResponse =
                document.querySelector('textarea[name="h-captcha-response"]') ||
                document.querySelector('textarea[name="g-recaptcha-response"]');

            const solved =
                captchaResponse &&
                captchaResponse.value &&
                captchaResponse.value.length > 0;

            if (solved && !claimBtn.disabled) {
                clearInterval(interval);
                setTimeout(() => {
                    claimBtn.click();
                }, 800);
            }
        }, 1000);
    }

    window.addEventListener('load', () => {
        if (location.pathname === '/') {
            handleHomePage();
        }

        if (location.pathname.startsWith('/faucet')) {
            handleFaucetPage();
        }
    });
})();
