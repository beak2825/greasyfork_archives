// ==UserScript==
// @name         Cartel Empire - Blackjack Easy Stand
// @namespace    blackjack
// @description  Enlarges Deal and Stand, hides the other buttons, removes the Continue step from Blackjack in Cartel Empire
// @version      0.1
// @match        https://cartelempire.online/Casino/Blackjack
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560640/Cartel%20Empire%20-%20Blackjack%20Easy%20Stand.user.js
// @updateURL https://update.greasyfork.org/scripts/560640/Cartel%20Empire%20-%20Blackjack%20Easy%20Stand.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEEP = ['#deal', '#stand'];

    /* -----------------------------
       1. Disable client-side lockouts
    ------------------------------ */
    if (window.disableButton) {
        window.disableButton = function () {};
    }

    /* -----------------------------
       2. Force-enable Deal / Stand
    ------------------------------ */
    function forceEnable() {
        KEEP.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.disabled = false;
        });
    }

    /* -----------------------------
       3. Skip Continue entirely
    ------------------------------ */
    if (window.enableContinueIfGameFinished) {
        window.enableContinueIfGameFinished = function (game) {
            if (game?.result && game.result !== 'None') {
                clearBoard();
                enableDeal();
                applyUI();
            }
        };
    }

    if (window.socket?.on) {
        socket.on('gameEnded', () => {
            clearBoard();
            enableDeal();
            applyUI();
        });
    }

    /* -----------------------------
       4. UI helpers
    ------------------------------ */
    function hideOthers() {
        document.querySelectorAll('button').forEach(btn => {
            if (!KEEP.some(sel => btn.matches(sel))) {
                btn.style.display = 'none';
            }
        });
    }

    function fullscreenDealStand() {
        KEEP.forEach(sel => {
            const btn = document.querySelector(sel);
            if (!btn) return;

            btn.disabled = false;
            btn.style.width = '100%';
            btn.style.height = '50vh';
            btn.style.fontSize = '4rem';
            btn.style.borderRadius = '0';
            btn.style.margin = '0';
        });
    }

    function applyUI() {
        forceEnable();
        hideOthers();
        fullscreenDealStand();
    }

    /* -----------------------------
       5. MutationObserver on game UI
    ------------------------------ */
    function attachObserver() {
        const target = document.querySelector('#blackjackCardGroup');
        if (!target) {
            // Wait until it exists
            setTimeout(attachObserver, 250);
            return;
        }

        const observer = new MutationObserver(() => {
            applyUI();
        });

        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        console.log('Blackjack observer attached');
        applyUI();
    }

    attachObserver();
})();
