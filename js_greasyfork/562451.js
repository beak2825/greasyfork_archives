// ==UserScript==
// @name         CryptoClicks Auto Roll
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Automates the roll process by monitoring the Turnstile token to bypass iframe restrictions.
// @author       Rubystance
// @license      MIT
// @match        https://cryptoclicks.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562451/CryptoClicks%20Auto%20Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/562451/CryptoClicks%20Auto%20Roll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REF_KEY = 'cryptoclicks_ref_used';
    const REF_URL = 'https://cryptoclicks.net/?ref=9205';

    if (!localStorage.getItem(REF_KEY)) {
        localStorage.setItem(REF_KEY, 'yes');
        location.href = REF_URL;
        return;
    }

    let lastActivity = Date.now();
    setInterval(() => {

        if (Date.now() - lastActivity > 120000) {
            console.warn('[AutoRoll] Watchdog timeout - reloading page');
            location.reload();
        }
    }, 10000);

    function startProcess() {
        const btnModal = document.querySelector('#btn-modal');
        if (btnModal && btnModal.offsetParent !== null) {
            console.log('[AutoRoll] Opening Modal...');
            btnModal.click();
            setTimeout(selectCloudflare, 2000);
        } else {

            setTimeout(startProcess, 30000);
        }
    }

    function selectCloudflare() {
        const select = document.querySelector('select');
        if (select) {
            console.log('[AutoRoll] Selecting Cloudflare/Turnstile...');
            select.value = "3";
            select.dispatchEvent(new Event('change', { bubbles: true }));
            lastActivity = Date.now();
            checkCaptchaSolved();
        }
    }

    function checkCaptchaSolved() {
        console.log('[AutoRoll] Waiting for Captcha resolution...');

        const checkInterval = setInterval(() => {

            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
            const rollButton = document.querySelector('#rollFaucet');

            if (turnstileResponse && turnstileResponse.value.length > 10) {
                console.log('[AutoRoll] Captcha Solved! Preparing to Roll...');
                clearInterval(checkInterval);
                lastActivity = Date.now();

                const delay = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

                setTimeout(() => {
                    if (rollButton) {
                        rollButton.click();
                        console.log('[AutoRoll] Button Clicked Successfully!');
                    }
                }, delay);
            }

            lastActivity = Date.now();
        }, 1500);
    }

    window.addEventListener('load', () => {
        console.log('[AutoRoll] Script initialized');
        setTimeout(startProcess, 3000);
    });

})();