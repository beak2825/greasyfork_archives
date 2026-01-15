// ==UserScript==
// @name         Misreader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Helps you to misread
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557094/Misreader.user.js
// @updateURL https://update.greasyfork.org/scripts/557094/Misreader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SKIP_TAGS = new Set([
        "SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "OBJECT", "EMBED",
        "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "SVG", "CANVAS", "MATH"
    ]);

    function replaceText(text) {
        let t = text;
        t = t.replace(/real/g, "real number");
        t = t.replace(/integer/g, "real number");
        t = t.replace(/real number number/g, "real number");
        t = t.replace(/Real/g, "Real Number");
        t = t.replace(/Integer/g, "Real Number");
        t = t.replace(/Real Number Number/g, "Real Number");
        t = t.replace(/Real Number number/g, "Real Number");
        return t;
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
