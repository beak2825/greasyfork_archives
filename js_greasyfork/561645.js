// ==UserScript==
// @name         ZeroBet Full Auto Cycle
// @namespace    https://zerobet.pro/
// @version      1.0
// @description  Login → Cookie → Mystery Box → Spin → Dashboard → STOP until next login
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

    const ALL_INTERVALS = [];
    const STATE = {
        COOKIE_DONE: 'ZB_COOKIE_DONE',
        MYSTERY_DONE: 'ZB_MYSTERY_DONE',
        SPIN_DONE: 'ZB_SPIN_DONE',
        SESSION_DONE: 'ZB_SESSION_DONE'
    };

    function setIntervalSafe(fn, ms) {
        const id = setInterval(fn, ms);
        ALL_INTERVALS.push(id);
        return id;
    }

    function stopEverything() {
        console.log('[ZeroBet] ✅ All steps completed. Script inactive until next login.');
        sessionStorage.setItem(STATE.SESSION_DONE, 'true');
        ALL_INTERVALS.forEach(clearInterval);
        ALL_INTERVALS.length = 0;
    }

    const path = location.pathname;

    if (
        sessionStorage.getItem(STATE.SESSION_DONE) === 'true' &&
        !path.includes('login.php')
    ) {
        return;
    }

    if (path.includes('login.php')) {
        Object.values(STATE).forEach(k => sessionStorage.removeItem(k));

        const WALLET_ADDRESS = 'YOUR_ZERO_COIN_WALLET_ADDRESS_HERE'; // << YOUR_ZERO_COIN_WALLET_ADDRESS

        setIntervalSafe(() => {
            const wallet = document.querySelector('input[name="wallet"]');
            const btn = document.querySelector('button[type="submit"]');
            if (!wallet || !btn) return;

            wallet.value = WALLET_ADDRESS;
            wallet.dispatchEvent(new Event('input', { bubbles: true }));
            btn.click();
        }, 800);
    }

    if (path.includes('dashboard.php')) {
        setIntervalSafe(() => {
            if (!sessionStorage.getItem(STATE.COOKIE_DONE)) {
                const c = document.querySelector('a[href="clicker.php"]');
                if (c) c.click();
                return;
            }

            if (!sessionStorage.getItem(STATE.MYSTERY_DONE)) {
                const m = document.querySelector('a[href="mystery_box.php"]');
                if (m) m.click();
                return;
            }

            if (!sessionStorage.getItem(STATE.SPIN_DONE)) {
                const s = document.querySelector('a[href="spin_wheel.php"]');
                if (s) s.click();
                return;
            }

            stopEverything();
        }, 800);
    }

    if (path.includes('clicker.php')) {
        let clicks = 0;
        const MAX_CLICKS = 301;

        setIntervalSafe(() => {
            const btn = document.getElementById('clickBtn');
            if (!btn) return;

            if (clicks < MAX_CLICKS) {
                btn.click();
                clicks++;
            }
        }, 5);

        setIntervalSafe(() => {
            const limitReached = [...document.querySelectorAll('p')]
                .some(p => p.textContent.includes('You used all your Cookie games today'));

            if (limitReached) {
                sessionStorage.setItem(STATE.COOKIE_DONE, 'true');
                const back = document.querySelector('a[href="dashboard.php"]');
                if (back) back.click();
            }
        }, 500);
    }

    if (path.includes('mystery_box.php')) {
        setIntervalSafe(() => {
            const openBtn = [...document.querySelectorAll('button')]
                .find(b => b.textContent.includes('Open Mystery Box'));

            if (openBtn && !openBtn.disabled) openBtn.click();
        }, 800);

        setIntervalSafe(() => {
            const limit = [...document.querySelectorAll('p')]
                .some(p => p.textContent.includes('daily Mystery Box limit'));

            if (limit) {
                sessionStorage.setItem(STATE.MYSTERY_DONE, 'true');
                const back = document.querySelector('a[href="dashboard.php"]');
                if (back) back.click();
            }
        }, 800);
    }

    if (path.includes('spin_wheel.php')) {
        setIntervalSafe(() => {
            const spinBtn = document.getElementById('spinButton');
            if (!spinBtn) return;

            if (!spinBtn.disabled) {
                spinBtn.click();
            } else {
                console.log('[ZeroBet] 🎯 Spin completed.');
                sessionStorage.setItem(STATE.SPIN_DONE, 'true');
                const back = document.querySelector('a[href="dashboard.php"]');
                if (back) back.click();
            }
        }, 800);
    }

})();
