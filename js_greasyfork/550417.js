// ==UserScript==
// @name         Websim Ungrayscale Social Icons (Main Page Only)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes grayscale filter from social icons on the main websim.com page only
// @author       1robots123
// @license MIT
// @match        https://websim.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550417/Websim%20Ungrayscale%20Social%20Icons%20%28Main%20Page%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550417/Websim%20Ungrayscale%20Social%20Icons%20%28Main%20Page%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ungrayscale() {
        const el = document.querySelector('div.hidden.md\\:flex.gap-3.grayscale');
        if (el) {
            el.classList.remove('grayscale');
            console.log("✅ Ungrayscaled Websim social icons!");
        }
    }

    // Run once on load
    ungrayscale();

    // In case the site dynamically injects it after load
    const observer = new MutationObserver(() => ungrayscale());
    observer.observe(document.body, { childList: true, subtree: true });
})();
