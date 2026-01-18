// ==UserScript==
// @name         bitfaucet Detect Captcha & Click Reward
// @namespace    http://violentmonkey.net/
// @version      1.2
// @author       pcayb96
// @description  Deteksi captcha sukses lalu klik Get Reward
// @match        https://bitfaucet.net/faucet/currency/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563068/bitfaucet%20Detect%20Captcha%20%20Click%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/563068/bitfaucet%20Detect%20Captcha%20%20Click%20Reward.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CURRENT_URL = window.location.href;

    /* ===============================
       1️⃣ AUTO KEMBALI JIKA MASUK /currency/
       =============================== */
    if (
        CURRENT_URL === 'https://bitfaucet.net/faucet/currency/' ||
        CURRENT_URL === 'https://bitfaucet.net/faucet/currency'
    ) {
        console.log('[VM] Masuk halaman currency → kembali ke halaman sebelumnya');
        setTimeout(() => {
            window.history.back();
        }, 1500);
        return;
    }

    /* ===============================
       2️⃣ DETEKSI CAPTCHA SUKSES
       =============================== */
    function captchaSolved() {
        const btn = [...document.querySelectorAll('button')]
            .find(b => b.innerText?.includes('Get Reward'));

        if (btn && !btn.disabled && !btn.classList.contains('disabled')) {
            return true;
        }

        const captchaToken =
            document.querySelector('[name="h-captcha-response"]') ||
            document.querySelector('[name="g-recaptcha-response"]');

        return captchaToken && captchaToken.value.length > 0;
    }

    /* ===============================
       3️⃣ AUTO KLIK GET REWARD TIAP 12 DETIK
       =============================== */
    setInterval(() => {
        if (!captchaSolved()) return;

        const btn = [...document.querySelectorAll('button')]
            .find(b => b.innerText?.includes('Get Reward'));

        if (btn && !btn.disabled) {
            console.log('[VM] Captcha OK → klik Get Reward');
            btn.click();
        }
    }, 12000);

})();