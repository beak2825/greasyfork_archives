// ==UserScript==
// @name         Hide X Purple-Star Notifications SPA Robust
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hides purple-star notifications on X, works with SPA navigation
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556132/Hide%20X%20Purple-Star%20Notifications%20SPA%20Robust.user.js
// @updateURL https://update.greasyfork.org/scripts/556132/Hide%20X%20Purple-Star%20Notifications%20SPA%20Robust.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentContainer = null;
    let observer = null;

    function hidePurpleStarNotifications(container) {
        if (!container) return;
        const paths = container.querySelectorAll('path');
        paths.forEach(path => {
            const dAttr = path.getAttribute('d');
            if (!dAttr) return;
            if (dAttr.includes("M22.99")) {
                let parent = path.parentElement;
                while (parent && parent.getAttribute('data-testid') !== 'cellInnerDiv') {
                    parent = parent.parentElement;
                }
                if (parent) parent.style.display = 'none';
            }
        });
    }

    function attachObserver(container) {
        if (observer) observer.disconnect(); // disconnect previous observer if any
        observer = new MutationObserver(() => hidePurpleStarNotifications(container));
        observer.observe(container, { childList: true, subtree: true });
        hidePurpleStarNotifications(container);
    }

    function checkNotificationsPage() {
        if (!location.href.includes("/notifications")) {
            currentContainer = null;
            if (observer) observer.disconnect();
            return;
        }

        const container = document.querySelector('div[aria-label="Timeline: Notifications"]');
        if (!container) return;

        if (container !== currentContainer) {
            currentContainer = container;
            attachObserver(container);
        }
    }

    // Check every 500ms for SPA navigation or container changes
    setInterval(checkNotificationsPage, 500);
})();
