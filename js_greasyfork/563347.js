// ==UserScript==
// @name        FreeLTC Auto Faucet
// @namespace   https://tampermonkey.net/
// @version     0.6
// @description Faucet automation
// @author      Shnethan
// @match       https://freeltc.online/*
// @icon        https://freeltc.online/assets/images/favicon.ico
// @license     GPL-3.0-or-later
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/563347/FreeLTC%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563347/FreeLTC%20Auto%20Faucet.meta.js
// ==/UserScript==


(() => {
    let d;

    const k = () =>
        document.querySelector('.anticap-info-label')?.textContent.trim() === 'Success!' &&
        ![...document.querySelectorAll('.antibotlinks a')]
            .some(e => getComputedStyle(e).display !== 'none');

    const r = () => {
        if (d || !k()) return;

        const b = document.querySelector('.claim-button');
        if (!b || b.disabled) return;

        d = 1;
        b.click();
        o.disconnect();
    };

    const o = new MutationObserver(r);
    o.observe(document.body, { childList: 1, subtree: 1, attributes: 1 });

    r();
})();
