// ==UserScript==
// @name         AO3 Hide Muted Users Notification
// @namespace    https://aglioeollieo.neocities.org/misc#script
// @version      1.0
// @description  Hides the "You have muted some users" notification on AO3
// @author       You
// @match        https://archiveofourown.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563126/AO3%20Hide%20Muted%20Users%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/563126/AO3%20Hide%20Muted%20Users%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMutedNotification() {
        const notice = document.querySelector('p.muted.notice');
        if (notice) {
            notice.remove();
        }
    }

    // Run on page load
    window.addEventListener('load', removeMutedNotification);

    // Also handle dynamically loaded content
    const observer = new MutationObserver(removeMutedNotification);
    observer.observe(document.body, { childList: true, subtree: true });
})();
