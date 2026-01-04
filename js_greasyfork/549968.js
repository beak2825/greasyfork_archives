// ==UserScript==
// @name         BQPanel Auto Redirect After Create
// @description  Redirect to lines list after creating a new line
// @match        https://bqpanel.com/lines/create*
// @version 0.0.1.20250918135534
// @namespace https://greasyfork.org/users/1516350
// @downloadURL https://update.greasyfork.org/scripts/549968/BQPanel%20Auto%20Redirect%20After%20Create.user.js
// @updateURL https://update.greasyfork.org/scripts/549968/BQPanel%20Auto%20Redirect%20After%20Create.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Observe DOM changes to detect "User with Name" message
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.textContent.includes("User with Name")) {
                    window.location.href = "https://bqpanel.com/lines?sortAsc=true";
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();