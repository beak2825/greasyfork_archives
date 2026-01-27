// ==UserScript==
// @name         Bluesky Remove Live Events (Card + Button)
// @version      1.2
// @description  Removes the Live Events banner card and its dismiss button on Hot-Classic
// @author       ChatGPT 5.1 CodeGenerator Model
// @license      MIT
// @match        https://bsky.app/profile/bsky.app/feed/hot-classic
// @match        https://bsky.app/?feed=following*
// @match        https://bsky.app/profile/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/1408760
// @downloadURL https://update.greasyfork.org/scripts/564148/Bluesky%20Remove%20Live%20Events%20%28Card%20%2B%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564148/Bluesky%20Remove%20Live%20Events%20%28Card%20%2B%20Button%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IMAGE_PATH = 'live-events.workers.bsky.app/images';
    const DISMISS_LABEL = 'Dismiss live event banner';

    function removeLiveEvent(root = document) {
        /* Remove the main card via image path */
        root.querySelectorAll(`img[src*="${IMAGE_PATH}"]`).forEach(img => {
            const card = img.closest('div[style*="border-radius: 12px"]');
            if (card) card.remove();
        });

        /* Remove the floating dismiss button */
        root.querySelectorAll(`button[aria-label="${DISMISS_LABEL}"]`).forEach(btn => {
            btn.remove();
        });
    }

    // Initial pass
    removeLiveEvent();

    // Watch async DOM updates
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    removeLiveEvent(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();