// ==UserScript==
// @name         A2 Simulator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simulates misreading
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557094/A2%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/557094/A2%20Simulator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SKIP_TAGS = new Set([
        "SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "OBJECT", "EMBED",
        "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "SVG", "CANVAS", "MATH"
    ]);

    // Simple substring replacement (case-insensitive)
    const RE = /integer/ig;

    function replaceText(text) {
        return text.replace(RE, "real number");
    }

    function shouldSkip(node) {
        let el = node.parentElement;
        while (el) {
            if (SKIP_TAGS.has(el.tagName)) return true;
            if (el.isContentEditable) return true;
            el = el.parentElement;
        }
        return false;
    }

    function processTextNode(node) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return;
        if (shouldSkip(node)) return;

        const original = node.nodeValue;
        const replaced = replaceText(original);

        if (replaced !== original) {
            node.nodeValue = replaced;
        }
    }

    function walk(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim()) processTextNode(node);
        }
    }

    function observe() {
        const obs = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.type === "characterData") {
                    processTextNode(m.target);
                }
                if (m.addedNodes) {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType === Node.TEXT_NODE) processTextNode(n);
                        else if (n.nodeType === Node.ELEMENT_NODE && !SKIP_TAGS.has(n.tagName)) {
                            walk(n);
                        }
                    });
                }
            }
        });

        obs.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function init() {
        walk(document.body);
        observe();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
