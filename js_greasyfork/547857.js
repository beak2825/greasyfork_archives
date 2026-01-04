// ==UserScript==
// @name         Date Display Full Timestamp for coomer.su / coomer.st
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace relative time with actual date from title attribute on coomer.su / coomer.st
// @match        https://coomer.su/*
// @match        https://coomer.st/*
// @grant        none
// @author       Aligator
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/547857/Date%20Display%20Full%20Timestamp%20for%20coomersu%20%20coomerst.user.js
// @updateURL https://update.greasyfork.org/scripts/547857/Date%20Display%20Full%20Timestamp%20for%20coomersu%20%20coomerst.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTimestamps() {
        document.querySelectorAll("time.timestamp").forEach(el => {
            const fullDate = el.getAttribute("title");
            if (fullDate) {
                // Example fullDate: 2024-06-04T23:53:36
                // Split into date and time
                const [datePart, timePart] = fullDate.split("T");
                if (timePart) {
                    const shortTime = timePart.slice(0,5); // HH:MM only
                    const formatted = `${datePart} at ${shortTime}`;
                    if (el.textContent !== formatted) {
                        el.textContent = formatted;
                    }
                }
            }
        });
    }

    // Run once on page load
    updateTimestamps();

    // Observe dynamic content (for infinite scroll / lazy loading)
    const observer = new MutationObserver(updateTimestamps);
    observer.observe(document.body, { childList: true, subtree: true });
})();