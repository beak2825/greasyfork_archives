// ==UserScript==
// @name         Disable Walmart Link onClick Hijack
// @namespace    http://tampermonkey.net/
// @version      2025-09-08
// @description  Make links work good.
// @author       You
// @match        https://www.walmart.com/*
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/548872/Disable%20Walmart%20Link%20onClick%20Hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/548872/Disable%20Walmart%20Link%20onClick%20Hijack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // run post-hydration because errors
    setTimeout(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains("uscript-new")) continue;
                        [...document.querySelectorAll("a")].forEach(el => {
                            if (el.classList.contains("uscript-new")) return;

                            const nel = el.cloneNode(true);
                            nel.classList.add("uscript-new");
                            el.parentNode.replaceChild(nel, el);
                        });
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }, 300);
})();