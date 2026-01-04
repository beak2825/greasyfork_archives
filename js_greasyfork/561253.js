// ==UserScript==
// @name         Reddit Full Numbers
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Replaces "k" abbreviations with full comma-separated numbers on Reddit for votes and comments
// @author       Rehan Dilawar
// @license      MIT
// @icon         https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Content/Brand%20Page/Reddit_Logo.png
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561253/Reddit%20Full%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/561253/Reddit%20Full%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const format = (n) => parseInt(n).toLocaleString();

    // Pierces through shadow roots to find the hidden faceplate-number elements
    const fixNumbersDeep = (root) => {
        // 1. Find all faceplate-number elements in the current root (light or shadow)
        const targets = root.querySelectorAll('faceplate-number[number]');
        targets.forEach(el => {
            const rawValue = el.getAttribute('number');
            if (rawValue) {
                const fullNum = format(rawValue);
                // Remove 'pretty' to stop Reddit from reverting the change
                if (el.hasAttribute('pretty')) el.removeAttribute('pretty');
                if (el.textContent !== fullNum) el.textContent = fullNum;
            }
        });

        // 2. Recursively find and enter all Shadow Roots of child elements
        const allElements = root.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.shadowRoot) {
                fixNumbersDeep(el.shadowRoot);
            }
        });
    };

    // Robust observer to handle infinite scroll and dynamic Shadow DOM insertion
    const observer = new MutationObserver(() => {
        fixNumbersDeep(document.documentElement);
    });

    // Start watching immediately
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Initial pass
    window.addEventListener('load', () => fixNumbersDeep(document.documentElement));
})();