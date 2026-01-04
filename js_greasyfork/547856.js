// ==UserScript==
// @name         Date Display Full Timestamp for simpcity.su / simpcity.cr
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace relative time with actual date from title attribute on simpcity.su / simpcity.cr
// @match        https://simpcity.su/*
// @match        https://simpcity.cr/*
// @grant        none
// @author       Aligator
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/547856/Date%20Display%20Full%20Timestamp%20for%20simpcitysu%20%20simpcitycr.user.js
// @updateURL https://update.greasyfork.org/scripts/547856/Date%20Display%20Full%20Timestamp%20for%20simpcitysu%20%20simpcitycr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTimes() {
        document.querySelectorAll("time.u-dt").forEach(el => {
            if (el.title && el.textContent !== el.title) {
                el.textContent = el.title; // Replace visible text with full date+time
            }
        });
    }

    // Run once on page load
    updateTimes();

    // Observe for dynamically loaded posts
    const observer = new MutationObserver(updateTimes);
    observer.observe(document.body, { childList: true, subtree: true });
})();