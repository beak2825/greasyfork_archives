// ==UserScript==
// @name         CoinKeel Auto Faucet + Tabs + Popups + Verify + Auto Reload
// @namespace    https://coinkeel.com/
// @version      1.3
// @description  Automatic faucet claim loop with realistic delays, popup control, tab handling, verify click and auto reload on redirect.
// @author       Rubystance
// @license      MIT
// @match        https://coinkeel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559880/CoinKeel%20Auto%20Faucet%20%2B%20Tabs%20%2B%20Popups%20%2B%20Verify%20%2B%20Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/559880/CoinKeel%20Auto%20Faucet%20%2B%20Tabs%20%2B%20Popups%20%2B%20Verify%20%2B%20Auto%20Reload.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg) => console.log('[CoinKeel]', msg);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const originalOpen = window.open;
    window.open = function (url) {
        log('Popup blocked:', url);
        return null;
    };

    let lastUrl = location.href;
    let lastActivity = Date.now();

    setInterval(() => {

        if (location.href !== lastUrl) {
            lastUrl = location.href;
            lastActivity = Date.now();
        }

        if (Date.now() - lastActivity > 90000) { // 90s
            log('Stuck detected, reloading page (F5)');
            location.reload();
        }
    }, 2000);

    window.addEventListener('beforeunload', () => {
        log('Browser redirect detected, forcing reload');
        setTimeout(() => location.reload(), 1000);
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            lastActivity = Date.now();
        }
    });

    async function waitForClickable(selector, checkInterval = 300, timeout = 60000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el && !el.disabled) return el;
            await sleep(checkInterval);
        }
        throw new Error(`Timeout waiting for ${selector}`);
    }

    async function clickAnyFaucetLink() {
        const link = [...document.querySelectorAll('a.nav-link')]
            .find(a => a.textContent.trim() === 'Faucet Claim');
        if (link) {
            log('Clicking Faucet Claim');
            link.click();
            lastActivity = Date.now();
        }
    }

    let verifyClicked = false;

    function observeVerifyButton() {
        const observer = new MutationObserver(async () => {
            if (verifyClicked) return;

            const btn = document.querySelector('#cmv');
            if (btn && !btn.disabled && /verify/i.test(btn.innerText)) {
                verifyClicked = true;
                log('Please Verify detected');
                await sleep(4000 + Math.random() * 2000);
                btn.click();
                lastActivity = Date.now();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function faucetFlow() {
        const url = location.href;

        try {
            if (url.includes('dashboard')) {
                await sleep(1000 + Math.random() * 1000);
                await clickAnyFaucetLink();
                return;
            }

            if (url.includes('?games=')) {
                await sleep(3000 + Math.random() * 2000);
                const claimBtn = await waitForClickable('#cmopn');
                log('Clicking Claim');
                claimBtn.click();
                lastActivity = Date.now();
                return;
            }

            if (url.includes('?play=')) {
                await sleep(3000 + Math.random() * 2000);

                const visitBtn = document.querySelector('#rm');
                if (visitBtn && !visitBtn.disabled) {
                    log('Clicking Visit Link');
                    visitBtn.click();
                    lastActivity = Date.now();
                }

                observeVerifyButton();
                return;
            }
        } catch (e) {
            log(e.message);
        }
    }

    async function mainLoop() {
        while (true) {
            await faucetFlow();
            await sleep(1200);
        }
    }

    mainLoop();

})();
