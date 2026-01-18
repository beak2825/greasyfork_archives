// ==UserScript==
// @name         CryptoClicks Auto Roll
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Optimized version.
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

    const watchdog = setInterval(() => {
        if (Date.now() - lastActivity > 180000) {
            console.warn('[AutoRoll] Freeze detected - Restarting...');
            location.reload();
        }
    }, 20000);

    function startProcess() {

        const timerExist = document.querySelector('.time-left, #timer');
        if (timerExist && timerExist.innerText.includes(':')) {
            console.log('[AutoRoll] Waiting for Faucet timer to end...');
            setTimeout(startProcess, 60000);
            return;
        }

        const btnModal = document.querySelector('#btn-modal');
        if (btnModal && btnModal.offsetParent !== null) {
            console.log('[AutoRoll] Opening Modal...');
            btnModal.click();
            lastActivity = Date.now();
            setTimeout(selectCloudflare, 3000);
        } else {

            setTimeout(startProcess, 10000);
        }
    }

    function selectCloudflare() {
        const select = document.querySelector('select');
        if (select) {
            console.log('[AutoRoll] Selecting Cloudflare...');
            select.value = "3";
            select.dispatchEvent(new Event('change', { bubbles: true }));
            lastActivity = Date.now();
            checkCaptchaSolved();
        } else {
            console.log('[AutoRoll] Select not found, retrying...');
            setTimeout(startProcess, 5000);
        }
    }

    function checkCaptchaSolved() {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
            const rollButton = document.querySelector('#rollFaucet');

            if (turnstileResponse && turnstileResponse.value.length > 10) {
                console.log('[AutoRoll] Captcha Solved!');
                clearInterval(checkInterval);
                lastActivity = Date.now();

                const delay = Math.floor(Math.random() * 2000) + 1500;

                setTimeout(() => {
                    if (rollButton && !rollButton.disabled) {
                        rollButton.click();
                        console.log('[AutoRoll] Roll executed successfully!');

                        setTimeout(() => location.reload(), 5000);
                    }
                }, delay);
            }

            attempts++;
            if (attempts > 60) {
                clearInterval(checkInterval);
                location.reload();
            }

            lastActivity = Date.now();
        }, 2000);
    }

    if (document.readyState === 'complete') {
        setTimeout(startProcess, 4000);
    } else {
        window.addEventListener('load', () => setTimeout(startProcess, 4000));
    }

})();