// ==UserScript==
// @name         Feyorra Shortlinks Auto Visit (Skip Rsshort)
// @namespace    https://violentmonkey.github.io/
// @version      1.1
// @author       pcayb96
// @description  Auto Visit Feyorra (Rsshort diabaikan) + auto dashboard
// @match        https://feyorra.site/member/shortlinks*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563556/Feyorra%20Shortlinks%20Auto%20Visit%20%28Skip%20Rsshort%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563556/Feyorra%20Shortlinks%20Auto%20Visit%20%28Skip%20Rsshort%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const RANDOM_MIN = 2000; // 2 detik
    const RANDOM_MAX = 5000; // 5 detik
    const EXTRA_CLICK_DELAY = 5000; // jeda WAJIB 5 detik tiap klik
    const DASHBOARD_URL = 'https://feyorra.site/member/dashboard';

    function randomDelay() {
        return RANDOM_MIN + Math.floor(Math.random() * (RANDOM_MAX - RANDOM_MIN + 1));
    }

    function getAllVisitButtons() {
        return Array.from(document.querySelectorAll('.visit-btn'));
    }

    function isRsshort(btn) {
        const title = btn.closest('.glass')
            ?.querySelector('h3')
            ?.innerText.toLowerCase() || '';
        return title.includes('rsshort');
    }

    function getNextButton() {
        for (const btn of getAllVisitButtons()) {
            const left = parseInt(btn.dataset.viewsLeft || '0', 10);
            if (isRsshort(btn)) continue;
            if (left > 0 && !btn.disabled) return btn;
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

        console.log(`🚀 Klik Visit: ${name} | Sisa: ${btn.dataset.viewsLeft}`);
        btn.click();

        // ⏳ jeda WAJIB 5 detik + delay acak
        const totalDelay = EXTRA_CLICK_DELAY + randomDelay();
        console.log(`⏱️ Tunggu ${(totalDelay / 1000).toFixed(1)} detik sebelum klik berikutnya`);

        setTimeout(runNext, totalDelay);
    }

    window.addEventListener('load', () => {
        console.log('▶ Auto Visit Feyorra aktif (delay 5 detik + acak, Rsshort di-skip)');
        setTimeout(runNext, randomDelay());
    });

})();