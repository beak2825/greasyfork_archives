// ==UserScript==
// @name         Faucet Flow – Verify Natural + Continue Spam HP
// @namespace    https://litecoinrewards.click/
// @version      1.0
// @description  Script HP: klik Verify natural & spam Continue tiap 3 detik tanpa alert "Please move your mouse inside"
// @author       lotusme
// @match        https://litecoinrewards.click/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561478/Faucet%20Flow%20%E2%80%93%20Verify%20Natural%20%2B%20Continue%20Spam%20HP.user.js
// @updateURL https://update.greasyfork.org/scripts/561478/Faucet%20Flow%20%E2%80%93%20Verify%20Natural%20%2B%20Continue%20Spam%20HP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let verifyBusy = false;

    /* ========= VISIBILITY HELPER ========= */
    function isVisible(el) {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    /* ========= NATURAL TOUCH CLICK (HP) ========= */
    function naturalTouchClick(el) {
        if (!el) return;

        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;

        // scroll + focus (human-like)
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });

        // dispatch touch + click events
        ['touchstart', 'touchend', 'click'].forEach(evtName => {
            const evt = new Event(evtName, { bubbles: true, cancelable: true });
            el.dispatchEvent(evt);
        });
    }

    /* ========= VERIFY (NATURAL + RETRY) ========= */
    function tryVerify() {
        if (verifyBusy) return;

        const verifyBtn = document.querySelector('button[type="submit"][title="Verify"]');
        if (!verifyBtn || !isVisible(verifyBtn)) return;

        verifyBusy = true;
        console.log('🖱 Verify clicked (HP touch)');

        naturalTouchClick(verifyBtn);

        setTimeout(() => {
            verifyBusy = false;
        }, 1500); // lock untuk menghindari spam terlalu cepat
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
        const contBtn = document.querySelector('#slot3 #earnBtn.btn-back, #slot4 #earnBtn.btn-back');
        if (contBtn && isVisible(contBtn)) {
            console.log('⏳ Continue clicked (spam 3s)');
            naturalTouchClick(contBtn);
        }
    }, 3000);

    /* ========= OBSERVER UNTUK VERIFY ========= */
    const observer = new MutationObserver(() => tryVerify());
    observer.observe(document.body, { childList: true, subtree: true });

})();
