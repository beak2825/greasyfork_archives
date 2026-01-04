// ==UserScript==
// @name        Forced Visibility
// @author      d3ad connection
// @match       https://*/*
// @match       http://*/*
// @include     *
// @description Try to prevent websites from detecting tab focus without breaking functionality
// @version 0.0.1.20250925025908
// @namespace https://greasyfork.org/users/1519047
// @downloadURL https://update.greasyfork.org/scripts/550604/Forced%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/550604/Forced%20Visibility.meta.js
// ==/UserScript==


(function() {
    'use strict';
    try { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); } catch(e) {}
    try { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }); } catch(e) {}
    try { document.hasFocus = () => true; } catch(e) {}
    window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
})();
