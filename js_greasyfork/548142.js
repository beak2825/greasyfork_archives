// ==UserScript==
// @name         Auto Translate Any Page v2 (Mobile Ready, Real-Time, Optimized)
// @namespace    https://greasyfork.org/
// @license MIT
// @version      2.0
// @description  Auto-translates any webpage to English in real-time using Google Translate API with caching, batching, and performance optimizations
// @author       GP
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548142/Auto%20Translate%20Any%20Page%20v2%20%28Mobile%20Ready%2C%20Real-Time%2C%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548142/Auto%20Translate%20Any%20Page%20v2%20%28Mobile%20Ready%2C%20Real-Time%2C%20Optimized%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const targetLang = 'en'; // target language
    const batchSize = 10; // number of texts per API call batch
    const observerDebounce = 200; // ms

    const cache = new Map(); // store already translated text
    const nodesToTranslate = new Set(); // batch processing queue

    // Walk DOM and collect text nodes (smart: skip script/style/code/pre)
    function walk(node) {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "" && !node.parentElement.closest('script,style,code,pre')) {
            textNodes.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                textNodes = textNodes.concat(walk(child));
            }
        }
        return textNodes;
    }

    // Store original text for undo/toggle
    function storeOriginal(node) {
        if (!node.dataset.originalText) node.dataset.originalText = node.nodeValue;
    }

    // Batch translate function
    async function batchTranslate(nodes) {
        if (!nodes.length) return;
        const texts = nodes.map(n => n.dataset.originalText);
        const untranslated = texts.map(t => cache.get(t) || t);

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(untranslated.join('\n'))}`;
            const res = await fetch(url);
            const data = await res.json();
            const translatedLines = data[0].map(item => item[0]);

            // Apply translation and cache
            nodes.forEach((node, i) => {
                const translated = translatedLines[i] || node.nodeValue;
                cache.set(node.dataset.originalText, translated);
                node.nodeValue = translated;
            });
        } catch (e) {
            console.error('Batch translation error:', e);
        }
    }

    // Queue nodes and process in batches
    function queueNode(node) {
        storeOriginal(node);
        nodesToTranslate.add(node);

        if (nodesToTranslate.size >= batchSize) {
            const batch = Array.from(nodesToTranslate).splice(0, batchSize);
            batchTranslate(batch);
            batch.forEach(n => nodesToTranslate.delete(n));
        }
    }

    // Process remaining nodes periodically
    setInterval(() => {
        if (nodesToTranslate.size) {
            batchTranslate(Array.from(nodesToTranslate));
            nodesToTranslate.clear();
        }
    }, 1000); // run every second for real-time feel

    // Initial translation
    const initialNodes = walk(document.body);
    initialNodes.forEach(queueNode);

    // Observe dynamic content
    let observerTimeout;
    const observer = new MutationObserver(mutations => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(async () => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(added => {
                    if (added.nodeType === Node.TEXT_NODE) {
                        queueNode(added);
                    } else if (added.nodeType === Node.ELEMENT_NODE) {
                        const newTextNodes = walk(added);
                        newTextNodes.forEach(queueNode);
                    }
                });
            });
        }, observerDebounce);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Observe inputs/textareas
    function observeInputs() {
        document.querySelectorAll('input[type="text"], textarea').forEach(input => {
            input.addEventListener('input', async () => {
                if (!input.dataset.originalText) input.dataset.originalText = input.value;
                const translated = await translateText(input.value);
                input.value = translated;
            });
        });
    }

    // Single text translation (fallback)
    async function translateText(text) {
        if (cache.has(text)) return cache.get(text);
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            const translated = data[0].map(item => item[0]).join('');
            cache.set(text, translated);
            return translated;
        } catch (e) {
            console.error('Translation error:', e);
            return text;
        }
    }

    observeInputs(); // start input observation
})();