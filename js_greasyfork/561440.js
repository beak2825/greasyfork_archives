// ==UserScript==
// @name         Faucet Flow – Verify Natural + Continue Spam
// @namespace    litecoinrewards-flow-natural-spam
// @version      2.6
// @match        https://litecoinrewards.click/*
// @run-at       document-idle
// @grant        none
// @description Auto-click Verify with human-like behavior + scroll before click, retry on incorrect click, and auto-continue after cooldown on litecoinrewards.click
// @downloadURL https://update.greasyfork.org/scripts/561440/Faucet%20Flow%20%E2%80%93%20Verify%20Natural%20%2B%20Continue%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/561440/Faucet%20Flow%20%E2%80%93%20Verify%20Natural%20%2B%20Continue%20Spam.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let verifyBusy = false;

    /* ========= VISIBILITY HELPER ========= */
    function isVisible(el) {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    /* ========= NATURAL CLICK ========= */
    function naturalClick(el) {
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });

        const r = el.getBoundingClientRect();
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = r.left + r.width * (0.3 + Math.random() * 0.4);
        const endY = r.top + r.height * (0.3 + Math.random() * 0.4);

        let step = 0;
        const steps = 12 + Math.floor(Math.random() * 6);

        const move = setInterval(() => {
            const x = startX + (endX - startX) * (step / steps);
            const y = startY + (endY - startY) * (step / steps);

            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }));

            step++;
            if (step > steps) {
                clearInterval(move);

                el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: endX, clientY: endY }));
                setTimeout(() => {
                    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: endX, clientY: endY }));
                    el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: endX, clientY: endY }));
                }, 80 + Math.random() * 120);
            }
        }, 18 + Math.random() * 22);
    }

    /* ========= VERIFY (NATURAL + RETRY) ========= */
    function tryVerify() {
        if (verifyBusy) return;

        const verifyBtn = document.querySelector('button[type="submit"][title="Verify"]');
        if (!isVisible(verifyBtn)) return;

        verifyBusy = true;
        console.log('🖱 Verify clicked (natural)');

        naturalClick(verifyBtn);

        setTimeout(() => {
            verifyBusy = false;
        }, 1500);
    }

    /* ========= ZERO ALERT ========= */
    const originalAlert = window.alert;
    window.alert = function(msg) {
        if (typeof msg === 'string' && msg.includes('Please move your mouse inside')) {
            console.log('⚠️ Suppressed alert');
            return;
        }
        return originalAlert.apply(this, arguments);
    };

    /* ========= CONTINUE SPAM TIAP 3 DETIK ========= */
    setInterval(() => {
        const contBtn = document.querySelector('#earnBtn.btn-back');
        if (contBtn && isVisible(contBtn)) {
            console.log('⏳ Continue clicked (spam 3s)');
            naturalClick(contBtn);
        }
    }, 3000);

    /* ========= OBSERVER UNTUK VERIFY ========= */
    const observer = new MutationObserver(() => tryVerify());
    observer.observe(document.body, { childList: true, subtree: true });

})();
