// ==UserScript==
// @name         Movix.club Anti-Pub Ultimate
// @namespace    movix.club
// @version      2.0
// @description  Movix Anti-Popups & Redirect Blocker
// @match        *://*/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559530/Movixclub%20Anti-Pub%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/559530/Movixclub%20Anti-Pub%20Ultimate.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALLOWED_DOMAIN = "movix.club";

    // 🔒 Ferme immédiatement les pages externes (pubs)
    if (!location.hostname.includes(ALLOWED_DOMAIN)) {
        setTimeout(() => window.close(), 10);
        return;
    }

    // 🚫 Bloque window.open (source principale des pubs)
    window.open = function () {
        console.warn("Popup bloquée");
        return null;
    };

    // 🚫 Bloque les redirections JS
    const block = () => {};
    Object.defineProperty(window.location, 'assign', { value: block });
    Object.defineProperty(window.location, 'replace', { value: block });

    // 🚫 Empêche les iframes pubs dynamiques
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName === "IFRAME") {
                    const src = node.src || "";
                    if (!src.includes(ALLOWED_DOMAIN)) {
                        node.remove();
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
