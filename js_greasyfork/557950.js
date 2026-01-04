// ==UserScript==
// @name         AsiaFlix - Ignore New Tab Openings
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  On asiaflix.net, ignore clicks that would open in a new tab/window
// @author       r_hiland
// @match        *://asiaflix.net/*
// @match        *://www.asiaflix.net/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557950/AsiaFlix%20-%20Ignore%20New%20Tab%20Openings.user.js
// @updateURL https://update.greasyfork.org/scripts/557950/AsiaFlix%20-%20Ignore%20New%20Tab%20Openings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1) Hijack window.open so it does NOT create a real new tab/window ---
    (function () {
        const originalOpen = window.open;

        function fakeOpen(url, target, features) {
            const t = (target || '').toLowerCase().trim();

            // If explicitly opening in _self, let it behave normally (same tab navigation)
            if (t === '_self') {
                return originalOpen.call(window, url, target, features);
            }

            // For all other targets (including default), pretend we opened a new tab/window
            // but actually DO NOTHING.
            console.log('[AsiaFlix userscript] Blocked window.open:', url, target || '(default)');

            // Return a fake window-like object so ad scripts think it worked
            const fakeWin = {
                closed: false,
                close() {
                    this.closed = true;
                },
                focus() {},
                blur() {},
                // Minimal location stub; some scripts might poke at this
                location: {
                    href: url || '',
                },
            };

            return fakeWin;
        }

        // Replace window.open
        window.open = fakeOpen;

        // Try to make it harder for site scripts to overwrite it
        try {
            Object.defineProperty(window, 'open', {
                value: fakeOpen,
                writable: false,
                configurable: false,
            });
        } catch (e) {
            // If this fails, we still replaced window.open above
        }
    })();

    // --- 2) Stop target="_blank" links from opening new tabs, but keep page handlers running ---
    function blockNewTabDefault(e) {
        if (!e.target || !e.target.closest) return;

        const link = e.target.closest('a');
        if (!link) return;

        const t = (link.target || '').toLowerCase().trim();

        // Only touch links that explicitly want a new tab
        if (t === '_blank') {
            // Prevent the browser's default "open in new tab" behavior
            e.preventDefault();
            // DO NOT stopPropagation:
            // - site click handlers still run
            // - overlay can still hide/remove itself
            console.log('[AsiaFlix userscript] Prevented new tab for link:', link.href);
        }
    }

    // Use bubble phase so site’s own listeners see the event first or alongside us.
    // Default action happens after all listeners, so preventDefault() here is enough to block new tab.
    window.addEventListener('click', blockNewTabDefault, false);
    window.addEventListener('auxclick', blockNewTabDefault, false); // middle-click, etc.
})();
