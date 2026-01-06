// ==UserScript==
// @name         Marumori Drake Meme Replacer
// @namespace    https://marumori.io/
// @version      1.0
// @description  Replace ❌ and ⭕ with maru YES and NO on /adventure/ pages
// @match        https://marumori.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/561566/Marumori%20Drake%20Meme%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/561566/Marumori%20Drake%20Meme%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*****************************************************************
     * Configuration
     *****************************************************************/
    const TARGET_PATH = '/adventure/';
    const IMAGE_MAP = {
        '❌': 'https://raw.githubusercontent.com/matskye/maru-image-repository/refs/heads/main/maru_no.webp',
        '⭕': 'https://raw.githubusercontent.com/matskye/maru-image-repository/refs/heads/main/maru_yes.webp'
    };

    /*****************************************************************
     * Utilities
     *****************************************************************/
    function isTargetPage() {
        return location.href.includes(TARGET_PATH);
    }

function createImage(src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.display = 'inline-block';
    img.style.width = '3em';
    img.style.height = '3em';
    img.style.verticalAlign = 'text-bottom';
    img.style.pointerEvents = 'none';
    img.style.transform = 'translateY(1.3em)';
    return img;
}

    /*****************************************************************
     * Core replacement logic
     *****************************************************************/
    function runConversion(root = document.body) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
                    if (!node.nodeValue.includes('❌') && !node.nodeValue.includes('⭕')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                    if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.parentElement.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        for (const textNode of nodes) {
            const fragment = document.createDocumentFragment();
            const text = textNode.nodeValue;

            for (const char of text) {
                if (IMAGE_MAP[char]) {
                    fragment.appendChild(createImage(IMAGE_MAP[char]));
                } else {
                    fragment.appendChild(document.createTextNode(char));
                }
            }

            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }

    /*****************************************************************
     * SPA Observer handling
     *****************************************************************/
    let observer = null;
    let lastUrl = location.href;

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        runConversion(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial run
        runConversion();
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
    }

    // Watch for SPA navigation
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            if (isTargetPage()) {
                startObserver();
            } else {
                stopObserver();
            }
        }
    }, 300);

    // Initial check
    if (isTargetPage()) {
        startObserver();
    }
})();
