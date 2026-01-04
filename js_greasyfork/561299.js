// ==UserScript==
// @name         Dice Auto (ALL COIN – MIN BUTTON)
// @namespace    dice
// @version      3.0
// @description  Auto detect active coin → balance up → delay → MIN 1x → timer 8s → START AUTO (anti-macet)
// @match        https://faucetpay.io/dice*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561299/Dice%20Auto%20%28ALL%20COIN%20%E2%80%93%20MIN%20BUTTON%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561299/Dice%20Auto%20%28ALL%20COIN%20%E2%80%93%20MIN%20BUTTON%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ========== CONFIG ========== */
    const DELAY_BEFORE_MIN = 3000; // 3 detik
    const TIMER_SECONDS = 3;

    /* ========== STATE ========== */
    let lastBalance = null;
    let minClicked = false;
    let startClicked = false;
    let busy = false;

    /* ========== UTILS ========== */
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    /* Ambil balance coin AKTIF (yang tampil di dice) */
    const getActiveBalance = () => {
        const el = document.querySelector('.coinSelect_selectFront .coinSelect_balance span');
        if (!el) return null;
        const num = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
        return isNaN(num) ? null : num;
    };

    const getMinButton = () =>
        [...document.querySelectorAll('button')]
            .find(b => b.textContent.trim().toLowerCase() === 'min');

    const getStartAutoButton = () =>
        [...document.querySelectorAll('button')]
            .find(b => b.textContent.trim() === 'START AUTO');

    const realClick = el => {
        ['mousedown', 'mouseup', 'click'].forEach(e =>
            el.dispatchEvent(new MouseEvent(e, { bubbles: true }))
        );
    };

    /* ========== OVERLAY TIMER ========== */
    const showTimer = async sec => {
        let box = document.getElementById('fp-auto-timer');
        if (!box) {
            box = document.createElement('div');
            box.id = 'fp-auto-timer';
            box.style = `
                position: fixed;
                top: 15px;
                right: 15px;
                background: #111;
                color: #00ff88;
                padding: 10px 14px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 14px;
                z-index: 99999;
            `;
            document.body.appendChild(box);
        }

        for (let i = sec; i > 0; i--) {
            box.textContent = `START AUTO in ${i}s`;
            await sleep(1000);
        }
        box.remove();
    };

    /* ========== MAIN LOOP ========== */
    const main = async () => {
        if (busy) return;

        const balance = getActiveBalance();
        const minBtn = getMinButton();
        const startBtn = getStartAutoButton();

        if (balance === null || !minBtn || !startBtn) return;

        /* Init balance */
        if (lastBalance === null) {
            lastBalance = balance;
            return;
        }

        /* Reset siklus saat START AUTO muncul lagi */
        if (startBtn.textContent === 'START AUTO' && startClicked) {
            minClicked = false;
            startClicked = false;
        }

        /* Balance naik → jalankan siklus */
        if (balance > lastBalance && !startClicked) {
            busy = true;
            lastBalance = balance;

            /* Delay 3 detik */
            await sleep(DELAY_BEFORE_MIN);

            /* Klik MIN 1x */
            if (!minClicked && !minBtn.disabled) {
                realClick(minBtn);
                minClicked = true;
            }

            /* Timer overlay 8 detik */
            await showTimer(TIMER_SECONDS);

            /* Klik START AUTO */
            if (
                startBtn.textContent === 'START AUTO' &&
                !startBtn.disabled
            ) {
                realClick(startBtn);
                startClicked = true;
            }

            busy = false;
        }
    };

    setInterval(main, 1000);
})();
