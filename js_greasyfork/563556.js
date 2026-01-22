// ==UserScript==
// @name         Feyorra Shortlinks Auto Visit (Skip Rsshort)
// @namespace    https://violentmonkey.github.io/
// @version      1
// @author       pcayb96
// @description  Auto Visit Feyorra (Rsshort diabaikan) + auto dashboard
// @match        https://feyorra.site/member/shortlinks*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563556/Feyorra%20Shortlinks%20Auto%20Visit%20%28Skip%20Rsshort%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563556/Feyorra%20Shortlinks%20Auto%20Visit%20%28Skip%20Rsshort%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MIN_DELAY = 2000; // 2 detik
    const MAX_DELAY = 5000; // 5 detik
    const DASHBOARD_URL = 'https://feyorra.site/member/dashboard';

    function randomDelay() {
        return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1));
    }

    function getAllVisitButtons() {
        return Array.from(document.querySelectorAll('.visit-btn'));
    }

    function isRsshort(btn) {
        const card = btn.closest('.glass');
        const title = card?.querySelector('h3')?.innerText.toLowerCase() || '';
        return title.includes('rsshort');
    }

    function getNextButton() {
        const buttons = getAllVisitButtons();

        for (const btn of buttons) {
            const left = parseInt(btn.dataset.viewsLeft || '0', 10);

            // 👉 abaikan Rsshort
            if (isRsshort(btn)) continue;

            if (left > 0 && !btn.disabled) {
                return btn;
            }
        }
        return null;
    }

    function goToDashboard() {
        console.log('🏁 Semua shortlink (kecuali Rsshort) selesai');
        setTimeout(() => {
            window.location.href = DASHBOARD_URL;
        }, randomDelay());
    }

    function runNext() {
        const btn = getNextButton();

        if (!btn) {
            goToDashboard();
            return;
        }

        const card = btn.closest('.glass');
        const name = card?.querySelector('h3')?.innerText.trim() || 'Unknown';

        console.log(`🚀 Visit: ${name} | Sisa: ${btn.dataset.viewsLeft}`);

        btn.click();

        setTimeout(runNext, randomDelay());
    }

    window.addEventListener('load', () => {
        console.log('▶ Auto Visit Feyorra aktif (Rsshort di-skip)');
        setTimeout(runNext, randomDelay());
    });

})();
