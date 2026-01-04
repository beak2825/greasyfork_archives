// ==UserScript==
// @name         FaucetWorld Auto Flow (Safe & Turnstile-Aware)
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Navigates to Roll Game, waits for manual Turnstile, executes Roll and manages 30-minute cooldown
// @author       Rubystance
// @license      MIT
// @match        https://faucetworld.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560676/FaucetWorld%20Auto%20Flow%20%28Safe%20%20Turnstile-Aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560676/FaucetWorld%20Auto%20Flow%20%28Safe%20%20Turnstile-Aware%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REF_LINK = 'https://faucetworld.in/register?r=167580';
    const REF_KEY  = 'fw_ref_applied';

    const waitFor = (fn, timeout = 60000, interval = 400) =>
        new Promise((resolve, reject) => {
            const start = Date.now();
            const t = setInterval(() => {
                const r = fn();
                if (r) {
                    clearInterval(t);
                    resolve(r);
                }
                if (Date.now() - start > timeout) {
                    clearInterval(t);
                    reject();
                }
            }, interval);
        });

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function pressKeyOn(el, key, code) {
        el.dispatchEvent(new KeyboardEvent('keydown', {
            key,
            code,
            bubbles: true,
            cancelable: true
        }));
        el.dispatchEvent(new KeyboardEvent('keyup', {
            key,
            code,
            bubbles: true,
            cancelable: true
        }));
    }

    function applyReferralOnce() {
        if (localStorage.getItem(REF_KEY)) return;

        const isLoggedIn =
            document.querySelector('a[href="/logout"]') ||
            document.querySelector('[data-user-menu]');

        if (isLoggedIn) {
            localStorage.setItem(REF_KEY, 'true');
            return;
        }

        if (
            location.pathname === '/login' ||
            location.pathname === '/register'
        ) {
            localStorage.setItem(REF_KEY, 'true');
            return;
        }

        localStorage.setItem(REF_KEY, 'true');
        location.href = REF_LINK;
    }

    function goToRollGame() {
        return waitFor(() =>
            [...document.querySelectorAll('a[href="/roll-game"]')][0]
        ).then(a => a.click());
    }

    async function selectTurnstile() {
        const group = await waitFor(() =>
            document.querySelector('div[role="group"][aria-label="captcha provider selector"]')
        );

        while (true) {
            const buttons = group.querySelectorAll('button[role="radio"]');
            const cloudflare = buttons[1];

            if (!cloudflare) return;

            const active =
                cloudflare.getAttribute('aria-checked') === 'true' ||
                cloudflare.getAttribute('data-state') === 'on';

            if (active) break;

            cloudflare.focus({ preventScroll: true });
            await sleep(50);
            pressKeyOn(cloudflare, ' ', 'Space');
            await sleep(120);
            pressKeyOn(cloudflare, 'Enter', 'Enter');
            await sleep(120);
            cloudflare.click();
            await sleep(600);
        }
    }

    function waitForTurnstileSolved() {
        return waitFor(() => {
            const rollBtn = document.querySelector(
                'button[type="submit"][aria-label*="Roll"]'
            );

            const tokenInput = document.querySelector(
                'input[name="cf-turnstile-response"]'
            );

            if (!rollBtn || rollBtn.disabled) return null;
            if (!tokenInput || !tokenInput.value || tokenInput.value.length < 10) return null;

            return rollBtn;
        }, 10 * 60 * 1000);
    }

    function clickRoll(btn) {
        btn.click();
    }

    function goToAutoFaucet() {
        return waitFor(() =>
            [...document.querySelectorAll('a[href="/auto-faucet"]')][0]
        ).then(a => a.click());
    }

    async function goToAutoFaucetAfterRoll() {
        const link = await waitFor(() =>
            document.querySelector('a[href="/auto-faucet"]'),
            60000
        );
        link.click();
    }

    function monitorCooldown() {
        const CHECK_INTERVAL = 30 * 1000;

        setInterval(() => {
            fetch('/roll-game', { credentials: 'include' })
                .then(r => r.text())
                .then(html => {
                    if (html.includes('Roll to Win') && !html.includes('disabled')) {
                        location.href = '/roll-game';
                    }
                })
                .catch(() => {});
        }, CHECK_INTERVAL);
    }

    function autoFaucetTimer() {
        const THIRTY_MINUTES = 30 * 60 * 1000;

        setTimeout(() => {
            location.href = '/roll-game';
        }, THIRTY_MINUTES);
    }

    (async function main() {
        applyReferralOnce();

        if (location.pathname === '/') {
            await goToRollGame();
        }

        if (location.pathname === '/roll-game') {
            await selectTurnstile();
            const rollBtn = await waitForTurnstileSolved();
            clickRoll(rollBtn);

            await goToAutoFaucetAfterRoll();
            monitorCooldown();
        }

        if (location.pathname === '/auto-faucet') {
            autoFaucetTimer();
        }
    })();
})();
