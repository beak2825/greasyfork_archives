// ==UserScript==
// @name         FaucetCrypto Auto Flow
// @namespace    https://faucetcrypto.com/
// @version      1.3
// @description  Detects faucet flow after captcha interaction
// @author       Rubystance
// @license      MIT
// @match        https://faucetcrypto.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559050/FaucetCrypto%20Auto%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/559050/FaucetCrypto%20Auto%20Flow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[FaucetFlow]', ...args);

    function isClickable(el) {
        if (!el) return false;
        if (el.disabled) return false;
        if (el.getAttribute('aria-disabled') === 'true') return false;
        return true;
    }

    function clickOnce(el, label) {
        if (!el || el.dataset.clicked) return false;
        if (!isClickable(el)) return false;

        el.dataset.clicked = 'true';
        el.click();
        log('Auto clicked:', label);
        return true;
    }

    function processFlow() {

        const readyBtn = document.querySelector(
            'a[href^="/dashboard/faucet-claim/view/"]'
        );
        clickOnce(readyBtn, 'Ready To Claim');

        const validateBtn = [...document.querySelectorAll('button')]
            .find(b => b.textContent.includes('Validate'));
        clickOnce(validateBtn, 'Validate Captcha');

        const rewardBtn = document.querySelector(
            'a[href^="/dashboard/faucet-claim/complete/"]'
        );
        clickOnce(rewardBtn, 'Get Reward');
    }

    const observer = new MutationObserver(() => {
        processFlow();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    log('Script running. Waiting for manual captcha and faucet availability.');
})();
