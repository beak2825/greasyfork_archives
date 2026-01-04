// ==UserScript==
// @name         ZeroWidth Character Detection
// @namespace    https://violentmonkey.github.io/
// @description  Detect and replace zero-width and hidden/non-printable characters with � (U+FFFD) with full performance optimizations.
// @author       Alyssa B. Morton
// @license      MIT
// @icon         https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/regular/shield-halved.svg
// @version      2.6
// @match        *://*/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550818/ZeroWidth%20Character%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/550818/ZeroWidth%20Character%20Detection.meta.js
// ==/UserScript==

/*
==================================================
 ZeroWidth Character Detection
 -------------------------------------------------
 FEATURES:
   - Fine-grained category selection
   - Debounced + throttled MutationObserver
   - Lazy replacement for only visible nodes
   - Filters irrelevant nodes (<script>, <style>, etc.)
   - Replaces only when hidden characters exist
   - Batched processing for efficiency
==================================================
*/

(function () {
    'use strict';

    // ---------- SETTINGS ----------
    const settings = {
        asciiControl: true,   // U+0000–001F, U+007F
        c1Control: true,      // U+0080–U+009F
        zeroWidth: true,      // U+200B, U+200C, U+200D, U+2060, U+FEFF
        otherFormat: true,    // all other Cf chars
        surrogates: true,     // U+D800–U+DFFF
        puaBMP: true,         // U+E000–U+F8FF
        puaPlane15: true,     // U+F0000–U+FFFFD
        puaPlane16: true,     // U+100000–U+10FFFD
        unassigned: true      // Cn
    };

    const marker = '�'; // U+FFFD

    // ---------- REGEX BUILDER ----------
    const parts = [];
    if (settings.asciiControl) parts.push('\x00-\x1F\x7F');
    if (settings.c1Control) parts.push('\x80-\x9F');
    if (settings.zeroWidth) parts.push('\u200B\u200C\u200D\u2060\uFEFF');
    if (settings.otherFormat) parts.push('\\p{Cf}');
    if (settings.surrogates) parts.push('\uD800-\uDFFF');
    if (settings.puaBMP) parts.push('\uE000-\uF8FF');
    if (settings.puaPlane15) parts.push('\uF0000-\uFFFFD');
    if (settings.puaPlane16) parts.push('\u100000-\u10FFFD');
    if (settings.unassigned) parts.push('\\p{Cn}');

    const regex = new RegExp(`[${parts.join('')}]`, 'gu');

    // ---------- NODE FILTER ----------
    function isTextNodeRelevant(node) {
        return (
            node.nodeType === Node.TEXT_NODE &&
            node.parentNode &&
            !['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG'].includes(node.parentNode.nodeName)
        );
    }

    // ---------- LAZY REPLACEMENT ----------
    const observerNodes = new Set();

    function replaceTextNode(node) {
        if (regex.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(regex, marker);
        }
    }

    const intersectionObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const node = entry.target;
                replaceTextNode(node);
                intersectionObserver.unobserve(node);
            }
        }
    });

    function lazyReplace(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            intersectionObserver.observe(node);
        } else {
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            let n;
            while ((n = walker.nextNode())) {
                intersectionObserver.observe(n);
            }
        }
    }

    // ---------- DEBOUNCED + THROTTLED OBSERVER ----------
    let scheduled = false;
    const pendingNodes = new Set();
    const throttleDelay = 100; // ms
    let lastRun = 0;

    function processPending() {
        const now = Date.now();
        if (now - lastRun < throttleDelay) {
            scheduled = false;
            setTimeout(processPending, throttleDelay - (now - lastRun));
            return;
        }
        lastRun = now;
        for (const node of pendingNodes) {
            lazyReplace(node);
        }
        pendingNodes.clear();
        scheduled = false;
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (isTextNodeRelevant(node) || node.nodeType !== Node.TEXT_NODE) {
                    pendingNodes.add(node);
                }
            }
        }
        if (!scheduled) {
            scheduled = true;
            setTimeout(processPending, 50); // debounce
        }
    });

    // ---------- START OBSERVING ----------
    observer.observe(document.body, { subtree: true, childList: true });

    // ---------- INITIAL PAGE SCAN ----------
    lazyReplace(document.body);

})();
