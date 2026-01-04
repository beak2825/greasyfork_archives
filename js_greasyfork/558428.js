// ==UserScript==
// @name         Dcard Login Banner Remover
// @namespace    NoNameSpace
// @version      1.0
// @description  Automatically removes mandatory login modals and restores scrolling.
// @match        https://www.dcard.tw/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.dcard.tw
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558428/Dcard%20Login%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/558428/Dcard%20Login%20Banner%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        blockText: "立即加入Dcard", // Detection keyword
        portalSelector: ".__portal" // Target container
    };

    function nukeLoginBanner() {
        const portals = document.querySelectorAll(CONFIG.portalSelector);

        if (portals.length === 0) return;

        portals.forEach(portal => {
            // Optimization: Use .textContent to avoid Reflow
            if (portal.textContent.includes(CONFIG.blockText)) {
                portal.style.display = 'none';

                // Restore scrolling
                document.body?.style.setProperty('overflow-y', 'auto', 'important');
                document.body?.style.setProperty('position', 'static', 'important');
            }
        });
    }

    // Monitor DOM changes to catch dynamically injected modals
    const observer = new MutationObserver(() => {
        nukeLoginBanner();
    });

    // Wait for document.body (Observer initialization)
    const initObserver = setInterval(() => {
        if (document.body) {
            clearInterval(initObserver);

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Initial check
            nukeLoginBanner();
        }
    }, 100);

    // Watch for SPA URL changes (Navigation re-check)
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(nukeLoginBanner, 500);
        }
    });

    if(document.documentElement) {
        urlObserver.observe(document.documentElement, { subtree: true, childList: true });
    }

})();