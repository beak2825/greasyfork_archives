// ==UserScript==
// @name         MP Image Fix 2026
// @namespace    https://greasyfork.org/users/your-user-id
// @version      2026.3
// @description  Fix broken images on Mangapark, Comicpark, and Readpark
// @author       You
// @match        *://*.mangapark.*/*
// @match        *://*.comicpark.*/*
// @match        *://*.readpark.*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561128/MP%20Image%20Fix%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/561128/MP%20Image%20Fix%202026.meta.js
// ==/UserScript==

(() => {
    const origin = location.origin;

    function getSource(img) {
        return (
            img.getAttribute("data-src") ||
            img.getAttribute("data-original") ||
            img.getAttribute("data-lazy-src") ||
            img.src
        );
    }

    function fix(img) {
        if (!(img instanceof HTMLImageElement)) return;
        if (img.dataset.mpFixed) return;

        const src = getSource(img);
        if (!src) return;

        // Match protocol-relative subdomain images like //s1.domain/path
        const match = src.match(/^\/\/s\d+\.[^/]+(\/.+)$/);
        if (!match) return;

        img.src = origin + match[1];
        img.dataset.mpFixed = "1";
    }

    function scan(root = document) {
        root.querySelectorAll("img").forEach(fix);
    }

    // Initial scan
    scan();

    // Observe dynamically added content
    new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                if (n.nodeType !== 1) continue;
                if (n.tagName === "IMG") fix(n);
                else scan(n);
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
