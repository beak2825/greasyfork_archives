// ==UserScript==
// @name         NotebookLM Citation Hider
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0
// @description  NotebookLM 페이지의 인용 버튼을 모두 찾아서 숨깁니다.
// @author       zeronox
// @license      MIT
// @match        https://notebooklm.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548741/NotebookLM%20Citation%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/548741/NotebookLM%20Citation%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleContent = `
        button.citation-marker {
            display: none !important;
        }
    `;

    function applyStyle(rootNode) {
        if (rootNode.querySelector('.hide-citations-style')) {
            return;
        }
        const style = document.createElement('style');
        style.className = 'hide-citations-style';
        style.textContent = styleContent;
        rootNode.appendChild(style);
    }

    function applyStyleToAllShadowRoots(rootNode) {
        applyStyle(rootNode);
        const elements = rootNode.querySelectorAll('*');
        for (const element of elements) {
            if (element.shadowRoot) {
                applyStyle(element.shadowRoot);
            }
        }
    }

    applyStyleToAllShadowRoots(document.body);
    console.log('완료.');

    const observer = new MutationObserver((mutations) => {
        applyStyleToAllShadowRoots(document.body);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();