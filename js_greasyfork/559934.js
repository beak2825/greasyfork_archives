// ==UserScript==
// @name         Solaseek Auto Claim Flow (Full Cycle)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Automates Solaseek claim flow, waits for Cloudflare Turnstile, refreshes after 3 minutes, and resumes automatically
// @author       Rubystance
// @license      MIT
// @match        https://solaseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559934/Solaseek%20Auto%20Claim%20Flow%20%28Full%20Cycle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559934/Solaseek%20Auto%20Claim%20Flow%20%28Full%20Cycle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL
    const MAX_RUNTIME = 180000; // 3 minutes
    const START_TIME = Date.now();

    const timeoutWatcher = setInterval(() => {
        if (Date.now() - START_TIME >= MAX_RUNTIME) {
            const refreshBtn = document.querySelector('a[href="https://solaseek.com?refresh=1"]');
            if (refreshBtn) {
                refreshBtn.click();
            } else {
                window.location.href = 'https://solaseek.com?refresh=1';
            }
            clearInterval(timeoutWatcher);
        }
    }, 1000);

    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
                if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    reject(`Timeout waiting for ${selector}`);
                }
            }, 500);
        });
    }

    function waitForTurnstileSolved(timeout = 120000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = setInterval(() => {
                const token = document.querySelector('input[name="cf-turnstile-response"]');
                if (token && token.value && token.value.length > 20) {
                    clearInterval(check);
                    resolve(true);
                }
                if (Date.now() - start > timeout) {
                    clearInterval(check);
                    reject('Cloudflare Turnstile not solved in time');
                }
            }, 500);
        });
    }

    async function handleRefreshPage() {
        try {
            const claimNowBtn = await waitForElement('a[href="https://solaseek.com"]');
            claimNowBtn.click();
        } catch (e) {
            console.log('[Solaseek]', e);
        }
    }

    async function firstStep() {
        try {
            const input = await waitForElement('#address');
            input.value = EMAIL;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            const verifyBtn = await waitForElement('button[type="submit"]');
            verifyBtn.click();

            await waitForElement('h2.mb-3');
            setTimeout(() => location.reload(), 1500);

        } catch (e) {
            console.log('[Solaseek]', e);
        }
    }

    async function secondStep() {
        try {
            const loadBtn = await waitForElement('#load-turnstile-btn');
            loadBtn.click();

            await waitForTurnstileSolved();

            const sponsorBtn = await waitForElement('#monetag-smartlink-btn');
            sponsorBtn.click();

            setTimeout(async () => {
                const completeBtn = await waitForElement('#login');
                completeBtn.click();
            }, 3000);

        } catch (e) {
            console.log('[Solaseek]', e);
        }
    }

    if (window.location.search.includes('refresh=1')) {
        handleRefreshPage();
    } else if (document.querySelector('#load-turnstile-btn')) {
        secondStep();
    } else {
        firstStep();
    }

})();
