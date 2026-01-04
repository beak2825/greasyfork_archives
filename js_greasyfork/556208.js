// ==UserScript==
// @name         CHL_Stats_Tab
// @description  Odemkne tlačítko stats
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        https://www.chl.hockey/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556208/CHL_Stats_Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/556208/CHL_Stats_Tab.meta.js
// ==/UserScript==

(function() {

    function processTabs() {
        const containers = document.querySelectorAll('.m-event-tabs');

        containers.forEach(container => {
            const statsTab = container.querySelector('menuitem[data-content-id="stats"]');
            const previewTab = container.querySelector('menuitem[data-content-id="preview"]');

            if (!statsTab || !previewTab) return;

            // Show stats tab
            statsTab.style.display = "inline";

            // Move next to preview (only if not already)
            if (previewTab.nextElementSibling !== statsTab) {
                previewTab.insertAdjacentElement("afterend", statsTab);
            }

            // Make it clickable
            statsTab.onclick = () => {
                window.location.hash = "#tab_event=stats";
            };
        });
    }

    // Run later, after CHL dynamic JS loads content
    function delayedInit() {
        processTabs();
        setTimeout(processTabs, 300);
        setTimeout(processTabs, 1000);
        setTimeout(processTabs, 2000);
    }

    // Observe SPA route changes
    const observer = new MutationObserver(() => {
        if (document.querySelector('.m-event-tabs')) {
            delayedInit();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also try once after load
    window.addEventListener("load", delayedInit);

})();
