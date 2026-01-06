// ==UserScript==
// @name         Faucet Flow – Verify Natural + Continue Spam (ANTI STUCK 100%)
// @namespace    litecoinrewards-flow-anti-stuck
// @version      2.7
// @match        https://litecoinrewards.click/*
// @run-at       document-idle
// @grant        none
// @description Auto-click Verify with human-like behavior + scroll before click, retry on incorrect click, and auto-continue after cooldown on litecoinrewards.click
// @downloadURL https://update.greasyfork.org/scripts/561440/Faucet%20Flow%20%E2%80%93%20Verify%20Natural%20%2B%20Continue%20Spam%20%28ANTI%20STUCK%20100%25%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561440/Faucet%20Flow%20%E2%80%93%20Verify%20Natural%20%2B%20Continue%20Spam%20%28ANTI%20STUCK%20100%25%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let verifyBusy = false;
    let lastVerify = 0;
    let stuckCounter = 0;

    /* ========= HELPER ========= */
    function isVisible(el) {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 10 && r.height > 10;
    }

    /* ========= NATURAL CLICK ========= */
    function naturalClick(el) {
        if (!el) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });

        const r = el.getBoundingClientRect();
        const endX = r.left + r.width * (0.3 + Math.random() * 0.4);
        const endY = r.top + r.height * (0.3 + Math.random() * 0.4);

        document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: endX - 20, clientY: endY - 20 }));
        setTimeout(() => {
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: endX, clientY: endY }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: endX, clientY: endY }));
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: endX, clientY: endY }));
        }, 120 + Math.random() * 200);
    }

    /* ========= HARD ALERT BLOCK ========= */
    ['alert','confirm','prompt'].forEach(fn => window[fn] = () => true);
    if (window.Swal) Swal.fire = () => Promise.resolve();
    if (window.swal) window.swal = () => Promise.resolve();

    setInterval(() => {
        document.querySelectorAll('.modal, .swal2-container').forEach(m => {
            if ((m.innerText || '').toLowerCase().includes('move your mouse')) {
                m.remove();
            }
        });
    }, 500);

    /* ========= VERIFY LOOP ========= */
    function tryVerify() {
        const now = Date.now();
        if (verifyBusy) return;
        if (now - lastVerify < 3500) return;

        const verifyBtn = document.querySelector('button[type="submit"][title="Verify"]');
        if (!isVisible(verifyBtn)) return;

        verifyBusy = true;
        lastVerify = now;
        stuckCounter++;

        console.log(`🖱 Verify attempt #${stuckCounter}`);
        naturalClick(verifyBtn);

        setTimeout(() => {
            verifyBusy = false;
        }, 2000);
    }

    /* ========= CONTINUE LOOP ========= */
    setInterval(() => {
        const contBtn = document.querySelector('#earnBtn.btn-back');
        if (isVisible(contBtn)) {
            console.log('➡️ Continue clicked');
            stuckCounter = 0;
            naturalClick(contBtn);
        }
    }, 3000);

    /* ========= FAILSAFE ========= */
    setInterval(() => {
        const verifyBtn = document.querySelector('button[type="submit"][title="Verify"]');
        const contBtn = document.querySelector('#earnBtn.btn-back');

        // DEADLOCK: verify masih ada, continue tidak muncul
        if (verifyBtn && !contBtn && stuckCounter >= 6) {
            console.log('🔄 Deadlock detected → Reload');
            location.reload();
        }
    }, 8000);

    /* ========= OBSERVER ========= */
    new MutationObserver(() => tryVerify())
        .observe(document.body, { childList: true, subtree: true });

})();
