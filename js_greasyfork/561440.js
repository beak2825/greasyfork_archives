// ==UserScript==
// @name         Faucet Flow – Instant Verify + Retry + Continue (Human Click)
// @name:en      Faucet Flow – Instant Verify + Retry + Continue (Human Click)
// @namespace    https://greasyfork.org/en/users/1555740-inisaya-belze
// @version      2.4-scroll
// @description Auto-click Verify with human-like behavior + scroll before click, retry on incorrect click, and auto-continue after cooldown on litecoinrewards.click
// @match        https://litecoinrewards.click/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561440/Faucet%20Flow%20%E2%80%93%20Instant%20Verify%20%2B%20Retry%20%2B%20Continue%20%28Human%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561440/Faucet%20Flow%20%E2%80%93%20Instant%20Verify%20%2B%20Retry%20%2B%20Continue%20%28Human%20Click%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let verifyBusy = false;
    let continueClicked = false;

    /* ========= SCROLL HELPER ========= */
    function scrollToElement(el) {
        if (!el) return;
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    /* ========= HUMAN CLICK HELPER ========= */
    function humanClick(btn) {
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;

        btn.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: x,
            clientY: y
        }));

        setTimeout(() => {
            btn.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
                clientX: x,
                clientY: y
            }));

            setTimeout(() => {
                btn.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    clientX: x,
                    clientY: y
                }));
            }, 50 + Math.random() * 120);
        }, 50 + Math.random() * 150);
    }

    /* ========= VERIFY ========= */
    function tryVerify() {
        if (verifyBusy) return;

        const verifyBtn = document.querySelector(
            'button[type="submit"][title="Verify"]'
        );
        if (!verifyBtn) return;

        const rect = verifyBtn.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        verifyBusy = true;

        // ✅ SCROLL DULU KE VERIFY
        scrollToElement(verifyBtn);

        // ⏳ TUNGGU SCROLL → BARU KLIK
        setTimeout(() => {
            humanClick(verifyBtn);
        }, 600 + Math.random() * 400);

        setTimeout(() => {
            verifyBusy = false;
        }, 1500);
    }

    /* ========= ALERT DETECTOR ========= */
    const originalAlert = window.alert;
    window.alert = function (msg) {
        if (typeof msg === 'string' && msg.includes('Incorrect')) {
            setTimeout(tryVerify, 1000);
        }
        return originalAlert.apply(this, arguments);
    };

    /* ========= OBSERVE VERIFY ========= */
    const verifyObserver = new MutationObserver(tryVerify);
    verifyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    /* ========= CONTINUE ========= */
    const continueObserver = new MutationObserver(() => {
        if (continueClicked) return;

        const contBtn = document.querySelector('#earnBtn.btn-back');
        if (!contBtn) return;

        const rect = contBtn.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        continueClicked = true;
        continueObserver.disconnect();

        setTimeout(() => {
            if (!document.contains(contBtn)) return;
            humanClick(contBtn);
        }, 3000);
    });

    continueObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
