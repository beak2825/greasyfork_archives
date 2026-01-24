// ==UserScript==
// @name         Hatecoin Faucet
// @namespace    Hatecoin Auto Faucet Claim
// @version      0.8
// @description  Faucet Automation
// @author       Shnethan
// @match        https://hatecoin.me/*
// @icon         https://hatecoin.me/assets/images/users/user.png
// @license      GPL-3.0-or-later
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/563926/Hatecoin%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563926/Hatecoin%20Faucet.meta.js
// ==/UserScript==

(() => {

    let d = 1800, f = false;

    const c = () => {
        if (!f && !document.querySelector('.antibotlinks a:not([style*="display: none"])') && document.querySelector('textarea[name="h-captcha-response"]')?.value)
            f = true, setTimeout(() => { document.querySelector('.claim-button')?.click(); o.disconnect() }, d);
    };

    const o = new MutationObserver(c);

    o.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['style','value'] });

    c();

})();
