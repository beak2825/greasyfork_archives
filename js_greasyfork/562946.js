// ==UserScript==
// @name         WCP Product Link Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts WCP-0000 patterns to hyperlinks on wcproducts.com
// @match        *://wcproducts.com/*
// @match        *://*.wcproducts.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562946/WCP%20Product%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/562946/WCP%20Product%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pattern = /\bWCP-(\d{4})\b/g;

    function processTextNode(node) {
        const text = node.nodeValue;
        if (!pattern.test(text)) return;

        pattern.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            const link = document.createElement('a');
            link.href = `https://wcproducts.com/products/wcp-${match[1]}`;
            link.textContent = match[0];
            frag.appendChild(link);
            lastIndex = pattern.lastIndex;
        }

        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode.replaceChild(frag, node);
    }

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'A', 'TEXTAREA', 'INPUT'].includes(node.tagName)) {
            Array.from(node.childNodes).forEach(walk);
        }
    }

    walk(document.body);

    new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE) walk(n);
        }));
    }).observe(document.body, { childList: true, subtree: true });
})();