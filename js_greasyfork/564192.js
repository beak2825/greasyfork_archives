// ==UserScript==
// @name         Tusharkpriv
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-clicks the Next button once it becomes available (fast mode)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564192/Tusharkpriv.user.js
// @updateURL https://update.greasyfork.org/scripts/564192/Tusharkpriv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceNextClick() {
        const nextBtn = document.getElementById('next-button');
        if (nextBtn) {
            // Always make it visible and enabled
            nextBtn.style.visibility = 'visible';
            nextBtn.style.display = 'inline';
            nextBtn.disabled = false;

            // If it is clickable, click it
            if (nextBtn.offsetParent !== null) {
                console.log("Clicking Next...");
                nextBtn.click();
            }
        }
    }

    // Run every 100ms (0.1 second)
    setInterval(forceNextClick, 100);
})();