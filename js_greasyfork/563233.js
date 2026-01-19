// ==UserScript==
// @name         Gamerlee Auto Collect + Anti-Bot
// @namespace    http://violentmonkey.net/
// @version      1.1
// @author       pcayb96
// @description  Auto klik Collect your reward tiap 12 detik + human-like behavior
// @match        https://gamerlee.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563233/Gamerlee%20Auto%20Collect%20%2B%20Anti-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/563233/Gamerlee%20Auto%20Collect%20%2B%20Anti-Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[VM] Gamerlee Auto Collect + Anti-Bot aktif');

    /* ===============================
       1?? DETEKSI CAPTCHA SUKSES
       =============================== */
    function isCaptchaSolved() {
        const btn = document.querySelector('button.claim-button.step4');
        if (!btn) return false;

        if (!btn.disabled && !btn.classList.contains('disabled')) {
            return true;
        }

        // fallback token Cloudflare Turnstile
        const turnstileToken =
            document.querySelector('input[name="cf-turnstile-response"]') ||
            document.querySelector('textarea[name="cf-turnstile-response"]');

        return !!(turnstileToken && turnstileToken.value.length > 0);
    }

    /* ===============================
       2?? AUTO CLICK COLLECT (12 DETIK)
       =============================== */
    setInterval(() => {
        const btn = document.querySelector('button.claim-button.step4');
        if (!btn) return;

        if (isCaptchaSolved()) {
            console.log('[VM] Captcha OK ? klik Collect your reward');

            // scroll ke tombol dulu (lebih natural)
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                btn.click();
            }, 800 + Math.random() * 1200);

        } else {
            console.log('[VM] Menunggu captcha / tombol aktif');
        }
    }, 12000);

    /* ===============================
       3?? ANTI-BOT (HUMAN BEHAVIOR)
       =============================== */

    // fake mouse move
    function fakeMouseMove() {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);

        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            })
        );
    }

    // fake scroll
    function fakeScroll() {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        window.scrollTo({
            top: Math.floor(Math.random() * maxScroll),
            behavior: 'smooth'
        });
    }

    // loop human-like (acak & ringan)
    function humanLoop() {
        fakeMouseMove();

        if (Math.random() > 0.5) {
            fakeScroll();
        }

        setTimeout(humanLoop, 2000 + Math.random() * 4000);
    }

    humanLoop();

})();
