// ==UserScript==
// @name         Marumori Flip Buttons Auto Toggle
// @namespace    https://marumori.io/
// @version      1.2
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

    /* ---------------- ROUTER STATE ---------------- */

    let activeController = null;
    let lastUrl = location.href;

    /* ---------------- GUARDS ---------------- */

    function isGrammarPage(url = location.href) {
        return url.toLowerCase().includes('grammar');
    }

    function getPageType(url = location.href) {
        if (url.includes('/study-lists/review')) return 'review';
        if (url.includes('/study-lists/lesson')) return 'lesson';
        return null;
    }

    /* ---------------- CONTROLLER ---------------- */

    function createFlipController(pageType) {
        let applied = false;
        let interval = null;
        let observer = null;

        function destroy() {
            applied = false;
            if (interval) clearInterval(interval);
            if (observer) observer.disconnect();
            interval = observer = null;
        }

        function desiredState() {
            return pageType === 'review';
        }

        function tryApply() {
            if (applied) return;

            const settingsBtn = document.querySelector('button.icon-btn.settings.desktop');
            if (!settingsBtn) return;

            settingsBtn.click();

            observer = new MutationObserver(() => {
                const checkbox = document.getElementById('Flip-Buttons Mode');
                if (!checkbox) return;

                const wrapper = checkbox.closest('.checkbox-wrapper');
                const toggleBtn = wrapper?.querySelector('button.checkmark');

                if (toggleBtn && checkbox.checked !== desiredState()) {
                    toggleBtn.click();
                }

                settingsBtn.click();
                applied = true;
                destroy();
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        interval = setInterval(tryApply, 300);
        tryApply();

        return { destroy };
    }

    /* ---------------- ROUTER ---------------- */

    function route(url) {
        // 🔒 Absolute first check
        if (isGrammarPage(url)) {
            if (activeController) {
                activeController.destroy();
                activeController = null;
            }
            return;
        }

        const type = getPageType(url);
        if (!type) return;

        if (activeController) {
            activeController.destroy();
            activeController = null;
        }

        activeController = createFlipController(type);
    }

    /* ---------------- SPA URL WATCHER ---------------- */

    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            route(lastUrl);
        }
    }, 300);

    // Initial route
    route(location.href);

})();
