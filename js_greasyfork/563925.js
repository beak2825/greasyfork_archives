// ==UserScript==
// @name         CryptoUkr Faucet
// @namespace    CryptoUkr Auto faucet claim
// @version      1.6
// @description  Faucet automation
// @author       Shnethan
// @match        *://cryptoukr.*/*
// @icon         https://cryptoukr.in.ua/assets/images/favicon.ico
// @license      GPL-3.0-or-later
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563925/CryptoUkr%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563925/CryptoUkr%20Faucet.meta.js
// ==/UserScript==

(function() {
    let f = false, w = false, a = false;

    const c = (e, d = 0) => {
        e.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => e.click(), d);
    };

    setInterval(() => {
        const p = location.pathname;

        if (p.startsWith('/dashboard')) return location.href = '/faucet';

        if (!f && p.startsWith('/faucet')) {
            const b = document.querySelector('#antibotlinks')?.value.trim();
            const r = document.querySelector('#g-recaptcha-response')?.value.trim();
            const t = document.querySelector('button.claim-button:not([disabled]), #claim-now');
            if (b && r && t) { f = true; c(t, 2000); }
        }

        if (!w && p.startsWith('/firewall')) {
            const r = document.querySelector('#g-recaptcha-response')?.value.trim();
            const t = document.querySelector('button.btn.btn-primary.w-md[type="submit"]');
            if (r && t?.offsetParent && !t.disabled) { w = true; c(t, 500); }
        }

        if (!a) {
            const t = document.querySelector('button.fc-rewarded-ad-button');
            if (t?.offsetParent && !t.disabled) { a = true; c(t, 600); }
        }
    }, 800);
})();
