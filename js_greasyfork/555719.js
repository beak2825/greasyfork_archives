// ==UserScript==
// @name         Hide AM
// @namespace    https://www.socialdeal.nl/
// @version      0.1
// @description  Stable version
// @author       Me
// @match        https://*.socialdeal.nl/bureaublad/letterkundige.php*
// @match        https://*.socialdeal.be/bureaublad/letterkundige.php*
// @match        https://*.socialdeal.de/bureaublad/letterkundige.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=socialdeal.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555719/Hide%20AM.user.js
// @updateURL https://update.greasyfork.org/scripts/555719/Hide%20AM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This function hides all elements containing "Accountmanager:"
    function hideAccountmanagers() {
        // Select all <i> tags — this is where "Accountmanager" appears
        document.querySelectorAll('i').forEach(el => {
            if (el.textContent.includes('Accountmanager:')) {
                el.style.display = 'none'; // hide the element
            }
        });
    }

    // Run once when the page loads
    hideAccountmanagers();

    // Also run again if new content (like AJAX-loaded tables) is added
    const observer = new MutationObserver(() => hideAccountmanagers());
    observer.observe(document.body, { childList: true, subtree: true });
})();