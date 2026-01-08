// ==UserScript==
// @name         ZeroBet Full Auto Cycle
// @namespace    https://zerobet.pro/
// @version      1.1
// @description  Login → Cookie(35x) → Mystery Box → Spin(5x) → STOP
// @author       Rubystance
// @license      MIT
// @match        https://zerobet.pro/login.php
// @match        https://zerobet.pro/dashboard.php
// @match        https://zerobet.pro/clicker.php
// @match        https://zerobet.pro/mystery_box.php
// @match        https://zerobet.pro/spin_wheel.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561645/ZeroBet%20Full%20Auto%20Cycle.user.js
// @updateURL https://update.greasyfork.org/scripts/561645/ZeroBet%20Full%20Auto%20Cycle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STATE = {
        COOKIE_DONE: 'ZB_COOKIE_DONE',
        MYSTERY_DONE: 'ZB_MYSTERY_DONE',
        SPIN_DONE: 'ZB_SPIN_DONE',
        SESSION_DONE: 'ZB_SESSION_DONE',
        COOKIE_ROUNDS: 'ZB_COOKIE_ROUNDS',
        SPIN_COUNT: 'ZB_SPIN_COUNT'
    };

    const path = location.pathname;

    function stopEverything() {
        console.log('[ZeroBet] ✅ Full cycle completed.');
        sessionStorage.setItem(STATE.SESSION_DONE, 'true');
    }

    if (
        sessionStorage.getItem(STATE.SESSION_DONE) === 'true' &&
        !path.includes('login.php')
    ) return;

    if (path.includes('login.php')) {
        Object.values(STATE).forEach(k => sessionStorage.removeItem(k));

        const WALLET_ADDRESS = 'YOUR_ZERO_WALLET_HERE'; // << YOUR_ZERO_WALLET

        setInterval(() => {
            const wallet = document.querySelector('input[name="wallet"]');
            const btn = document.querySelector('button[type="submit"]');
            if (!wallet || !btn) return;

            wallet.value = WALLET_ADDRESS;
            wallet.dispatchEvent(new Event('input', { bubbles: true }));
            btn.click();
        }, 1000);
    }

    if (path.includes('dashboard.php')) {
        setInterval(() => {
            const rounds = Number(sessionStorage.getItem(STATE.COOKIE_ROUNDS) || 0);

            if (!sessionStorage.getItem(STATE.COOKIE_DONE)) {
                if (rounds < 40) {
                    document.querySelector('a[href="clicker.php"]')?.click();
                    return;
                } else {
                    sessionStorage.setItem(STATE.COOKIE_DONE, 'true');
                }
            }

            if (!sessionStorage.getItem(STATE.MYSTERY_DONE)) {
                document.querySelector('a[href="mystery_box.php"]')?.click();
                return;
            }

            if (!sessionStorage.getItem(STATE.SPIN_DONE)) {
                document.querySelector('a[href="spin_wheel.php"]')?.click();
                return;
            }

            stopEverything();
        }, 1000);
    }

    if (path.includes('clicker.php')) {
        const MAX_CLICKS = 301;
        let clicks = 0;

        function ultraClick() {
            const btn = document.getElementById('clickBtn');
            if (!btn) {
                requestAnimationFrame(ultraClick);
                return;
            }

            if (clicks < MAX_CLICKS) {
                btn.click();
                clicks++;
                requestAnimationFrame(ultraClick);
            } else {
                const rounds = Number(sessionStorage.getItem(STATE.COOKIE_ROUNDS) || 0) + 1;
                sessionStorage.setItem(STATE.COOKIE_ROUNDS, rounds);

                setTimeout(() => {
                    document.querySelector('a[href="dashboard.php"]')?.click();
                }, 1000);
            }
        }

        requestAnimationFrame(ultraClick);
    }

    if (path.includes('mystery_box.php')) {
        const interval = setInterval(() => {
            const btn = [...document.querySelectorAll('button')]
                .find(b => b.textContent.includes('Open Mystery Box'));
            if (btn && !btn.disabled) btn.click();

            const limit = [...document.querySelectorAll('p')]
                .some(p => p.textContent.includes('daily Mystery Box limit'));

            if (limit) {
                clearInterval(interval);
                sessionStorage.setItem(STATE.MYSTERY_DONE, 'true');
                document.querySelector('a[href="dashboard.php"]')?.click();
            }
        }, 1000);
    }

    if (path.includes('spin_wheel.php')) {
        let spins = Number(sessionStorage.getItem(STATE.SPIN_COUNT) || 0);
        const MAX_SPINS = 5;

        const interval = setInterval(() => {
            const btn = document.getElementById('spinButton');
            if (!btn) return;

            if (!btn.disabled) {
                btn.click();
            } else {
                spins++;
                sessionStorage.setItem(STATE.SPIN_COUNT, spins);

                if (spins >= MAX_SPINS) {
                    clearInterval(interval);
                    sessionStorage.setItem(STATE.SPIN_DONE, 'true');
                    document.querySelector('a[href="dashboard.php"]')?.click();
                }
            }
        }, 5000);
    }

})();
