// ==UserScript==
// @name         CoinKeel Auto Faucet
// @namespace    https://coinkeel.com/
// @version      1.0
// @description  Automatic faucet claim loop with realistic delays
// @author       Rubystance
// @license      MIT
// @match        https://coinkeel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559880/CoinKeel%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/559880/CoinKeel%20Auto%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg) => console.log('[CoinKeel]', msg);
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function waitForClickable(selector, checkInterval = 300, timeout = 60000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const el = document.querySelector(selector);
            if (el) {
                const style = window.getComputedStyle(el);
                const clickable = !el.disabled && style.pointerEvents !== 'none' && style.visibility !== 'hidden';
                if (clickable) return el;
            }
            await sleep(checkInterval);
        }
        throw new Error(`Timeout waiting for clickable element: ${selector}`);
    }

    async function clickAnyFaucetLink() {
        const links = Array.from(document.querySelectorAll('a.nav-link'))
            .filter(a => a.textContent.trim() === 'Faucet Claim');
        if (links.length === 0) throw new Error('No Faucet Claim link found on dashboard');
        const link = links[0];
        const style = window.getComputedStyle(link);
        if (!link.disabled && style.pointerEvents !== 'none' && style.visibility !== 'hidden') {
            log(`Clicking Faucet Claim link: ${link.href}`);
            link.click();
        }
    }

    async function faucetFlow() {
        const url = window.location.href;

        try {

            if (url.includes('?game=dashboard')) {
                log('Dashboard detected, waiting 1-2s...');
                await sleep(1000 + Math.random() * 1000);
                await clickAnyFaucetLink();
                return;
            }

            if (url.includes('?games=')) {
                log('Faucet page detected, waiting 3-5s...');
                await sleep(3000 + Math.random() * 2000);
                const claimBtn = await waitForClickable('#cmopn');
                log('Clicking Claim 20 Coins');
                claimBtn.click();
                return;
            }

            if (url.includes('?play=')) {
                log('Game page detected, waiting 2-3s...');
                await sleep(2000 + Math.random() * 1000);
                const visitBtn = await waitForClickable('#rm');
                log('Clicking Visit Link');
                visitBtn.click();

                log('Waiting for Please Verify button to become clickable (may take up to 60s)...');
                const verifyBtn = await waitForClickable('#cmv', 300, 60000);
                log('Clicking Please Verify');
                verifyBtn.click();

                await sleep(2000);
                return;
            }

        } catch (e) {
            log('Error in faucetFlow:', e);
        }
    }

    async function mainLoop() {
        while (true) {
            await faucetFlow();
            await sleep(1000);
        }
    }

    mainLoop();

})();
