// ==UserScript==
// @name         Wayback Machine live links
// @namespace    ext.columbo.archive
// @version      0.2
// @description  Rewrites external links inside Wayback pages to point to the live site
// @match        https://web.archive.org/web/*/*
// @author       columbo
// @license      MIT
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @downloadURL https://update.greasyfork.org/scripts/561242/Wayback%20Machine%20live%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/561242/Wayback%20Machine%20live%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function rewriteLinks(root = document) {
        const links = root.querySelectorAll('a[href]');
        for (const a of links) {
            const href = a.getAttribute('href');

            if (!href) continue;

            const m = href.match(/^https?:\/\/web\.archive\.org\/web\/\d+(?:[a-z_]*?)\/(https?:\/\/.+)$/i);
            if (m) {
                a.href = m[1];
            }
        }
    }

    rewriteLinks();

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                if (n.nodeType === 1) {
                    rewriteLinks(n);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
