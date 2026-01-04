// ==UserScript==
// @name         Auto Translate Any Page (Mobile Ready)
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Auto-translates any webpage to English in real-time using Google Translate API
// @author       GP
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548139/Auto%20Translate%20Any%20Page%20%28Mobile%20Ready%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548139/Auto%20Translate%20Any%20Page%20%28Mobile%20Ready%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const targetLang = 'en'; // change this if you want another language

    // Walk through DOM and get text nodes
    function walk(node) {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                textNodes = textNodes.concat(walk(child));
            }
        }
        return textNodes;
    }

    async function translateText(text) {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            console.error('Translation error:', e);
            return text; // fallback to original
        }
    }

    const nodes = walk(document.body);
    for (let node of nodes) {
        const originalText = node.nodeValue;
        translateText(originalText).then(translated => {
            node.nodeValue = translated;
        });
    }

    // Optional: observe future changes for SPAs / dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(async added => {
                if (added.nodeType === Node.TEXT_NODE) {
                    const translated = await translateText(added.nodeValue);
                    added.nodeValue = translated;
                } else if (added.nodeType === Node.ELEMENT_NODE) {
                    const newTextNodes = walk(added);
                    for (let nt of newTextNodes) {
                        const t = await translateText(nt.nodeValue);
                        nt.nodeValue = t;
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();