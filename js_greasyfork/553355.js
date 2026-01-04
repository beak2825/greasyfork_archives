// ==UserScript==
// @name         Finanzen.net > Auto-select Rubriken on URL change
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically selects "Rubriken" option whenever on /uebersicht
// @match        *://mein.finanzen-zero.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553355/Finanzennet%20%3E%20Auto-select%20Rubriken%20on%20URL%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/553355/Finanzennet%20%3E%20Auto-select%20Rubriken%20on%20URL%20change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_PATH = '/uebersicht';
    const TARGET_VALUE = 'CATEGORIES';

    function selectRubriken() {
        const select = document.querySelector('select[data-zid="position-filter"]');
        if (select && select.value !== TARGET_VALUE) {
            select.value = TARGET_VALUE;
            // Fire both events to trigger Angular’s change detection
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[AutoRubriken] Rubriken option selected');
            return true;
        }
        return false;
    }

    function trySelectRepeatedly(maxAttempts = 30, interval = 300) {
        let attempts = 0;
        const timer = setInterval(() => {
            if (location.pathname !== TARGET_PATH) {
                clearInterval(timer);
                return;
            }
            if (selectRubriken()) {
                clearInterval(timer);
            }
            if (++attempts >= maxAttempts) {
                clearInterval(timer);
                console.log('[AutoRubriken] Gave up after 30 tries');
            }
        }, interval);
    }

    function onUrlChange() {
        if (location.pathname === TARGET_PATH) {
            console.log('[AutoRubriken] Detected /uebersicht – trying to select...');
            trySelectRepeatedly();
        }
    }

    // Intercept SPA navigation
    const pushState = history.pushState;
    history.pushState = function(...args) {
        pushState.apply(this, args);
        onUrlChange();
    };
    const replaceState = history.replaceState;
    history.replaceState = function(...args) {
        replaceState.apply(this, args);
        onUrlChange();
    };
    window.addEventListener('popstate', onUrlChange);

    // Initial run
    onUrlChange();
})();
