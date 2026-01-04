// ==UserScript==
// @name            Global Backspace Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent double backspace on any site
// @match        *://*/*
// @author      emree.el
// @license    MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551915/Global%20Backspace%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/551915/Global%20Backspace%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(e) {
        const target = e.target;
        if (e.key === 'Backspace' && (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
            e.stopImmediatePropagation(); // stop the site from double-counting
            // default browser behavior still works
        }
    }, true); // capture phase
})();
