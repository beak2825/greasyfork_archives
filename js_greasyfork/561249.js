// ==UserScript==
// @name         Marumori Flip Buttons Auto Toggle
// @namespace    https://marumori.io/
// @version      1.0
// @description  Automatically toggles (once) to Flip Button Mode during Reviews and to input mode during Lessons
// @match        https://marumori.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/561249/Marumori%20Flip%20Buttons%20Auto%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/561249/Marumori%20Flip%20Buttons%20Auto%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastPageType = null;
    let applied = false;
    let lastUrl = location.href;
    let interval = null;

    function getPageType() {
        if (location.pathname.includes('/study-lists/review')) return 'review';
        if (location.pathname.includes('/study-lists/lesson')) return 'lesson';
        return null;
    }

    function desiredState(type) {
        return type === 'review';
    }

    function tryApplyFlipMode() {
        if (applied) return;

        const type = getPageType();
        if (!type) return;

        const settingsBtn = document.querySelector('button.icon-btn.settings.desktop');
        if (!settingsBtn) return; // lesson UI not mounted yet

        settingsBtn.click();

        const observer = new MutationObserver(() => {
            const checkbox = document.getElementById('Flip-Buttons Mode');
            if (!checkbox) return;

            const wrapper = checkbox.closest('.checkbox-wrapper');
            const toggleBtn = wrapper?.querySelector('button.checkmark');

            if (toggleBtn && checkbox.checked !== desiredState(type)) {
                toggleBtn.click();
            }

            settingsBtn.click(); // close menu
            applied = true;

            observer.disconnect();
            clearInterval(interval);
            interval = null;
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function resetAndStart() {
        applied = false;
        if (interval) clearInterval(interval);

        interval = setInterval(tryApplyFlipMode, 300);
        tryApplyFlipMode(); // immediate attempt
    }

    // SPA URL watcher
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            const type = getPageType();
            if (type !== lastPageType) {
                lastPageType = type;
                resetAndStart();
            }
        }
    }, 300);

    // Initial run
    lastPageType = getPageType();
    resetAndStart();
})();
